import React from 'react';
import type { Notification } from '../types';
import { XMarkIcon, CheckIcon } from './icons';

interface NotificationsPanelProps {
    notifications: Notification[];
    onClose: () => void;
    onMarkAsRead: (notificationId: string) => void;
    // onMarkAllAsRead: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications, onClose, onMarkAsRead }) => {
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col">
                <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-slate-800">Notificaciones</h2>
                        <button type="button" onClick={onClose} className="text-slate-500 hover:text-slate-800">
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>
                 <div className="p-4 flex-grow overflow-y-auto">
                    {notifications.length > 0 ? (
                        <div className="space-y-2">
                        {notifications.slice().sort((a, b) => b.createdAt - a.createdAt).map(notification => (
                            <div 
                                key={notification.id} 
                                className={`p-3 rounded-md border-l-4 ${!notification.isRead ? 'bg-blue-50 border-blue-500' : 'bg-slate-50 border-slate-300'}`}
                            >
                                <p className="text-sm text-slate-700">{notification.message}</p>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-xs text-slate-500">{new Date(notification.createdAt).toLocaleString()}</span>
                                    {!notification.isRead && (
                                        <button 
                                            onClick={() => onMarkAsRead(notification.id)}
                                            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                                        >
                                            <CheckIcon className="h-4 w-4"/>
                                            Marcar como leída
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center">
                            <p className="text-center text-slate-500">No tienes notificaciones nuevas.</p>
                        </div>
                    )}
                </div>
                 <div className="bg-slate-50 px-6 py-3 flex justify-between items-center rounded-b-lg border-t">
                    <button 
                        type="button" 
                        // onClick={onMarkAllAsRead}
                        className="text-sm font-semibold text-blue-600 hover:underline"
                    >
                        Marcar todas como leídas
                    </button>
                    <button type="button" onClick={onClose} className="bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300">Cerrar</button>
                </div>
            </div>
        </div>
    );
};

export default NotificationsPanel;