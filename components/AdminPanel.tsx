/**
 * @file Panel de control principal para el administrador.
 * Permite la gestión completa de tareas, empleados, secciones y proyectos.
 */
import React, { useState, useEffect } from 'react';
import type { User, Task, Section, JobPosition, Project, Notification } from '../types.ts';
import { useLocalStorage } from '../hooks/useLocalStorage.ts';
import { users as initialUsers } from '../data/users.ts';

import Header from './Header.tsx';
import TaskList from './TaskList.tsx';
import TaskDetail from './TaskDetail.tsx';
import TaskForm from './TaskForm.tsx';
import EmployeeForm from './EmployeeForm.tsx';
import SettingsPanel from './SettingsPanel.tsx';
import NotificationsPanel from './NotificationsPanel.tsx';
import CalendarView from './CalendarView.tsx';

type AdminView = 'list' | 'calendar';

const AdminPanel: React.FC<{ user: User; onLogout: () => void; }> = ({ user, onLogout }) => {
    const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
    const [sections, setSections] = useLocalStorage<Section[]>('sections', []);
    const [jobPositions, setJobPositions] = useLocalStorage<JobPosition[]>('jobPositions', []);
    const [projects, setProjects] = useLocalStorage<Project[]>('projects', []);
    const [employees, setEmployees] = useLocalStorage<User[]>('users', initialUsers.filter(u => u.role === 'employee'));
    const [notifications, setNotifications] = useLocalStorage<Notification[]>('notifications', []);

    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const [isEmployeeFormOpen, setIsEmployeeFormOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<User | null>(null);
    
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [activeSettingsTab, setActiveSettingsTab] = useState<'employees' | 'positions' | 'sections' | 'projects'>('positions');
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    const [currentView, setCurrentView] = useState<AdminView>('list');
    
    // Seed initial data if localStorage is empty
    useEffect(() => {
        if (!localStorage.getItem('seeded')) {
            setSections([
                { id: 'sec-1', name: 'Cocina' },
                { id: 'sec-2', name: 'Sala de Estar' },
                { id: 'sec-3', name: 'Baños' },
                { id: 'sec-4', name: 'Dormitorios' },
                { id: 'sec-5', name: 'Jardín y Exteriores' },
            ]);
            setJobPositions([
                { id: 'jp-1', name: 'Limpieza General' },
                { id: 'jp-2', name: 'Jardinería' },
                { id: 'jp-admin', name: 'Administrador' },
            ]);
             setProjects([
                { id: 'proj-1', name: 'Limpieza de Primavera', description: 'Limpieza profunda de toda la casa.' },
            ]);
            localStorage.setItem('seeded', 'true');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const createNotification = (message: string, userId?: string) => {
        const newNotif: Notification = {
            id: `notif-${Date.now()}`,
            userId: userId || 'all',
            message,
            isRead: false,
            createdAt: Date.now(),
        };
        setNotifications(prev => [...prev, newNotif]);
    };
    
    const handleSaveTask = (taskData: Task) => {
        const isNew = !tasks.some(t => t.id === taskData.id);
        setTasks(prevTasks => {
            if (isNew) {
                createNotification(`Nueva tarea asignada: "${taskData.title}"`, 'all'); // Simplificado para todos
                return [...prevTasks, taskData];
            }
            return prevTasks.map(t => t.id === taskData.id ? taskData : t);
        });
        setIsTaskFormOpen(false);
        setEditingTask(null);
    };

    const handleDeleteTask = (taskId: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
            const taskTitle = tasks.find(t => t.id === taskId)?.title;
            setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
            createNotification(`La tarea "${taskTitle}" ha sido eliminada.`);
            if (selectedTask?.id === taskId) {
                setSelectedTask(null);
            }
        }
    };
    
    const handleUpdateTask = (updatedTask: Task) => {
        setTasks(prevTasks => prevTasks.map(t => t.id === updatedTask.id ? updatedTask : t));
        if (selectedTask?.id === updatedTask.id) {
            setSelectedTask(updatedTask);
        }
    };

    const handleNewTask = () => {
        setEditingTask(null);
        setIsTaskFormOpen(true);
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setIsTaskFormOpen(true);
    };
    
    const handleSaveEmployee = (employeeData: User) => {
        const isNew = !employees.some(e => e.id === employeeData.id);
        setEmployees(prev => {
             const userWithoutPassword = { ...employeeData };
             delete userWithoutPassword.password; // Remove password before saving to state
             if (isNew) {
                return [...prev, userWithoutPassword];
             }
             return prev.map(e => e.id === userWithoutPassword.id ? userWithoutPassword : e);
        });
        setIsEmployeeFormOpen(false);
        setEditingEmployee(null);
        setActiveSettingsTab('employees');
        setIsSettingsOpen(true);
    };
    
    const handleCancelEmployeeForm = () => {
        setIsEmployeeFormOpen(false);
        setEditingEmployee(null);
        setActiveSettingsTab('employees');
        setIsSettingsOpen(true);
    };

    const handleDeleteEmployee = (userId: string) => {
         if (window.confirm('¿Estás seguro de que quieres eliminar este empleado? Las tareas asignadas no se eliminarán.')) {
            setEmployees(prev => prev.filter(e => e.id !== userId));
        }
    };

    const handleAddEmployee = () => {
        setIsSettingsOpen(false);
        setEditingEmployee(null);
        setIsEmployeeFormOpen(true);
    };
    
    const handleEditEmployee = (employee: User) => {
        setIsSettingsOpen(false);
        setEditingEmployee(employee);
        setIsEmployeeFormOpen(true);
    };

    const handleMarkAsRead = (notificationId: string) => {
        setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
    };

    const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;
    
    const NavIconButton = ({ icon, viewName, isActive }: { icon: string, viewName: string, isActive: boolean }) => (
        <button 
            onClick={() => {
                if(viewName === 'list' || viewName === 'calendar') setCurrentView(viewName)
                else if(viewName === 'notifications') setIsNotificationsOpen(true)
                else if(viewName === 'settings') setIsSettingsOpen(true)
            }}
            className={`p-3 rounded-lg relative ${isActive ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-200'}`}
        >
            <span className="material-symbols-outlined">{icon}</span>
            {icon === 'notifications' && unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 block h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {unreadNotificationsCount}
                </span>
            )}
        </button>
    );

    return (
        <div className="bg-slate-100 min-h-screen">
            <Header user={user} onLogout={onLogout} title="Panel Admin" />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow p-2 mb-6 flex justify-center items-center gap-2">
                    <NavIconButton icon="task" viewName="list" isActive={currentView === 'list'} />
                    <NavIconButton icon="calendar_check" viewName="calendar" isActive={currentView === 'calendar'} />
                    <NavIconButton icon="notifications" viewName="notifications" isActive={isNotificationsOpen} />
                    <NavIconButton icon="settings" viewName="settings" isActive={isSettingsOpen} />
                </div>
                
                {currentView === 'list' ? (
                    <TaskList
                        tasks={tasks}
                        users={employees}
                        sections={sections}
                        projects={projects}
                        onSelectTask={setSelectedTask}
                        onUpdateTask={handleUpdateTask}
                        currentUser={user}
                        onEditTask={handleEditTask}
                        onDeleteTask={handleDeleteTask}
                        onNewTask={handleNewTask}
                    />
                ) : (
                    <CalendarView tasks={tasks} sections={sections} onSelectTask={setSelectedTask} />
                )}

            </main>

            {selectedTask && (
                <TaskDetail
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onUpdateTask={handleUpdateTask}
                    users={[...employees, user]} // Include admin for comments
                    sections={sections}
                    projects={projects}
                    currentUser={user}
                />
            )}
            
            {isTaskFormOpen && (
                <TaskForm
                    task={editingTask}
                    onSave={handleSaveTask}
                    onCancel={() => { setIsTaskFormOpen(false); setEditingTask(null); }}
                    sections={sections}
                    employees={employees}
                    projects={projects}
                />
            )}

            {isEmployeeFormOpen && (
                 <EmployeeForm
                    employee={editingEmployee}
                    jobPositions={jobPositions.filter(jp => jp.id !== 'jp-admin')}
                    onSave={handleSaveEmployee}
                    onCancel={handleCancelEmployeeForm}
                />
            )}

            {isSettingsOpen && (
                <SettingsPanel
                    onClose={() => setIsSettingsOpen(false)}
                    sections={sections}
                    setSections={setSections}
                    jobPositions={jobPositions}
                    setJobPositions={setJobPositions}
                    employees={employees}
                    onAddEmployee={handleAddEmployee}
                    onEditEmployee={handleEditEmployee}
                    onDeleteEmployee={handleDeleteEmployee}
                    projects={projects}
                    setProjects={setProjects}
                    tasks={tasks}
                    activeTab={activeSettingsTab}
                    setActiveTab={setActiveSettingsTab}
                />
            )}
            {isNotificationsOpen && (
                <NotificationsPanel
                    notifications={notifications}
                    onClose={() => setIsNotificationsOpen(false)}
                    onMarkAsRead={handleMarkAsRead}
                />
            )}
        </div>
    );
};

export default AdminPanel;