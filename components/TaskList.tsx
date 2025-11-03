import React from 'react';
// FIX: Added .ts extension to import to fix module resolution error. Also import Project.
import type { Task, User, Section, Project } from '../types.ts';
// FIX: Added .tsx extension to import to fix module resolution error.
import { PlusIcon, PencilIcon, TrashIcon, CheckIcon } from './icons.tsx';

interface TaskListProps {
    tasks: Task[];
    users: User[];
    sections: Section[];
    onSelectTask: (task: Task) => void;
    onUpdateTask: (task: Task) => void;
    currentUser: User;
    // FIX: Add missing projects prop.
    projects?: Project[];
    // Admin-only props
    onEditTask?: (task: Task) => void;
    onDeleteTask?: (taskId: string) => void;
    onNewTask?: () => void;
    isUserView?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, users, sections, projects = [], onSelectTask, onUpdateTask, currentUser, onEditTask, onDeleteTask, onNewTask, isUserView = false }) => {
    
    const getSectionName = (sectionId: string) => sections.find(s => s.id === sectionId)?.name || 'Sin Sección';
    const getProjectName = (projectId?: string) => projects.find(p => p.id === projectId)?.name;
    
    const priorityClasses = {
        low: 'bg-green-100 text-green-800',
        medium: 'bg-yellow-100 text-yellow-800',
        high: 'bg-red-100 text-red-800',
    };

    const statusMap: { [key: string]: string } = {
        pending: 'Pendiente',
        in_progress: 'En Progreso',
        completed: 'Completada',
        needs_review: 'Necesita Revisión'
    };

    const handleStatusChange = (task: Task, newStatus: Task['status']) => {
        const updatedTask = { 
            ...task, 
            status: newStatus, 
            updatedAt: Date.now(),
            ...(newStatus === 'completed' && { completedById: currentUser.id, completedAt: Date.now() })
        };
        onUpdateTask(updatedTask);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-700">{isUserView ? 'Mis Tareas Asignadas' : 'Lista de Tareas'}</h2>
                {!isUserView && onNewTask && (
                    <button onClick={onNewTask} className="flex items-center gap-1 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">
                        <PlusIcon className="h-5 w-5" />
                        Nueva Tarea
                    </button>
                )}
            </div>
             {tasks.length > 0 ? (
                <div className="space-y-3">
                    {tasks.sort((a,b) => a.createdAt - b.createdAt).map(task => {
                        const projectName = getProjectName(task.projectId);
                        return(
                        <div key={task.id} className="border rounded-lg p-3 hover:bg-slate-50 transition-colors">
                            <div className="flex justify-between items-start">
                                <div className="flex-grow cursor-pointer" onClick={() => onSelectTask(task)}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${priorityClasses[task.priority]}`}>{task.priority.toUpperCase()}</span>
                                        <span className="text-sm font-medium text-slate-500">{getSectionName(task.sectionId)}</span>
                                         {projectName && (
                                            <span className="text-xs font-semibold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full">
                                                # {projectName}
                                            </span>
                                        )}
                                    </div>
                                    <p className="font-bold text-slate-800">{task.title}</p>
                                    
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                                    {isUserView && task.status !== 'completed' && (
                                         <button onClick={() => handleStatusChange(task, 'completed')} className="flex items-center gap-1 text-sm bg-green-500 text-white font-semibold py-1 px-3 rounded-lg hover:bg-green-600">
                                            <CheckIcon className="h-4 w-4" />
                                            Marcar como Completada
                                        </button>
                                    )}
                                    {!isUserView && onEditTask && onDeleteTask && (
                                        <>
                                            <button onClick={() => onEditTask(task)} className="text-slate-500 hover:text-blue-600" aria-label={`Editar tarea ${task.title}`}><PencilIcon /></button>
                                            <button onClick={(e) => { e.stopPropagation(); onDeleteTask(task.id); }} className="text-slate-500 hover:text-red-600" aria-label={`Eliminar tarea ${task.title}`}><TrashIcon /></button>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="mt-2 text-sm text-slate-600 flex justify-between items-center">
                                <span>Estado: <span className="font-semibold">{statusMap[task.status]}</span></span>
                                {task.dueDate && <span>Vence: {new Date(task.dueDate).toLocaleDateString()}</span>}
                            </div>
                        </div>
                    )})}
                </div>
            ) : (
                <div className="text-center py-6 border border-dashed rounded-lg">
                    <p className="text-slate-500">{isUserView ? 'No tienes tareas asignadas.' : 'No hay tareas creadas.'}</p>
                </div>
            )}
        </div>
    );
};

export default TaskList;