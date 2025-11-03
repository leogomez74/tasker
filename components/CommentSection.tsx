/**
 * @file Componente para mostrar y añadir comentarios en una tarea.
 */
import React, { useState } from 'react';
// FIX: Added .ts extension to import to fix module resolution error.
import type { Comment, User } from '../types.ts';

interface CommentSectionProps {
    comments: Comment[];
    currentUser: User;
    onAddComment: (commentText: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments, currentUser, onAddComment }) => {
    const [newComment, setNewComment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            onAddComment(newComment.trim());
            setNewComment('');
        }
    };

    return (
        <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Comentarios</h3>
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {comments.length > 0 ? (
                    comments.slice().sort((a, b) => a.timestamp - b.timestamp).map(comment => (
                        <div key={comment.id} className={`p-3 rounded-lg ${comment.authorId === currentUser.id ? 'bg-blue-50' : 'bg-slate-50'}`}>
                            <p className="text-sm text-slate-700">{comment.content}</p>
                            <p className="text-xs text-slate-500 mt-1 text-right">
                                &mdash; {comment.authorName} a las {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-slate-500">No hay comentarios aún.</p>
                )}
            </div>
            <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Añadir un comentario..."
                    className="flex-grow border border-slate-300 rounded-md shadow-sm p-2"
                    aria-label="Nuevo comentario"
                />
                <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">
                    Enviar
                </button>
            </form>
        </div>
    );
};

export default CommentSection;