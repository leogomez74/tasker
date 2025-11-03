/**
 * @file Componente para gestionar las secciones de la casa (ej: Cocina, Baño).
 */
import React, { useState } from 'react';
// FIX: Added .ts extension to import to fix module resolution error.
import type { Section } from '../types.ts';
// FIX: Added .tsx extension to import to fix module resolution error.
import { TrashIcon } from './icons.tsx';

interface SectionManagerProps {
    sections: Section[];
    setSections: React.Dispatch<React.SetStateAction<Section[]>>;
}

/**
 * Renderiza una interfaz para que el administrador pueda añadir y eliminar secciones.
 * Las secciones se usan para categorizar las tareas.
 */
const SectionManager: React.FC<SectionManagerProps> = ({ sections, setSections }) => {
    const [newSectionName, setNewSectionName] = useState('');

    /**
     * Añade una nueva sección a la lista, evitando duplicados.
     */
    const handleAddSection = () => {
        if (newSectionName.trim() && !sections.find(s => s.name.toLowerCase() === newSectionName.trim().toLowerCase())) {
            const newSection: Section = {
                id: new Date().toISOString(),
                name: newSectionName.trim(),
            };
            setSections([...sections, newSection]);
            setNewSectionName('');
        }
    };

    /**
     * Elimina una sección de la lista.
     * @param id - El ID de la sección a eliminar.
     */
    const handleDeleteSection = (id: string) => {
        setSections(sections.filter(s => s.id !== id));
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-bold text-slate-600 mb-2">Gestionar Secciones</h3>
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={newSectionName}
                    onChange={(e) => setNewSectionName(e.target.value)}
                    placeholder="Ej: Cocina, Baño Principal"
                    className="flex-grow border border-slate-300 rounded-md shadow-sm p-2"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSection()}
                />
                <button onClick={handleAddSection} className="bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-700">
                    Añadir
                </button>
            </div>
            <div className="flex flex-wrap gap-2">
                {sections.map(section => (
                    <div key={section.id} className="bg-slate-100 rounded-full px-3 py-1 flex items-center gap-2 text-sm">
                        <span>{section.name}</span>
                        <button onClick={() => handleDeleteSection(section.id)} className="text-slate-500 hover:text-red-600" aria-label={`Eliminar sección ${section.name}`}>
                            <TrashIcon className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SectionManager;