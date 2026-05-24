import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';

interface RepoProps {
  repo: {
    id: number;
    repo_full_name: string;
    description?: string;
    stars: number;
    language?: string;
    last_analyzed?: string;
  };
}

export default function RepoCard({ repo }: RepoProps) {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/repo/${repo.id}`)}
      className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-indigo-700 transition cursor-pointer flex flex-col h-full"
    >
      <div className="flex-1 mb-4">
        <h3 className="font-mono text-white text-lg font-bold mb-2 truncate" title={repo.repo_full_name}>
          {repo.repo_full_name}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-2">
          {repo.description || "No description provided."}
        </p>
      </div>
      <div className="flex items-center justify-between text-xs mt-auto">
        <div className="flex items-center space-x-3">
          {repo.language && (
            <span className="flex items-center text-gray-300">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 mr-1.5 flex-shrink-0"></span>
              {repo.language}
            </span>
          )}
          <span className="flex items-center text-gray-300">
            <Star size={12} className="mr-1 text-gray-400" />
            {repo.stars.toLocaleString()}
          </span>
        </div>
        {repo.last_analyzed && (
          <span className="text-gray-500">
            {formatDistanceToNow(new Date(repo.last_analyzed), { addSuffix: true })}
          </span>
        )}
      </div>
    </div>
  );
}
