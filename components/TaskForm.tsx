import React, { useState, useEffect } from 'react';
// FIX: Added .ts extension to import to fix module resolution error. Also import Project type.
import type { Task, Section, User, Project } from '../types.ts';
// FIX: Added .tsx extension to import to fix module resolution error.
import { XMarkIcon, SparklesIcon } from './icons.tsx';
// FIX: Added .ts extension to import to fix module resolution error.
import { generateTaskDescription } from '../services/geminiService.ts';

interface TaskFormProps {
    task: Task | null;
    onSave: (task: Task) => void;
    onCancel: () => void;
    sections: Section[];
    employees: User[];
    // FIX: Add missing projects prop.
    projects: Project[];
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSave, onCancel, sections, employees, projects }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        sectionId: '',
        projectId: '',
        assignedTo: [] as string[],
        priority: 'medium' as 'low' | 'medium' | 'high',
        dueDate: '',
    });
    const [isGenerating, setIsGenerating] = useState(false);

    const isEditing = !!task;

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description,
                sectionId: task.sectionId,
                projectId: task.projectId || '',
                assignedTo: task.assignedTo,
                priority: task.priority,
                dueDate: task.dueDate || '',
            });
        } else {
             // Set default section for new task
             if (sections.length > 0) {
                setFormData(prev => ({ ...prev, sectionId: sections[0].id }));
            }
        }
    }, [task, sections]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, options } = e.target;
        const value = Array.from(options).filter(option => option.selected).map(option => option.value);
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGenerateDescription = async () => {
        if (!formData.title) {
            alert("Por favor, introduce un título para la tarea antes de generar la descripción.");
            return;
        }
        setIsGenerating(true);
        try {
            const description = await generateTaskDescription(formData.title);
            setFormData(prev => ({...prev, description }));
        } catch (error) {
            console.error("Error generating description:", error);
            // Optionally show an error to the user
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const now = Date.now();
        const taskData: Task = {
            id: task?.id || `task-${now}`,
            title: formData.title,
            description: formData.description,
            sectionId: formData.sectionId,
            projectId: formData.projectId || undefined,
            assignedTo: formData.assignedTo,
            priority: formData.priority,
            dueDate: formData.dueDate || undefined,
            status: task?.status || 'pending',
            createdAt: task?.createdAt || now,
            updatedAt: now,
            comments: task?.comments || [],
            isRecurring: task?.isRecurring || false,
        };
        onSave(taskData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-slate-800">{isEditing ? 'Editar Tarea' : 'Nueva Tarea'}</h2>
                            <button type="button" onClick={onCancel} className="text-slate-500 hover:text-slate-800">
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto p-1">
                             <div>
                                <label htmlFor="title" className="block text-sm font-medium text-slate-700">Título</label>
                                <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2" required />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-slate-700">Descripción</label>
                                <div className="relative">
                                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2" required />
                                    <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="absolute bottom-2 right-2 flex items-center gap-1 text-xs bg-blue-100 text-blue-700 font-semibold py-1 px-2 rounded-md hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                        <SparklesIcon className="h-4 w-4" />
                                        {isGenerating ? 'Generando...' : 'Generar con IA'}
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="sectionId" className="block text-sm font-medium text-slate-700">Sección</label>
                                    <select id="sectionId" name="sectionId" value={formData.sectionId} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2" required>
                                        {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="projectId" className="block text-sm font-medium text-slate-700">Proyecto</label>
                                    <select id="projectId" name="projectId" value={formData.projectId} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2">
                                        <option value="">Sin Proyecto</option>
                                        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="priority" className="block text-sm font-medium text-slate-700">Prioridad</label>
                                <select id="priority" name="priority" value={formData.priority} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2" required>
                                    <option value="low">Baja</option>
                                    <option value="medium">Media</option>
                                    <option value="high">Alta</option>
                                </select>
                            </div>
                             <div>
                                <label htmlFor="assignedTo" className="block text-sm font-medium text-slate-700">Asignar a</label>
                                <select id="assignedTo" name="assignedTo" multiple value={formData.assignedTo} onChange={handleMultiSelectChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 h-24" required>
                                    {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                </select>
                            </div>
                             <div>
                                <label htmlFor="dueDate" className="block text-sm font-medium text-slate-700">Fecha de Entrega</label>
                                <input type="date" id="dueDate" name="dueDate" value={formData.dueDate} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-50 px-6 py-3 flex justify-end gap-3 rounded-b-lg">
                        <button type="button" onClick={onCancel} className="bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300">Cancelar</button>
                        <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">Guardar Tarea</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default TaskForm;