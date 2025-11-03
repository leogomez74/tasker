import React, { useState, useMemo } from 'react';
import type { Project, Task } from '../types.ts';
import { TrashIcon } from './icons.tsx';

interface ProjectManagerProps {
    projects: Project[];
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
    tasks: Task[];
}

const ProjectManager: React.FC<ProjectManagerProps> = ({ projects, setProjects, tasks }) => {
    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectDescription, setNewProjectDescription] = useState('');

    const tasksPerProject = useMemo(() => {
        const counts = new Map<string, number>();
        tasks.forEach(task => {
            if (task.projectId) {
                counts.set(task.projectId, (counts.get(task.projectId) || 0) + 1);
            }
        });
        return counts;
    }, [tasks]);

    const handleAddProject = () => {
        if (newProjectName.trim()) {
            const newProject: Project = {
                id: `proj-${Date.now()}`,
                name: newProjectName.trim(),
                description: newProjectDescription.trim(),
            };
            setProjects([...projects, newProject]);
            setNewProjectName('');
            setNewProjectDescription('');
        }
    };
    
    const handleDeleteProject = (id: string) => {
        if (tasksPerProject.has(id) && tasksPerProject.get(id)! > 0) {
            alert('No se puede eliminar un proyecto que tiene tareas asignadas. Por favor, reasigne las tareas primero.');
            return;
        }
        setProjects(projects.filter(p => p.id !== id));
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-bold text-slate-600 mb-2">Gestionar Proyectos</h3>
            <div className="bg-slate-50 p-4 rounded-lg border mb-6">
                <div className="space-y-3">
                     <div>
                        <label htmlFor="projectName" className="block text-sm font-medium text-slate-700">Nombre del Proyecto</label>
                        <input
                            id="projectName"
                            type="text"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            placeholder="Ej: Limpieza de Primavera"
                            className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                     <div>
                        <label htmlFor="projectDesc" className="block text-sm font-medium text-slate-700">Descripción (Opcional)</label>
                        <textarea
                            id="projectDesc"
                            value={newProjectDescription}
                            onChange={(e) => setNewProjectDescription(e.target.value)}
                            rows={2}
                            placeholder="Breve descripción del objetivo del proyecto"
                            className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                </div>
                 <div className="mt-3 flex justify-end">
                    <button onClick={handleAddProject} className="bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-700">
                        Añadir Proyecto
                    </button>
                 </div>
            </div>

            <div className="space-y-2">
                {projects.map(project => {
                    const taskCount = tasksPerProject.get(project.id) || 0;
                    const canDelete = taskCount === 0;
                    return (
                        <div key={project.id} className="p-3 bg-slate-50 rounded-md flex justify-between items-start">
                           <div>
                                <h4 className="font-semibold text-slate-800">{project.name}</h4>
                                <p className="text-sm text-slate-600">{project.description}</p>
                                <p className="text-xs text-slate-500 mt-1">{taskCount} tarea(s) asignada(s)</p>
                           </div>
                            <div className="relative group">
                                <button 
                                    onClick={() => handleDeleteProject(project.id)} 
                                    className={`p-1 rounded-full ${canDelete ? 'text-slate-500 hover:bg-red-100 hover:text-red-600' : 'text-slate-300 cursor-not-allowed'}`}
                                    aria-label={`Eliminar proyecto ${project.name}`}
                                    disabled={!canDelete}
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                                {!canDelete && (
                                    <div className="absolute bottom-full mb-2 right-0 w-48 bg-slate-700 text-white text-xs rounded-md p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        Reasigne las tareas de este proyecto antes de eliminarlo.
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProjectManager;
