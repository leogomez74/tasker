import React from 'react';
import type { User } from '../types';

interface HeaderProps {
    user: User;
    onLogout: () => void;
    title: string;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, title }) => {
    return (
        <header className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="font-semibold text-slate-700">{user.name}</p>
                            <p className="text-sm text-slate-500 capitalize">{user.role}</p>
                        </div>
                        <button 
                            onClick={onLogout}
                            className="bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
