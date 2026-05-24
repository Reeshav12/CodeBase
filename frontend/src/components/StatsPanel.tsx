import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#3b82f6', '#06b6d4', '#14b8a6', '#22c55e', '#f59e0b', '#f97316'];

interface StatsPanelProps {
  analysis: {
    total_files: number;
    total_size_kb: number;
    language_breakdown: Record<string, number>;
    detected_frameworks: string[];
    detected_configs: { file: string; tech: string }[];
  };
}

export default function StatsPanel({ analysis }: StatsPanelProps) {
  const pieData = Object.entries(analysis.language_breakdown).map(([name, value]) => ({ name, value }));
  const barData = Object.entries(analysis.language_breakdown).map(([name, count]) => ({ name, count })).slice(0, 10); // Top 10

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 border-l-4 border-l-blue-500">
          <div className="text-sm text-gray-400 mb-1">Total Files</div>
          <div className="text-3xl font-bold text-white">{analysis.total_files.toLocaleString()}</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 border-l-4 border-l-cyan-500">
          <div className="text-sm text-gray-400 mb-1">Total Size</div>
          <div className="text-3xl font-bold text-white">{analysis.total_size_kb.toLocaleString()} <span className="text-lg text-gray-400 font-normal">KB</span></div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 border-l-4 border-l-indigo-500">
          <div className="text-sm text-gray-400 mb-1">Frameworks Detected</div>
          <div className="text-3xl font-bold text-white">{analysis.detected_frameworks.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Language Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f9fafb', borderRadius: '0.5rem' }}
                  itemStyle={{ color: '#f9fafb' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">File Count by Language</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" stroke="#6b7280" />
                <YAxis dataKey="name" type="category" stroke="#6b7280" width={80} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f9fafb', borderRadius: '0.5rem' }}
                  cursor={{ fill: '#374151' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {analysis.detected_frameworks.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Detected Technologies</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.detected_frameworks.map((fw, i) => (
              <span key={i} className="bg-indigo-900/40 text-indigo-300 rounded-full px-3 py-1 text-xs">
                {fw}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
