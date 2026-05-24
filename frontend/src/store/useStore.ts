import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User { id: number; email: string; username: string; full_name?: string; github_username?: string; }
interface Repo { id: number; repo_full_name: string; description?: string; stars: number; language?: string; }

interface Store {
  user: User | null; token: string | null; repos: Repo[]; activeRepo: any | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  setRepos: (repos: Repo[]) => void;
  setActiveRepo: (repo: any) => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      user: null, token: null, repos: [], activeRepo: null,
      setAuth: (user, token) => { localStorage.setItem('codebase_token', token); set({ user, token }); },
      logout: () => { localStorage.removeItem('codebase_token'); set({ user: null, token: null, repos: [], activeRepo: null }); },
      setRepos: (repos) => set({ repos }),
      setActiveRepo: (repo) => set({ activeRepo: repo }),
    }),
    { name: 'codebase-store', partialize: (s) => ({ user: s.user, token: s.token }) }
  )
);
