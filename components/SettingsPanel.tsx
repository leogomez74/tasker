/**
 * @file Panel de ajustes para el administrador.
 * Centraliza la gestión de Empleados, Puestos, Secciones y Proyectos.
 */
import React from 'react';
import { XMarkIcon } from './icons.tsx';
import type { Section, JobPosition, User, Project, Task } from '../types.ts';
import EmployeeList from './EmployeeList.tsx';
import SectionManager from './SectionManager.tsx';
import JobPositionManager from './JobPositionManager.tsx';
import ProjectManager from './ProjectManager.tsx';

type Tab = 'employees' | 'positions' | 'sections' | 'projects';

interface SettingsPanelProps {
    onClose: () => void;
    sections: Section[];
    setSections: React.Dispatch<React.SetStateAction<Section[]>>;
    jobPositions: JobPosition[];
    setJobPositions: React.Dispatch<React.SetStateAction<JobPosition[]>>;
    employees: User[];
    onAddEmployee: () => void;
    onEditEmployee: (user: User) => void;
    onDeleteEmployee: (userId: string) => void;
    projects: Project[];
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
    tasks: Task[];
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
    onClose,
    sections,
    setSections,
    jobPositions,
    setJobPositions,
    employees,
    onAddEmployee,
    onEditEmployee,
    onDeleteEmployee,
    projects,
    setProjects,
    tasks,
    activeTab,
    setActiveTab,
}) => {
    
    const renderTabContent = () => {
        switch (activeTab) {
            case 'employees':
                return (
                    <EmployeeList 
                        users={employees}
                        jobPositions={jobPositions}
                        onAdd={onAddEmployee}
                        onEdit={onEditEmployee}
                        onDelete={onDeleteEmployee}
                    />
                );
            case 'positions':
                return <JobPositionManager jobPositions={jobPositions} setJobPositions={setJobPositions} />;
            case 'sections':
                return <SectionManager sections={sections} setSections={setSections} />;
            case 'projects':
                return <ProjectManager projects={projects} setProjects={setProjects} tasks={tasks} />;
            default:
                return null;
        }
    };

    const TabButton: React.FC<{ tabName: Tab; label: string }> = ({ tabName, label }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === tabName
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-200'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl h-[80vh] flex flex-col">
                <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-slate-800">Ajustes Generales</h2>
                        <button type="button" onClick={onClose} className="text-slate-500 hover:text-slate-800">
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>
                <div className="p-4 border-b">
                    <div className="flex items-center gap-2">
                        <TabButton tabName="positions" label="Puestos" />
                        <TabButton tabName="employees" label="Empleados" />
                        <TabButton tabName="sections" label="Secciones" />
                        <TabButton tabName="projects" label="Proyectos" />
                    </div>
                </div>
                <div className="p-6 flex-grow overflow-y-auto">
                    {renderTabContent()}
                </div>
                 <div className="bg-slate-50 px-6 py-3 flex justify-end gap-3 rounded-b-lg border-t">
                    <button type="button" onClick={onClose} className="bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300">Cerrar</button>
                </div>
            </div>
        </div>
    );
};

export default SettingsPanel;