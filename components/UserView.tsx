/**
 * @file Vista principal para el usuario empleado.
 * Muestra las tareas asignadas y permite interactuar con ellas.
 */
import React, { useState, useMemo } from 'react';
import type { User, Task, Section, Project, Notification } from '../types.ts';
import { useLocalStorage } from '../hooks/useLocalStorage.ts';

import Header from './Header.tsx';
import TaskList from './TaskList.tsx';
import TaskDetail from './TaskDetail.tsx';
import NotificationsPanel from './NotificationsPanel.tsx';
import CalendarView from './CalendarView.tsx';
import { users as allUsers } from '../data/users.ts';

type UserViewType = 'list' | 'calendar';

interface UserViewProps {
    user: User;
    onLogout: () => void;
}

const UserView: React.FC<UserViewProps> = ({ user, onLogout }) => {
    const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
    const [sections] = useLocalStorage<Section[]>('sections', []);
    const [projects] = useLocalStorage<Project[]>('projects', []);
    const [notifications, setNotifications] = useLocalStorage<Notification[]>('notifications', []);

    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [currentView, setCurrentView] = useState<UserViewType>('list');

    const myTasks = useMemo(() => {
        return tasks.filter(task => task.assignedTo.includes(user.id));
    }, [tasks, user.id]);

    const unreadNotificationsCount = useMemo(() => {
        return notifications.filter(n => !n.isRead && (n.userId === 'all' || n.userId === user.id)).length;
    }, [notifications, user.id]);

    const handleUpdateTask = (updatedTask: Task) => {
        setTasks(prevTasks => prevTasks.map(t => t.id === updatedTask.id ? updatedTask : t));
        if (selectedTask?.id === updatedTask.id) {
            setSelectedTask(updatedTask);
        }
    };

    const handleMarkAsRead = (notificationId: string) => {
        setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
    };

    const NavIconButton = ({ icon, viewName, isActive }: { icon: string, viewName: string, isActive: boolean }) => (
        <button 
            onClick={() => {
                if(viewName === 'list' || viewName === 'calendar') setCurrentView(viewName as UserViewType)
                else if(viewName === 'notifications') setIsNotificationsOpen(true)
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
            <Header user={user} onLogout={onLogout} title="Mis Tareas" />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                 <div className="bg-white rounded-lg shadow p-2 mb-6 flex justify-center items-center gap-2">
                    <NavIconButton icon="task" viewName="list" isActive={currentView === 'list'} />
                    <NavIconButton icon="calendar_check" viewName="calendar" isActive={currentView === 'calendar'} />
                    <NavIconButton icon="notifications" viewName="notifications" isActive={isNotificationsOpen} />
                 </div>

                {currentView === 'list' ? (
                    <TaskList
                        tasks={myTasks}
                        users={allUsers}
                        sections={sections}
                        projects={projects}
                        onSelectTask={setSelectedTask}
                        onUpdateTask={handleUpdateTask}
                        currentUser={user}
                        isUserView={true}
                    />
                ) : (
                    <CalendarView tasks={myTasks} sections={sections} onSelectTask={setSelectedTask} />
                )}
            </main>

            {selectedTask && (
                <TaskDetail
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onUpdateTask={handleUpdateTask}
                    users={allUsers}
                    sections={sections}
                    projects={projects}
                    currentUser={user}
                />
            )}

            {isNotificationsOpen && (
                <NotificationsPanel
                    notifications={notifications.filter(n => n.userId === 'all' || n.userId === user.id)}
                    onClose={() => setIsNotificationsOpen(false)}
                    onMarkAsRead={handleMarkAsRead}
                />
            )}
        </div>
    );
};

export default UserView;