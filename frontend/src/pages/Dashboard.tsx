import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { useStore } from '../store/useStore';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import RepoCard from '../components/RepoCard';
import { Github, Plus } from 'lucide-react';

export default function Dashboard() {
  const { user, repos, setRepos } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRepoUrl, setNewRepoUrl] = useState('');
  const [error, setError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoadingRepos, setIsLoadingRepos] = useState(true);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await api.get('/repos/');
        setRepos(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingRepos(false);
      }
    };
    fetchRepos();
  }, [setRepos]);

  const handleAddRepo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepoUrl.trim()) return;
    setIsAnalyzing(true);
    setError('');
    try {
      await api.post('/repos/', { repo_url: newRepoUrl });
      setIsModalOpen(false);
      setNewRepoUrl('');
      const res = await api.get('/repos/');
      setRepos(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to analyze repository. Check URL and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const totalStars = repos.reduce((acc, r) => acc + (r.stars || 0), 0);
  const uniqueLangs = new Set(repos.map(r => r.language).filter(Boolean)).size;

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar onAddClick={() => setIsModalOpen(true)} />
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen relative">
        <Navbar />
        <main className="flex-1 p-6 lg:p-10 max-w-6xl mx-auto w-full">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.full_name || user?.username}</h1>
            <p className="text-gray-400">Here's an overview of your analyzed repositories.</p>
          </div>

          {!isLoadingRepos && repos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 border-l-4 border-l-indigo-500">
                <div className="text-sm text-gray-400 mb-1">Total Repositories</div>
                <div className="text-3xl font-bold text-white">{repos.length}</div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 border-l-4 border-l-violet-500">
                <div className="text-sm text-gray-400 mb-1">Total Stars Tracked</div>
                <div className="text-3xl font-bold text-white">{totalStars.toLocaleString()}</div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 border-l-4 border-l-emerald-500">
                <div className="text-sm text-gray-400 mb-1">Languages Used</div>
                <div className="text-3xl font-bold text-white">{uniqueLangs}</div>
              </div>
            </div>
          )}

          {isLoadingRepos ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse bg-gray-900 border border-gray-800 rounded-xl h-40"></div>
              ))}
            </div>
          ) : repos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="bg-gray-900 border border-gray-800 w-24 h-24 rounded-full flex items-center justify-center text-gray-700 mb-6">
                <Github size={48} />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">No repositories analyzed yet</h2>
              <p className="text-gray-400 mb-6 max-w-md">Add a public GitHub repo URL to instantly generate architecture charts, language insights, and AI chat capabilities.</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg px-6 py-3 transition flex items-center"
              >
                <Plus size={20} className="mr-2" /> Add your first repository
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
              {repos.map(r => <RepoCard key={r.id} repo={r} />)}
            </div>
          )}
        </main>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-lg shadow-2xl relative">
              <h3 className="text-xl font-bold text-white mb-2">Add Repository</h3>
              <p className="text-gray-400 text-sm mb-6">Paste a public GitHub URL to analyze its architecture and contents.</p>
              
              {error && <div className="bg-red-900/30 border border-red-700 text-red-400 rounded-lg p-3 text-sm mb-4">{error}</div>}

              <form onSubmit={handleAddRepo}>
                <input
                  type="url"
                  placeholder="https://github.com/vercel/next.js"
                  value={newRepoUrl}
                  onChange={e => setNewRepoUrl(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition mb-6"
                  required
                  disabled={isAnalyzing}
                />
                <div className="flex justify-end space-x-3">
                  <button 
                    type="button" 
                    onClick={() => { setIsModalOpen(false); setError(''); setNewRepoUrl(''); }}
                    className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 rounded-lg px-4 py-2 transition disabled:opacity-50"
                    disabled={isAnalyzing}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isAnalyzing}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg px-6 py-2 transition min-w-[120px] flex items-center justify-center disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <><div className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 mr-2" /> Analyzing...</>
                    ) : 'Analyze'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
