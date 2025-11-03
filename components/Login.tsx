/**
 * @file Componente para el formulario de inicio de sesión.
 */
import React, { useState } from 'react';
// FIX: Added .ts extension to import to fix module resolution error.
import type { User } from '../types.ts';
// FIX: Added .ts extension to import to fix module resolution error.
import { users } from '../data/users.ts';

interface LoginProps {
    /**
     * Función callback que se ejecuta cuando el inicio de sesión es exitoso.
     * @param user - El objeto de usuario que ha iniciado sesión.
     */
    onLoginSuccess: (user: User) => void;
}

/**
 * Renderiza un formulario para que los usuarios introduzcan su nombre de usuario y contraseña.
 * Valida las credenciales contra una lista predefinida de usuarios.
 */
const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    /**
     * Maneja el envío del formulario de inicio de sesión.
     * @param e - El evento del formulario.
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        // Busca un usuario que coincida con el nombre de usuario y la contraseña introducidos.
        const foundUser = users.find(u => u.username === username && u.password === password);

        if (foundUser) {
            // Si se encuentra el usuario, se elimina la contraseña por seguridad y se llama al callback.
            const { password, ...userWithoutPassword } = foundUser;
            onLoginSuccess(userWithoutPassword);
        } else {
            // Si no se encuentra, se muestra un mensaje de error.
            setError('Usuario o contraseña incorrectos.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100">
            <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center text-blue-600">Asistente de Tareas</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="text-sm font-bold text-slate-600 block">
                            Usuario
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 mt-1 text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="admin o demo"
                            required
                            autoCapitalize="none"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="text-sm font-bold text-slate-600 block">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 mt-1 text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    {error && <p className="text-sm text-center text-red-500">{error}</p>}
                    <button
                        type="submit"
                        className="w-full py-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        Iniciar Sesión
                    </button>
                    <div className="text-xs text-center text-slate-500 pt-4 border-t">
                        <p className="font-semibold mt-2">Usuarios de prueba:</p>
                        <p><strong>Admin:</strong> admin / admin</p>
                        <p><strong>Usuario:</strong> demo / demo</p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;