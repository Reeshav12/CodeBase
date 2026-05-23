import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Plus, LogOut, Settings } from 'lucide-react';

interface SidebarProps {
  onAddClick: () => void;
}

export default function Sidebar({ onAddClick }: SidebarProps) {
  const { repos, logout, user } = useStore();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filteredRepos = repos.filter(r => r.repo_full_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <aside className="w-64 bg-gray-950 border-r border-gray-800 flex flex-col h-screen fixed top-0 left-0 hidden md:flex">
      <div className="p-6">
        <Link to="/dashboard" className="text-xl font-mono text-indigo-400 font-bold block mb-8">&lt;/&gt; Codebase</Link>
        
        <div className="relative mb-6">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="Filter repos..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">My Repos</div>
        <div className="overflow-y-auto flex-1 space-y-1 pr-2" style={{ maxHeight: 'calc(100vh - 300px)' }}>
          {filteredRepos.length === 0 ? (
            <div className="text-gray-500 text-sm py-2">No repos found</div>
          ) : (
            filteredRepos.map(repo => (
              <Link 
                key={repo.id} 
                to={`/repo/${repo.id}`}
                className={`block px-3 py-2 rounded-lg text-sm truncate transition ${location.pathname === `/repo/${repo.id}` ? 'bg-indigo-900/40 text-indigo-300' : 'text-gray-400 hover:bg-gray-900 hover:text-white'}`}
                title={repo.repo_full_name}
              >
                {repo.repo_full_name}
              </Link>
            ))
          )}
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-gray-800 bg-gray-950">
        <button 
          onClick={onAddClick}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg px-4 py-2 transition flex items-center justify-center mb-4"
        >
          <Plus size={16} className="mr-2" /> Add Repository
        </button>

        <div className="flex items-center justify-between text-gray-400 text-sm px-2">
          <Link to="/settings" className="hover:text-white transition flex items-center truncate" title={user?.username}>
            <Settings size={16} className="mr-2 flex-shrink-0" />
            <span className="truncate">{user?.username}</span>
          </Link>
          <button onClick={handleLogout} className="hover:text-white transition" title="Log out">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
