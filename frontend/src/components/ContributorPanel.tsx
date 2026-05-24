import { ExternalLink } from 'lucide-react';

interface Contributor {
  login: string;
  avatar: string;
  contributions: number;
  url: string;
}

export default function ContributorPanel({ contributors }: { contributors: Contributor[] }) {
  if (!contributors || contributors.length === 0) {
    return <div className="text-gray-500 py-10 text-center">No contributor data available.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {contributors.map((c, i) => (
        <a 
          key={i} 
          href={c.url} 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-indigo-700 transition group"
        >
          <img src={c.avatar} alt={c.login} className="w-12 h-12 rounded-full border border-gray-700" />
          <div className="ml-4 flex-1">
            <div className="font-bold text-white group-hover:text-indigo-400 transition flex items-center">
              {c.login} <ExternalLink size={12} className="ml-1.5 opacity-0 group-hover:opacity-100 transition" />
            </div>
            <div className="text-gray-400 text-sm mt-1">
              <span className="bg-indigo-900/40 text-indigo-300 rounded-full px-2 py-0.5 text-xs font-semibold">
                {c.contributions} commits
              </span>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
