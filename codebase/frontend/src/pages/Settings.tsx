import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import api from '../api/client';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { User, Mail, Calendar, CheckCircle } from 'lucide-react';

export default function Settings() {
  const { user, setAuth, token } = useStore();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [githubUsername, setGithubUsername] = useState(user?.github_username || '');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);
    try {
      await api.put('/auth/me', { full_name: fullName, github_username: githubUsername });
      const updatedUser = { ...user!, full_name: fullName, github_username: githubUsername };
      setAuth(updatedUser, token!);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError('Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar onAddClick={() => {}} />
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-6 lg:p-10 max-w-4xl mx-auto w-full">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
            <p className="text-gray-400">Manage your account and profile preferences.</p>
          </div>

          <div className="space-y-8">
            <section className="bg-gray-900 border border-gray-800 rounded-xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <User className="mr-2 text-indigo-400" /> Profile Information
              </h2>
              
              {success && (
                <div className="bg-green-900/30 border border-green-700 text-green-400 rounded-lg p-3 text-sm mb-6 flex items-center">
                  <CheckCircle size={16} className="mr-2" /> Profile updated successfully.
                </div>
              )}
              {error && (
                <div className="bg-red-900/30 border border-red-700 text-red-400 rounded-lg p-3 text-sm mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-5">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition max-w-md"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">GitHub Username</label>
                  <input
                    type="text"
                    value={githubUsername}
                    onChange={e => setGithubUsername(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition max-w-md"
                    placeholder="e.g. mbostock"
                  />
                </div>
                <div className="pt-2">
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg px-6 py-2 transition flex items-center disabled:opacity-50"
                  >
                    {isLoading ? <div className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 mr-2" /> : null}
                    Save Changes
                  </button>
                </div>
              </form>
            </section>

            <section className="bg-gray-900 border border-gray-800 rounded-xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-white mb-6">Account Details</h2>
              <div className="space-y-6">
                <div>
                  <div className="text-gray-500 text-sm mb-1 flex items-center"><Mail size={14} className="mr-1" /> Email address</div>
                  <div className="text-white text-lg bg-gray-800/50 inline-block px-3 py-1.5 rounded-md border border-gray-800">{user?.email}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm mb-1 flex items-center"><User size={14} className="mr-1" /> Username</div>
                  <div className="text-white text-lg bg-gray-800/50 inline-block px-3 py-1.5 rounded-md border border-gray-800">@{user?.username}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm mb-1 flex items-center"><Calendar size={14} className="mr-1" /> Member since</div>
                  <div className="text-gray-300">Just joined</div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
