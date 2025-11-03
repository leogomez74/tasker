/**
 * @file Punto de entrada de la aplicación React.
 * Este archivo se encarga de renderizar el componente raíz `App` en el DOM.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
// FIX: Added .tsx extension to import to fix module resolution error.
import App from './App.tsx';

// Se busca el elemento raíz en el HTML donde se montará la aplicación.
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("No se pudo encontrar el elemento raíz para montar la aplicación.");
}

// Se utiliza la API `createRoot` de React 18 para renderizar la aplicación.
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);