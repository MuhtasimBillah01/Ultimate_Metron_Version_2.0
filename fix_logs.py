import os

content = r'''import React, { useEffect, useState } from 'react';

// Define Log Interface
interface Log {
  id: string;
  timestamp: string; // ISO string
  level: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  message: string;
  category: string;
}

const LogsPage: React.FC = () => {
    const [logs, setLogs] = useState<Log[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    
    // Filters
    const [filter, setFilter] = useState<'ALL' | 'ERROR' | 'WARNING'>('ALL');

    useEffect(() => {
        // WebSocket Connection
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.hostname;
        const port = '4700'; // Vite dev server port, proxied to backend
        
        const wsUrl = `${protocol}//${host}:${port}/ws/logs`;
        console.log('Connecting to WebSocket:', wsUrl);

        let ws: WebSocket;

        const connect = () => {
            ws = new WebSocket(wsUrl);

            ws.onopen = () => {
                console.log('WebSocket Connected');
                setIsConnected(true);
            };

            ws.onmessage = (event) => {
                try {
                    const message = event.data;
                    const newLog: Log = {
                        id: Date.now().toString() + Math.random().toString(),
                        timestamp: new Date().toISOString(),
                        level: 'INFO', 
                        message: message,
                        category: 'SYSTEM'
                    };

                    setLogs(prev => [newLog, ...prev].slice(0, 50)); 
                } catch (e) {
                    console.error('Error parsing log:', e);
                }
            };

            ws.onclose = () => {
                console.log('WebSocket Disconnected');
                setIsConnected(false);
                setTimeout(connect, 3000);
            };

            ws.onerror = (error) => {
                console.error('WebSocket Error:', error);
                ws.close();
            };
        };

        connect();

        return () => {
            if (ws) ws.close();
        };
    }, []);

  return (
    <div className="h-full flex flex-col bg-slate-950 p-4 rounded-lg border border-slate-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
            System Logs
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
        </h2>
        
        <div className="flex bg-slate-900 rounded-md p-1 gap-1">
            {(['ALL', 'WARNING', 'ERROR'] as const).map(f => (
                <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 text-xs font-semibold rounded ${
                        filter === f 
                        ? 'bg-slate-700 text-white shadow' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                >
                    {f}
                </button>
            ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden bg-slate-900/50 rounded-md border border-slate-800 relative">
        <div className="absolute inset-0 overflow-y-auto p-2 font-mono text-sm space-y-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {logs.length === 0 && (
              <div className="text-slate-500 text-center mt-10">Waiting for logs...</div>
          )}
          {logs
            .filter(l => filter === 'ALL' || l.level === 'CRITICAL' || l.level === 'ERROR' || (filter === 'WARNING' && l.level === 'WARNING'))
            .map((log) => (
            <div key={log.id} className="flex gap-3 hover:bg-slate-900/50 p-1 rounded items-start">
              <span className="text-slate-500 shrink-0 text-xs">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
              <span className={`shrink-0 font-bold w-16 text-center text-[10px] px-1 py-0.5 rounded leading-tight ${
                log.level === 'INFO' ? 'text-blue-400 bg-blue-900/20' :
                log.level === 'WARNING' ? 'text-amber-400 bg-amber-900/20' :
                log.level === 'ERROR' ? 'text-red-400 bg-red-900/20' : 'text-white bg-red-600'
              }`}>
                {log.level}
              </span>
              <span className="text-slate-400 shrink-0 w-16 text-xs truncate">[{log.category}]</span>
              <span className="text-slate-300 break-all">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogsPage;
'''

try:
    with open('apps/web/src/features/logs/ui/LogsPage.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Success")
except Exception as e:
    print(f"Error: {e}")
