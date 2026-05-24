import React, { useState, useMemo } from 'react';
import { ChevronRight, ChevronDown, FileCode, FileText, File as FileIcon } from 'lucide-react';

interface FileTreeItem {
  path: string;
  type: 'blob' | 'tree';
  size?: number;
}

interface TreeNode {
  name: string;
  type: 'blob' | 'tree';
  path: string;
  size?: number;
  children: Record<string, TreeNode>;
}

const getFileIcon = (filename: string) => {
  if (filename.match(/\.(ts|js|py|go|rs|cpp|c|java|sql|sh)$/i)) return <FileCode size={16} className="text-indigo-400" />;
  if (filename.match(/\.(md|mdx|txt|json|yaml|yml|csv)$/i)) return <FileText size={16} className="text-gray-400" />;
  return <FileIcon size={16} className="text-gray-500" />;
};

const FileTreeLevel = ({ nodes, level = 0 }: { nodes: TreeNode[], level?: number }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (path: string) => setExpanded(p => ({ ...p, [path]: !p[path] }));

  // Sort: folders first, then files
  const sorted = [...nodes].sort((a, b) => {
    if (a.type !== b.type) return a.type === 'tree' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="w-full">
      {sorted.map(node => (
        <div key={node.path} className="w-full">
          <div 
            className={`flex items-center py-1.5 hover:bg-gray-800/50 cursor-pointer rounded px-2`}
            style={{ paddingLeft: `${level * 16 + 8}px` }}
            onClick={() => node.type === 'tree' && toggle(node.path)}
          >
            {node.type === 'tree' ? (
              expanded[node.path] ? <ChevronDown size={16} className="text-gray-400 mr-1.5 flex-shrink-0" /> : <ChevronRight size={16} className="text-gray-400 mr-1.5 flex-shrink-0" />
            ) : (
              <span className="w-4 mr-1.5 inline-block" /> // Spacer
            )}
            
            {node.type === 'tree' ? (
              <span className="text-gray-300 font-medium truncate">{node.name}</span>
            ) : (
              <div className="flex items-center w-full min-w-0">
                <span className="mr-2 flex-shrink-0">{getFileIcon(node.name)}</span>
                <span className="text-gray-300 text-sm truncate">{node.name}</span>
                {node.size !== undefined && (
                  <span className="ml-auto text-xs text-gray-500 flex-shrink-0 pl-4">
                    {(node.size / 1024).toFixed(1)} KB
                  </span>
                )}
              </div>
            )}
          </div>
          {node.type === 'tree' && expanded[node.path] && (
            <FileTreeLevel nodes={Object.values(node.children)} level={level + 1} />
          )}
        </div>
      ))}
    </div>
  );
};

export default function FileTreePanel({ fileTree }: { fileTree: FileTreeItem[] }) {
  const [filter, setFilter] = useState('');

  // Build tree data structure
  const rootNodes = useMemo(() => {
    const root: Record<string, TreeNode> = {};
    const items = fileTree.filter(f => f.path.toLowerCase().includes(filter.toLowerCase()));
    
    items.forEach(item => {
      const parts = item.path.split('/');
      let currentLevel = root;
      
      parts.forEach((part, index) => {
        const isLast = index === parts.length - 1;
        if (!currentLevel[part]) {
          currentLevel[part] = {
            name: part,
            type: isLast ? item.type : 'tree',
            path: parts.slice(0, index + 1).join('/'),
            size: isLast ? item.size : undefined,
            children: {}
          };
        }
        if (!isLast) currentLevel = currentLevel[part].children;
      });
    });
    return Object.values(root);
  }, [fileTree, filter]);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden flex flex-col h-[600px]">
      <div className="p-3 border-b border-gray-800">
        <input 
          type="text" 
          placeholder="Filter paths..." 
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
        />
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {rootNodes.length === 0 ? (
          <div className="text-gray-500 text-center py-10">No files found.</div>
        ) : (
          <FileTreeLevel nodes={rootNodes} />
        )}
      </div>
    </div>
  );
}
