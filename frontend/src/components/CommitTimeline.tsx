import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { GitCommit } from 'lucide-react';

interface Commit {
  sha: string;
  message: string;
  author: string;
  date: string;
}

export default function CommitTimeline({ commits }: { commits: Commit[] }) {
  if (!commits || commits.length === 0) {
    return <div className="text-gray-500 py-10 text-center">No commit data available.</div>;
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="divide-y divide-gray-800">
        {commits.map((commit, i) => (
          <div key={i} className="p-4 hover:bg-gray-800/50 transition flex items-start sm:items-center flex-col sm:flex-row gap-4">
            <div className="flex-shrink-0 pt-1 sm:pt-0">
              <span className="font-mono bg-indigo-900/40 text-indigo-300 rounded px-2 py-1 text-sm border border-indigo-500/30 flex items-center">
                <GitCommit size={14} className="mr-1.5" />
                {commit.sha}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate" title={commit.message}>
                {commit.message}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                <span className="text-gray-400">{commit.author}</span> committed
              </p>
            </div>
            <div className="flex-shrink-0 text-xs text-gray-500 sm:text-right">
              {formatDistanceToNow(new Date(commit.date), { addSuffix: true })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
