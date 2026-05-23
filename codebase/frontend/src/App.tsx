import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import RepoView from './pages/RepoView';
import Settings from './pages/Settings';

function Guard({ children }: { children: React.ReactNode }) {
  const token = useStore(s => s.token);
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Guard><Dashboard /></Guard>} />
        <Route path="/repo/:id" element={<Guard><RepoView /></Guard>} />
        <Route path="/settings" element={<Guard><Settings /></Guard>} />
      </Routes>
    </BrowserRouter>
  );
}
