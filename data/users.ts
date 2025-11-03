/**
 * @file Datos de ejemplo para los usuarios de la aplicación.
 * En una aplicación real, esto provendría de una base de datos.
 */

import type { User } from '../types.ts';

// Lista de usuarios predefinidos para la demostración.
export const users: User[] = [
  {
    id: 'user-admin',
    name: 'Admin General',
    username: 'admin',
    password: 'admin',
    role: 'admin',
    jobPositionId: 'jp-admin',
    email: 'admin@example.com',
    whatsappCountryCode: '+1',
    whatsappNumber: '234567890',
  },
  {
    id: 'user-demo',
    name: 'Empleado Demo',
    username: 'demo',
    password: 'demo',
    role: 'employee',
    jobPositionId: 'jp-1',
    email: 'demo@example.com',
    whatsappCountryCode: '+506',
    whatsappNumber: '70718989',
  },
  {
    id: 'user-jane',
    name: 'Jane Doe',
    username: 'jane',
    password: 'password',
    role: 'employee',
    jobPositionId: 'jp-2',
    email: 'jane.doe@example.com',
    whatsappCountryCode: '+1',
    whatsappNumber: '122334455',
  },
];