import React from 'react';
import Login from './components/Login.tsx';
import AdminPanel from './components/AdminPanel.tsx';
import UserView from './components/UserView.tsx';
import type { User } from './types.ts';
import { useLocalStorage } from './hooks/useLocalStorage.ts';

function App() {
  const [user, setUser] = useLocalStorage<User | null>('user', null);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
    // Optional: Clear all local storage on logout for a clean state
    // window.localStorage.clear();
  };

  if (!user) {
    return <Login onLoginSuccess={handleLogin} />;
  }

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      {user.role === 'admin' ? (
        <AdminPanel user={user} onLogout={handleLogout} />
      ) : (
        <UserView user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
