import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useStore } from '../store/useStore';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ArchChart from '../components/ArchChart';
import FileTreePanel from '../components/FileTreePanel';
import ChatPanel from '../components/ChatPanel';
import StatsPanel from '../components/StatsPanel';
import ContributorPanel from '../components/ContributorPanel';
import CommitTimeline from '../components/CommitTimeline';
import { ExternalLink, RefreshCw, Trash2, Github, LayoutGrid, FolderTree, BarChart3, HardDrive, Calendar, Clock, GitBranch, AlertCircle, GitFork, Star, ShieldCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function RepoView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeRepo, setActiveRepo } = useStore();
  const [activeTab, setActiveTab] = useState('Overview');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchRepo = async () => {
    try {
      const res = await api.get(`/repos/${id}`);
      setActiveRepo(res.data);
    } catch (err) {
      setError('Failed to load repository data. It may have been deleted.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchRepo();
  }, [id, setActiveRepo]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await api.post(`/repos/${id}/refresh`);
      await fetchRepo();
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to remove this repository from your dashboard?')) return;
    try {
      await api.delete(`/repos/${id}`);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex">
        <Sidebar onAddClick={() => navigate('/dashboard')} />
        <div className="flex-1 md:ml-64 flex items-center justify-center">
          <div className="animate-spin border-4 border-indigo-500 border-t-transparent rounded-full w-12 h-12"></div>
        </div>
      </div>
    );
  }

  if (error || !activeRepo) {
    return (
      <div className="min-h-screen bg-gray-950 flex">
        <Sidebar onAddClick={() => navigate('/dashboard')} />
        <div className="flex-1 md:ml-64 flex flex-col items-center justify-center text-center p-6">
          <div className="text-red-400 text-lg mb-4">{error}</div>
          <button onClick={() => navigate('/dashboard')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg px-6 py-2 transition">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { analysis, graph_data } = activeRepo;
  const metadata = analysis?.metadata || {};
  const fileTree = analysis?.file_tree || [];
  const analysisData = analysis?.analysis || {};

  const tabs = ['Overview', 'Architecture', 'Files', 'Stats', 'Contributors', 'Commits'];

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar onAddClick={() => navigate('/dashboard')} />
      <div className="flex-1 md:ml-64 md:mr-80 lg:mr-96 flex flex-col min-h-screen relative">
        <Navbar />
        
        <main className="flex-1 p-6 lg:p-10 w-full overflow-x-hidden">
          <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center flex-wrap">
                <Github size={28} className="mr-3 text-gray-400" />
                <a href={metadata.url} target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition flex items-center">
                  {activeRepo.repo_full_name}
                  <ExternalLink size={20} className="ml-2 text-gray-500" />
                </a>
              </h1>
              <p className="text-gray-400 mt-2 max-w-3xl leading-relaxed">{activeRepo.description || 'No description provided.'}</p>
              
              <div className="flex flex-wrap items-center mt-4 gap-4 text-sm text-gray-300">
                <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500 mr-2"></span>{activeRepo.language || 'Unknown'}</span>
                <span className="flex items-center">★ {activeRepo.stars.toLocaleString()} stars</span>
                <span className="flex items-center">⑂ {metadata.forks?.toLocaleString() || 0} forks</span>
                <span className="flex items-center">⊙ {metadata.open_issues?.toLocaleString() || 0} open issues</span>
              </div>
            </div>
            
            <div className="flex space-x-3 flex-shrink-0">
              <button 
                onClick={handleRefresh} 
                disabled={isRefreshing}
                className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 rounded-lg px-4 py-2 transition flex items-center disabled:opacity-50"
              >
                <RefreshCw size={16} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} /> Refresh
              </button>
              <button 
                onClick={handleDelete}
                className="bg-red-900/30 hover:bg-red-900/50 border border-red-800 text-red-400 rounded-lg px-4 py-2 transition flex items-center"
              >
                <Trash2 size={16} className="mr-2" /> Remove
              </button>
            </div>
          </div>

          <div className="flex space-x-1 mb-6 overflow-x-auto pb-2 scrollbar-hide border-b border-gray-800">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab 
                    ? 'border-indigo-500 text-white' 
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-6 pb-20">
            {activeTab === 'Overview' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                {/* Detailed Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 hover:border-indigo-500/50 transition-colors rounded-xl p-4 flex flex-col justify-between group">
                    <div className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-2 flex items-center">
                      <HardDrive size={14} className="mr-1.5 group-hover:text-indigo-400 transition-colors" /> Size
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {metadata.size_kb ? (metadata.size_kb / 1024).toFixed(1) : 0} <span className="text-sm font-normal text-gray-400">MB</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 hover:border-violet-500/50 transition-colors rounded-xl p-4 flex flex-col justify-between group">
                    <div className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-2 flex items-center">
                      <ShieldCheck size={14} className="mr-1.5 group-hover:text-violet-400 transition-colors" /> License
                    </div>
                    <div className="text-xl font-bold text-white truncate" title={metadata.license || 'None'}>{metadata.license || 'None'}</div>
                  </div>

                  <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 hover:border-blue-500/50 transition-colors rounded-xl p-4 flex flex-col justify-between group">
                    <div className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-2 flex items-center">
                      <GitBranch size={14} className="mr-1.5 group-hover:text-blue-400 transition-colors" /> Default Branch
                    </div>
                    <div className="text-lg font-bold text-white truncate">{metadata.default_branch || 'main'}</div>
                  </div>

                  <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 hover:border-teal-500/50 transition-colors rounded-xl p-4 flex flex-col justify-between group">
                    <div className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-2 flex items-center">
                      <AlertCircle size={14} className="mr-1.5 group-hover:text-teal-400 transition-colors" /> Open Issues
                    </div>
                    <div className="text-2xl font-bold text-white">{metadata.open_issues?.toLocaleString() || 0}</div>
                  </div>

                  <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 hover:border-amber-500/50 transition-colors rounded-xl p-4 flex flex-col justify-between group">
                    <div className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-2 flex items-center">
                      <Star size={14} className="mr-1.5 group-hover:text-amber-400 transition-colors" /> Stars
                    </div>
                    <div className="text-2xl font-bold text-white">{activeRepo.stars?.toLocaleString() || 0}</div>
                  </div>

                  <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 hover:border-cyan-500/50 transition-colors rounded-xl p-4 flex flex-col justify-between group">
                    <div className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-2 flex items-center">
                      <GitFork size={14} className="mr-1.5 group-hover:text-cyan-400 transition-colors" /> Forks
                    </div>
                    <div className="text-2xl font-bold text-white">{metadata.forks?.toLocaleString() || 0}</div>
                  </div>

                  <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 hover:border-rose-500/50 transition-colors rounded-xl p-4 flex flex-col justify-between group">
                    <div className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-2 flex items-center">
                      <Calendar size={14} className="mr-1.5 group-hover:text-rose-400 transition-colors" /> Created
                    </div>
                    <div className="text-lg font-bold text-white truncate">
                      {metadata.created_at ? new Date(metadata.created_at).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>

                  <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 hover:border-pink-500/50 transition-colors rounded-xl p-4 flex flex-col justify-between group">
                    <div className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-2 flex items-center">
                      <Clock size={14} className="mr-1.5 group-hover:text-pink-400 transition-colors" /> Updated
                    </div>
                    <div className="text-lg font-bold text-white truncate">
                      {metadata.updated_at ? new Date(metadata.updated_at).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>

                  <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 hover:border-emerald-500/50 transition-colors rounded-xl p-4 flex flex-col justify-between group col-span-2 sm:col-span-1 lg:col-span-2 xl:col-span-4">
                    <div className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-2 flex items-center">
                      <RefreshCw size={14} className="mr-1.5 group-hover:text-emerald-400 transition-colors" /> Last Analyzed
                    </div>
                    <div className="text-lg font-bold text-white truncate">
                      {activeRepo.last_analyzed ? formatDistanceToNow(new Date(activeRepo.last_analyzed), { addSuffix: true }) : 'Just now'}
                    </div>
                  </div>
                </div>

                {metadata.topics && metadata.topics.length > 0 && (
                  <div className="bg-gray-900/40 border border-gray-800/60 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center"><LayoutGrid size={18} className="mr-2 text-indigo-400" /> Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {metadata.topics.map((t: string) => (
                        <span key={t} className="bg-indigo-900/30 border border-indigo-500/30 hover:border-indigo-400/60 hover:bg-indigo-900/50 transition-all cursor-default text-indigo-200 rounded-full px-4 py-1.5 text-sm font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {metadata.languages && Object.keys(metadata.languages).length > 0 && (
                  <div className="bg-gray-900/40 border border-gray-800/60 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center"><BarChart3 size={18} className="mr-2 text-violet-400" /> Language Distribution</h3>
                    <div className="h-6 w-full bg-gray-950 rounded-full overflow-hidden flex shadow-inner">
                      {Object.entries(metadata.languages).map(([lang, percent], i) => {
                        const colors = ['bg-indigo-500', 'bg-violet-500', 'bg-blue-500', 'bg-cyan-500', 'bg-teal-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500'];
                        return (
                          <div 
                            key={lang} 
                            className={`h-full ${colors[i % colors.length]} hover:brightness-110 transition-all`} 
                            style={{ width: `${percent}%` }} 
                            title={`${lang} (${percent}%)`}
                          ></div>
                        );
                      })}
                    </div>
                    
                    <div className="flex flex-wrap gap-x-6 gap-y-3 mt-5">
                      {Object.entries(metadata.languages).map(([lang, percent], i) => {
                        const colors = ['bg-indigo-500', 'bg-violet-500', 'bg-blue-500', 'bg-cyan-500', 'bg-teal-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500'];
                        return (
                          <div key={lang} className="flex items-center text-sm">
                            <span className={`w-3 h-3 rounded-full mr-2 ${colors[i % colors.length]} shadow-sm`}></span>
                            <span className="text-gray-300 font-medium mr-1.5">{lang}</span>
                            <span className="text-gray-500">{percent as number}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Architecture' && (
              <div className="space-y-4">
                <p className="text-gray-400 text-sm flex items-center bg-gray-900 p-3 rounded-lg border border-gray-800">
                  <FolderTree size={16} className="mr-2 text-indigo-400" />
                  Each node is a top-level directory parsed from the repository default branch. Use scroll to zoom and drag to pan.
                </p>
                <ArchChart nodes={graph_data?.nodes || []} edges={graph_data?.edges || []} />
              </div>
            )}

            {activeTab === 'Files' && (
              <div className="space-y-4">
                <FileTreePanel fileTree={fileTree} />
              </div>
            )}

            {activeTab === 'Stats' && (
              <div className="space-y-4">
                <StatsPanel analysis={analysisData} />
              </div>
            )}

            {activeTab === 'Contributors' && (
              <div className="space-y-4">
                <ContributorPanel contributors={metadata.contributors || []} />
              </div>
            )}

            {activeTab === 'Commits' && (
              <div className="space-y-4">
                <CommitTimeline commits={metadata.recent_commits || []} />
              </div>
            )}
          </div>
        </main>
      </div>

      <ChatPanel repoId={parseInt(id!)} />
    </div>
  );
}
