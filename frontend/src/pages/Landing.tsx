import { Link } from 'react-router-dom';
import { Network, MessageSquare, Code2 } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <header className="p-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="text-xl font-mono text-indigo-400 font-bold">&lt;/&gt; Codebase</div>
        <div className="space-x-4">
          <Link to="/login" className="text-gray-300 hover:text-white transition">Sign in</Link>
          <Link to="/signup" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg px-4 py-2 transition inline-block">
            Get started free
          </Link>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto py-20">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6">
          Understand any GitHub repo in <span className="text-indigo-500">seconds</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl">
          Architecture charts &middot; AI Q&amp;A &middot; Language insights &middot; Contributor stats
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-24">
          <Link to="/signup" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg px-8 py-4 text-lg transition">
            Get started free
          </Link>
          <Link to="/login" className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 font-semibold rounded-lg px-8 py-4 text-lg transition">
            Sign in
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full text-left">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-indigo-700/50 transition">
            <div className="bg-indigo-900/40 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-indigo-400">
              <Network size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Architecture Chart</h3>
            <p className="text-gray-400">Instantly visualize the structure and directories of any codebase with interactive dependency graphs.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-indigo-700/50 transition">
            <div className="bg-indigo-900/40 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-indigo-400">
              <MessageSquare size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">AI Chat</h3>
            <p className="text-gray-400">Ask questions about the repo to our deeply-integrated AI assistant powered by GPT-4o.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-indigo-700/50 transition">
            <div className="bg-indigo-900/40 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-indigo-400">
              <Code2 size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Code Insights</h3>
            <p className="text-gray-400">View detailed language breakdowns, framework usage, contributor history, and timeline data.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
