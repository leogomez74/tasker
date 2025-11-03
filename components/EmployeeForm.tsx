/**
 * @file Componente de formulario para crear o editar empleados.
 */
import React, { useState, useEffect } from 'react';
import type { User, JobPosition } from '../types.ts';
import { XMarkIcon } from './icons.tsx';
import { countries } from '../data/countries.ts';

interface EmployeeFormProps {
    employee: User | null;
    jobPositions: JobPosition[];
    onSave: (employee: User) => void;
    onCancel: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, jobPositions, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        email: '',
        whatsappCountryCode: '+506', // Default to Costa Rica
        whatsappNumber: '',
        jobPositionId: '',
    });

    const isEditing = !!employee;

    useEffect(() => {
        if (employee) {
            setFormData({
                name: employee.name,
                username: employee.username,
                password: '', // Password is not edited here for security
                email: employee.email || '',
                whatsappCountryCode: employee.whatsappCountryCode || '+506',
                whatsappNumber: employee.whatsappNumber || '',
                jobPositionId: employee.jobPositionId,
            });
        } else {
            // No se establece un puesto por defecto, forzando al usuario a elegir uno.
            setFormData(prev => ({
                ...prev,
                name: '',
                username: '',
                password: '',
                email: '',
                whatsappCountryCode: '+506',
                whatsappNumber: '',
                jobPositionId: ''
            }));
        }
    }, [employee]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isEditing && !formData.password) {
            alert('La contraseña es obligatoria para nuevos empleados.');
            return;
        }

        const employeeData: User = {
            ...employee,
            id: employee?.id || `user-${new Date().toISOString()}`,
            name: formData.name,
            username: formData.username,
            email: formData.email,
            whatsappCountryCode: formData.whatsappCountryCode,
            whatsappNumber: formData.whatsappNumber,
            jobPositionId: formData.jobPositionId,
            role: 'employee',
            // Only include password if it's a new user and has been set
            ...(formData.password && { password: formData.password }),
        };
        
        // Remove password before saving to state if editing (for security)
        if (isEditing) {
            delete employeeData.password;
        }

        onSave(employeeData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-slate-800">{isEditing ? 'Editar Empleado' : 'Nuevo Empleado'}</h2>
                            <button type="button" onClick={onCancel} className="text-slate-500 hover:text-slate-800">
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto p-1">
                            {['name', 'username', 'email'].map(field => (
                                <div key={field}>
                                    <label htmlFor={field} className="block text-sm font-medium text-slate-700 capitalize">{field === 'name' ? 'Nombre Completo' : field}</label>
                                    <input
                                        type={field === 'email' ? 'email' : 'text'}
                                        id={field}
                                        name={field}
                                        value={formData[field as keyof Omit<typeof formData, 'whatsappCountryCode'|'whatsappNumber'>]}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2"
                                        required
                                    />
                                </div>
                            ))}
                             <div>
                                <label htmlFor="whatsapp" className="block text-sm font-medium text-slate-700">WhatsApp</label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <select
                                        name="whatsappCountryCode"
                                        id="whatsappCountryCode"
                                        value={formData.whatsappCountryCode}
                                        onChange={handleChange}
                                        className="block w-1/3 rounded-l-md border-r-0 border-slate-300 bg-slate-50 p-2 text-slate-600 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    >
                                        {countries.map(c => <option key={c.code} value={c.dial_code}>{c.name} ({c.dial_code})</option>)}
                                    </select>
                                    <input
                                        type="tel"
                                        name="whatsappNumber"
                                        id="whatsappNumber"
                                        value={formData.whatsappNumber}
                                        onChange={handleChange}
                                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-slate-300 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="70718989"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-slate-700">Contraseña</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder={isEditing ? 'Dejar en blanco para no cambiar' : ''}
                                    className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2"
                                    required={!isEditing}
                                />
                            </div>
                            <div>
                                <label htmlFor="jobPositionId" className="block text-sm font-medium text-slate-700">Puesto de Trabajo</label>
                                <select
                                    id="jobPositionId"
                                    name="jobPositionId"
                                    value={formData.jobPositionId}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2"
                                    required
                                >
                                    <option value="" disabled>Por favor escoja un puesto</option>
                                    {jobPositions.map(jp => <option key={jp.id} value={jp.id}>{jp.name}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-50 px-6 py-3 flex justify-end gap-3 rounded-b-lg">
                        <button type="button" onClick={onCancel} className="bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300">Cancelar</button>
                        <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeeForm;