/**
 * @file Hook personalizado de React para persistir el estado en `localStorage`.
 * Permite que el estado de un componente se guarde en el navegador y se
 * recupere en futuras sesiones.
 */

import { useState, useEffect } from 'react';

/**
 * Un hook que sincroniza el estado de un componente con el `localStorage` del navegador.
 * @template T - El tipo del valor que se va a almacenar.
 * @param {string} key - La clave bajo la cual se almacenará el valor en `localStorage`.
 * @param {T} initialValue - El valor inicial que se usará si no hay nada en `localStorage`.
 * @returns Un array con el valor del estado y una función para actualizarlo, similar a `useState`.
 */
export function useLocalStorage<T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    // Inicializa el estado, intentando leer primero desde localStorage.
    const [storedValue, setStoredValue] = useState<T>(() => {
        // Si el código se ejecuta en el servidor (SSR), devuelve el valor inicial.
        if (typeof window === 'undefined') {
            return initialValue;
        }
        try {
            // Intenta obtener el valor de localStorage.
            const item = window.localStorage.getItem(key);
            // Si existe, lo parsea. Si no, usa el valor inicial.
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            // Si hay un error (ej. JSON malformado), lo registra y devuelve el valor inicial.
            console.error(error);
            return initialValue;
        }
    });

    /**
     * Una versión envuelta de la función `setValue` de `useState` que también
     * actualiza el `localStorage`.
     * @param value - El nuevo valor o una función que devuelve el nuevo valor.
     */
    const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
        try {
            // Permite el uso de una función para actualizar el estado, como en useState.
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            // Actualiza el estado en React.
            setStoredValue(valueToStore);
            // Si estamos en el navegador, guarda el nuevo valor en localStorage.
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Efecto para escuchar cambios en localStorage desde otras pestañas.
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === key) {
                try {
                    setStoredValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
                } catch (error) {
                    console.error(error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        // Limpia el event listener cuando el componente se desmonta.
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key, initialValue]);

    return [storedValue, setValue];
}
