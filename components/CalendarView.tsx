/**
 * @file Componente para visualizar tareas en un calendario.
 */
import React from 'react';
import type { Task, Section } from '../types.ts';

interface CalendarViewProps {
    tasks: Task[];
    sections: Section[];
    onSelectTask: (task: Task) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks, sections, onSelectTask }) => {
    // This is a simplified calendar view. A real implementation would use a library.
    const tasksWithDueDate = tasks
        .filter(t => t.dueDate)
        .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());
    
    const getSectionName = (sectionId: string) => sections.find(s => s.id === sectionId)?.name || 'Sin Sección';

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-bold text-slate-700 mb-4">Calendario de Tareas</h2>
            {tasksWithDueDate.length > 0 ? (
                <div className="space-y-3">
                    {tasksWithDueDate.map(task => (
                        <div 
                            key={task.id} 
                            onClick={() => onSelectTask(task)}
                            className="border rounded-lg p-3 cursor-pointer hover:bg-slate-50 transition-colors"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-slate-800">{task.title}</p>
                                    <p className="text-sm text-slate-500">{getSectionName(task.sectionId)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-sm text-blue-600">
                                        {new Date(task.dueDate!).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                    <p className="text-xs text-slate-500">{task.status === 'completed' ? 'Completada' : 'Pendiente'}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-6 border border-dashed rounded-lg">
                    <p className="text-slate-500">No hay tareas con fecha de entrega.</p>
                </div>
            )}
        </div>
    );
};

export default CalendarView;
