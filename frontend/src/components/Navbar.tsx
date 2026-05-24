import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="border-b border-gray-800 bg-gray-950 px-4 py-3 flex items-center justify-between md:hidden">
      <Link to="/dashboard" className="text-lg font-mono text-indigo-400 font-bold">&lt;/&gt; Codebase</Link>
      <button className="text-gray-400 hover:text-white transition">
        <Menu size={24} />
      </button>
    </nav>
  );
}
