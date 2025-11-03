/**
 * @file Componente para mostrar una lista de empleados.
 */
import React from 'react';
import type { User, JobPosition } from '../types.ts';
import { PencilIcon, TrashIcon, PlusIcon } from './icons.tsx';

interface EmployeeListProps {
    users: User[];
    jobPositions: JobPosition[];
    onAdd: () => void;
    onEdit: (user: User) => void;
    onDelete: (userId: string) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ users, jobPositions, onAdd, onEdit, onDelete }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold text-slate-600">Gestionar Empleados</h3>
                <button 
                    onClick={onAdd}
                    className="flex items-center gap-1 text-sm bg-blue-500 text-white font-semibold py-1 px-3 rounded-lg hover:bg-blue-600"
                >
                    <PlusIcon className="h-4 w-4" />
                    Nuevo
                </button>
            </div>
            {users.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {users.map(user => {
                        const position = jobPositions.find(jp => jp.id === user.jobPositionId);
                        return (
                            <div key={user.id} className="p-2 bg-slate-50 rounded-md">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-slate-800">{user.name}</p>
                                        <p className="text-xs text-slate-500">{position ? position.name : 'Sin Puesto'}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => onEdit(user)} className="text-slate-500 hover:text-blue-600" aria-label={`Editar a ${user.name}`}>
                                            <PencilIcon className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => onDelete(user.id)} className="text-slate-500 hover:text-red-600" aria-label={`Eliminar a ${user.name}`}>
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-2 text-xs text-slate-600 border-t pt-1">
                                    <p>Email: {user.email || 'N/A'}</p>
                                    <p>WhatsApp: {user.whatsappCountryCode && user.whatsappNumber ? `${user.whatsappCountryCode} ${user.whatsappNumber}` : 'N/A'}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-4 border border-dashed rounded-lg">
                    <p className="text-sm text-slate-500">No hay empleados registrados.</p>
                    <button onClick={onAdd} className="mt-2 text-sm text-blue-600 font-semibold hover:underline">
                        Añadir primer empleado
                    </button>
                </div>
            )}
        </div>
    );
};

export default EmployeeList;