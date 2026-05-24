import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import api from '../api/client';
import { Send, Trash2 } from 'lucide-react';

interface Message {
  role: string;
  content: string;
  created_at?: string;
}

export default function ChatPanel({ repoId }: { repoId: number }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/chat/${repoId}/history`);
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHistory();
  }, [repoId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await api.post(`/chat/${repoId}`, { question: userMsg });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: '**Error**: Failed to get response from AI.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = async () => {
    if (!window.confirm('Clear all chat history for this repository?')) return;
    try {
      await api.delete(`/chat/${repoId}/history`);
      setMessages([]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-gray-900 border-l border-gray-800 w-full md:w-80 lg:w-96 flex flex-col h-[calc(100vh-64px)] md:h-screen fixed right-0 top-[64px] md:top-0 z-10 transition-transform">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-950/50 backdrop-blur">
        <h3 className="font-bold text-white flex items-center">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
          Codebase AI
        </h3>
        <button 
          onClick={handleClear}
          className="text-gray-500 hover:text-red-400 transition"
          title="Clear chat history"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 ? (
          <div className="text-gray-500 text-sm text-center mt-10">
            Send a message to start chatting about this codebase.
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div 
                className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm prose prose-invert prose-p:leading-relaxed prose-pre:bg-gray-950 prose-pre:border prose-pre:border-gray-800 ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-bl-none'
                }`}
              >
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex items-start">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-bl-none px-4 py-3 text-gray-400 flex space-x-1.5 items-center h-[44px]">
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="p-4 border-t border-gray-800 bg-gray-950">
        <form 
          onSubmit={handleSend}
          className="flex items-end bg-gray-800 border border-gray-700 rounded-xl overflow-hidden focus-within:border-indigo-500 transition"
        >
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask about this repo..."
            className="w-full bg-transparent border-none px-4 py-3 text-sm text-white focus:outline-none resize-none max-h-32 min-h-[44px]"
            rows={1}
            disabled={isLoading}
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 text-gray-400 hover:text-indigo-400 disabled:opacity-50 transition"
          >
            <Send size={18} />
          </button>
        </form>
        <div className="text-[10px] text-gray-600 text-center mt-2 font-medium">Shift+Enter for new line</div>
      </div>
    </div>
  );
}
