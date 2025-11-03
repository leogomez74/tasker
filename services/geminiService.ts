/**
 * @file Módulo para interactuar con la API de Google Gemini.
 * Proporciona funciones para utilizar las capacidades de IA generativa en la aplicación.
 */

import { GoogleGenAI } from "@google/genai";

// Obtiene la clave de API desde las variables de entorno.
// Es importante que esta variable esté configurada en el entorno de despliegue.
const API_KEY = process.env.API_KEY;

// Advierte en la consola si la clave de API no está configurada.
if (!API_KEY) {
    console.warn("La API_KEY de Gemini no está configurada. Las funciones de IA estarán deshabilitadas.");
}

// Inicializa el cliente de la API de Google GenAI.
// FIX: Ensure apiKey is passed correctly in an object.
const ai = new GoogleGenAI({ apiKey: API_KEY! });

/**
 * Genera una descripción detallada para una tarea utilizando el modelo Gemini.
 * @param {string} title - El título de la tarea, que servirá de base para la descripción.
 * @returns {Promise<string>} Una promesa que se resuelve con la descripción generada.
 */
export const generateTaskDescription = async (title: string): Promise<string> => {
    // Si no hay API_KEY, devuelve un mensaje indicando que la función está deshabilitada.
    if (!API_KEY) {
        return "La función de IA está deshabilitada. Por favor, configure la clave de API.";
    }

    try {
        // Define el prompt que se enviará al modelo de IA.
        const prompt = `Basado en el título de la tarea "${title}", genera una descripción detallada y paso a paso para un empleado del hogar. El tono debe ser claro, educado y fácil de seguir. Usa viñetas o listas numeradas cuando sea apropiado. La respuesta debe estar en español.`;

        // Llama al modelo 'gemini-2.5-flash' para generar contenido.
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        // Devuelve el texto de la respuesta generada.
        return response.text;
    } catch (error) {
        // Captura y registra cualquier error durante la llamada a la API.
        console.error("Error al generar la descripción de la tarea con Gemini:", error);
        return "Hubo un error al generar la descripción con IA. Por favor, inténtelo de nuevo o escríbala manualmente.";
    }
};
