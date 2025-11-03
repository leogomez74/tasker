/**
 * @file Componente para mostrar los detalles de una tarea en una vista modal.
 */
import React from 'react';
import type { Task, User, Section, Project, Comment } from '../types.ts';
import { XMarkIcon } from './icons.tsx';
import CommentSection from './CommentSection.tsx';

// FIX: This entire file was missing its implementation.
// It has been created to provide the task detail modal functionality.

interface TaskDetailProps {
    task: Task;
    users: User[];
    sections: Section[];
    projects: Project[];
    currentUser: User;
    onClose: () => void;
    onUpdateTask: (task: Task) => void;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ task, users, sections, projects, currentUser, onClose, onUpdateTask }) => {

    const getSectionName = (id: string) => sections.find(s => s.id === id)?.name || 'N/A';
    const getProjectName = (id?: string) => id ? projects.find(p => p.id === id)?.name : null;
    const getAssignedUsers = (ids: string[]) => users.filter(u => ids.includes(u.id));

    const priorityMap = {
        low: { label: 'Baja', classes: 'bg-green-100 text-green-800' },
        medium: { label: 'Media', classes: 'bg-yellow-100 text-yellow-800' },
        high: { label: 'Alta', classes: 'bg-red-100 text-red-800' },
    };

    const statusMap = {
        pending: 'Pendiente',
        in_progress: 'En Progreso',
        completed: 'Completada',
        needs_review: 'Necesita Revisión'
    };

    const handleAddComment = (content: string) => {
        const newComment: Comment = {
            id: `comment-${Date.now()}`,
            authorId: currentUser.id,
            authorName: currentUser.name,
            content,
            timestamp: Date.now(),
        };
        const updatedTask = { ...task, comments: [...task.comments, newComment], updatedAt: Date.now() };
        onUpdateTask(updatedTask);
    };

    const projectName = getProjectName(task.projectId);
    const assignedUsers = getAssignedUsers(task.assignedTo);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b">
                    <div className="flex justify-between items-start">
                        <div>
                             <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${priorityMap[task.priority].classes}`}>{priorityMap[task.priority].label}</span>
                                <span className="text-sm font-medium text-slate-500">{getSectionName(task.sectionId)}</span>
                                {projectName && (
                                    <span className="text-xs font-semibold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full">
                                        # {projectName}
                                    </span>
                                )}
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800">{task.title}</h2>
                        </div>
                        <button type="button" onClick={onClose} className="text-slate-500 hover:text-slate-800">
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                <div className="p-6 flex-grow overflow-y-auto">
                    <div className="prose max-w-none text-slate-700">
                        <p className="whitespace-pre-wrap">{task.description}</p>
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="bg-slate-50 p-3 rounded-lg">
                            <h4 className="font-semibold text-slate-600 mb-1">Estado</h4>
                            <p>{statusMap[task.status]}</p>
                        </div>
                         <div className="bg-slate-50 p-3 rounded-lg">
                            <h4 className="font-semibold text-slate-600 mb-1">Fecha de Entrega</h4>
                            <p>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No definida'}</p>
                        </div>
                         <div className="bg-slate-50 p-3 rounded-lg col-span-1 md:col-span-2">
                            <h4 className="font-semibold text-slate-600 mb-1">Asignado a</h4>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {assignedUsers.length > 0 ? assignedUsers.map(u => (
                                    <span key={u.id} className="bg-slate-200 text-slate-800 px-2 py-1 rounded-full text-xs">{u.name}</span>
                                )) : <span className="text-slate-500">Nadie asignado</span>}
                            </div>
                        </div>
                    </div>
                    
                    <CommentSection comments={task.comments} currentUser={currentUser} onAddComment={handleAddComment} />
                </div>
                
                <div className="bg-slate-50 px-6 py-3 flex justify-end gap-3 rounded-b-lg border-t">
                    <button type="button" onClick={onClose} className="bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300">Cerrar</button>
                </div>
            </div>
        </div>
    );
};

export default TaskDetail;
