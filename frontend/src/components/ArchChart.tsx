import { useEffect } from 'react';
import ReactFlow, { Background, Controls, MiniMap, useNodesState, useEdgesState, Handle, Position } from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';
import { GitBranch, Folder, File } from 'lucide-react';

const RepoNode = ({ data }: any) => (
  <div 
    onClick={() => data.url && window.open(data.url, '_blank')}
    className={`bg-indigo-600 text-white rounded-xl shadow-lg border-2 border-indigo-400 p-4 min-w-[150px] text-center ${data.url ? 'cursor-pointer hover:border-indigo-300 hover:shadow-indigo-500/50 transition-all' : ''}`}
  >
    <div className="flex justify-center mb-2"><GitBranch size={24} /></div>
    <div className="font-bold text-lg">{data.label}</div>
    {data.lang && <div className="text-indigo-200 text-xs mt-1">{data.lang} • {data.stars}★</div>}
    <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-indigo-300" />
  </div>
);

const DirNode = ({ data }: any) => (
  <div 
    onClick={() => data.url && window.open(data.url, '_blank')}
    className={`bg-gray-800 text-white rounded-lg shadow-md border border-gray-700 p-3 min-w-[120px] flex items-center shadow-black/50 ${data.url ? 'cursor-pointer hover:bg-gray-700 hover:border-gray-500 transition-colors' : ''}`}
  >
    <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-gray-400" />
    <Folder size={18} className="text-gray-400 mr-2" />
    <span className="font-mono text-sm uppercase">{data.label}</span>
    <span className="ml-auto bg-gray-900 border border-gray-700 text-xs px-2 py-0.5 rounded-full text-gray-300">
      {data.fileCount}
    </span>
    <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-gray-400" />
  </div>
);

const FileNode = ({ data }: any) => (
  <div 
    onClick={() => data.url && window.open(data.url, '_blank')}
    className={`bg-gray-900 text-gray-300 rounded shadow border border-gray-700/60 py-1.5 px-3 min-w-[100px] flex items-center ${data.url ? 'cursor-pointer hover:bg-gray-800 hover:border-gray-500 transition-colors' : ''}`}
  >
    <Handle type="target" position={Position.Top} className="w-1.5 h-1.5 !bg-gray-500" />
    <File size={14} className="text-gray-500 mr-2" />
    <span className="font-mono text-xs truncate max-w-[150px]">{data.label}</span>
  </div>
);

const nodeTypes = {
  repoNode: RepoNode,
  dirNode: DirNode,
  fileNode: FileNode,
};

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes: any[], edges: any[], direction = 'TB') => {
  dagreGraph.setGraph({ rankdir: direction, nodesep: 50, ranksep: 80 });

  nodes.forEach((node) => {
    // Estimating node dimensions. RepoNode is larger.
    const isRepo = node.type === 'repoNode';
    const isFile = node.type === 'fileNode';
    dagreGraph.setNode(node.id, { width: isRepo ? 180 : (isFile ? 120 : 150), height: isRepo ? 100 : (isFile ? 30 : 50) });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = Position.Top;
    node.sourcePosition = Position.Bottom;

    const isRepo = node.type === 'repoNode';
    const isFile = node.type === 'fileNode';

    node.position = {
      x: nodeWithPosition.x - (isRepo ? 90 : (isFile ? 60 : 75)),
      y: nodeWithPosition.y - (isRepo ? 50 : (isFile ? 15 : 25)),
    };

    return node;
  });

  return { nodes, edges };
};

interface ArchChartProps {
  nodes: any[];
  edges: any[];
}

export default function ArchChart({ nodes: initialNodes, edges: initialEdges }: ArchChartProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (initialNodes.length > 0) {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        JSON.parse(JSON.stringify(initialNodes)),
        JSON.parse(JSON.stringify(initialEdges))
      );
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    }
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  return (
    <div className="w-full h-[600px] bg-gray-950 rounded-xl border border-gray-800 overflow-hidden">
      <ReactFlow 
        nodes={nodes} 
        edges={edges} 
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        className="dark-theme-flow"
      >
        <Background color="#374151" gap={20} />
        <Controls className="bg-gray-800 border-gray-700 fill-white" />
        <MiniMap 
          nodeColor={(n) => n.type === 'repoNode' ? '#4f46e5' : '#374151'}
          maskColor="rgba(0,0,0,0.4)"
          style={{ backgroundColor: '#111827' }}
        />
      </ReactFlow>
    </div>
  );
}
