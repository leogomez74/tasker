/**
 * @file Definiciones de tipos de datos para la aplicación.
 * Centraliza las interfaces y tipos para un mejor mantenimiento.
 */

// Representa a un usuario, que puede ser un administrador o un empleado.
export interface User {
  id: string;
  name:string;
  username: string;
  password?: string; // Se omite en el estado de la app por seguridad.
  role: 'admin' | 'employee';
  jobPositionId: string;
  email?: string;
  whatsappCountryCode?: string; // e.g., '+506'
  whatsappNumber?: string;    // e.g., '70718989'
}

// Representa una tarea a realizar.
export interface Task {
  id: string;
  title: string;
  description: string;
  sectionId: string;
  assignedTo: string[]; // IDs de los usuarios asignados.
  status: 'pending' | 'in_progress' | 'completed' | 'needs_review';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string; // Fecha en formato ISO (YYYY-MM-DD).
  createdAt: number; // Timestamp de creación.
  updatedAt: number; // Timestamp de última actualización.
  comments: Comment[];
  isRecurring: boolean;
  recurrenceRule?: string; // e.g., 'daily', 'weekly'
  completedById?: string; // ID del usuario que completó la tarea.
  completedAt?: number; // Timestamp de completado.
  projectId?: string; // ID del proyecto al que pertenece.
}

// Representa una sección de la casa para categorizar tareas.
export interface Section {
  id: string;
  name: string;
}

// Representa un puesto de trabajo para los empleados.
export interface JobPosition {
  id: string;
  name: string;
}

// Representa un comentario en una tarea.
export interface Comment {
  id: string;
  // taskId: string; // Implicitly part of Task.comments
  authorId: string;
  authorName: string;
  content: string;
  timestamp: number; // Timestamp de creación.
}

// Representa un proyecto o un evento especial que agrupa tareas.
export interface Project {
    id: string;
    name: string;
    description: string;
    // ownerId: string; // ID del admin que lo creó.
    // deadline?: string;
}

// Representa una notificación para un usuario.
export interface Notification {
    id:string;
    userId: string; // Usuario al que se le muestra.
    message: string;
    isRead: boolean;
    createdAt: number; // Timestamp.
    relatedTaskId?: string;
}