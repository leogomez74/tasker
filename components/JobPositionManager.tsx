/**
 * @file Componente para gestionar los puestos de trabajo.
 */
import React, { useState } from 'react';
import type { JobPosition } from '../types.ts';
import { TrashIcon } from './icons.tsx';

interface JobPositionManagerProps {
    jobPositions: JobPosition[];
    setJobPositions: React.Dispatch<React.SetStateAction<JobPosition[]>>;
}

const JobPositionManager: React.FC<JobPositionManagerProps> = ({ jobPositions, setJobPositions }) => {
    const [newPositionName, setNewPositionName] = useState('');

    const handleAddPosition = () => {
        if (newPositionName.trim() && !jobPositions.find(jp => jp.name.toLowerCase() === newPositionName.trim().toLowerCase())) {
            const newPosition: JobPosition = {
                id: new Date().toISOString(),
                name: newPositionName.trim(),
            };
            setJobPositions([...jobPositions, newPosition]);
            setNewPositionName('');
        }
    };
    
    const handleDeletePosition = (id: string) => {
        setJobPositions(jobPositions.filter(jp => jp.id !== id));
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-bold text-slate-600 mb-2">Gestionar Puestos</h3>
             <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={newPositionName}
                    onChange={(e) => setNewPositionName(e.target.value)}
                    placeholder="Ej: Jardinero"
                    className="flex-grow border border-slate-300 rounded-md shadow-sm p-2"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddPosition()}
                />
                <button onClick={handleAddPosition} className="bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-700">
                    Añadir
                </button>
            </div>
            <div className="flex flex-wrap gap-2">
                {jobPositions.map(position => (
                     <div key={position.id} className="bg-slate-100 rounded-full px-3 py-1 flex items-center gap-2 text-sm">
                        <span>{position.name}</span>
                        <button onClick={() => handleDeletePosition(position.id)} className="text-slate-500 hover:text-red-600" aria-label={`Eliminar puesto ${position.name}`}>
                            <TrashIcon className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JobPositionManager;
