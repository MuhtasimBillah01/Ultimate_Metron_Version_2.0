import React, { useEffect, useRef, useState } from 'react';
import { useBotStore } from '../stores/useBotStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Power, PowerOff, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const pnLData = [
    { time: '00:00', pnL: 0 },
]; // Initial state

const ControlCenter: React.FC = () => {
    const {
        config,
        status,
        pnL,
        isMarketOpen,
        setConfig,
        saveConfig,
        startBot,
        stopBot,
        killBot,
        fetchConfig,
        loadingConfig,
        loadingBot,
    } = useBotStore();

    const [logs, setLogs] = useState<string[]>([]);
    const [pnLChartData, setPnLChartData] = useState(pnLData);
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        fetchConfig(); // Load on mount

        // WebSocket Connection
        ws.current = new WebSocket('ws://localhost:8000/ws/control-center');

        ws.current.onopen = () => console.log('WS Connected');

        ws.current.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);
                if (msg.type === 'log') {
                    setLogs(prev => [...prev.slice(-100), `${msg.level}: ${msg.message}`]);
                } else if (msg.type === 'pnl') {
                    setPnLChartData(prev => [...prev.slice(-20), { time: new Date().toLocaleTimeString(), pnL: msg.value }]);
                    useBotStore.setState({ pnL: msg.value }); // Update global store PnL if needed
                } else if (msg.type === 'status') {
                    // Update status if provided
                }
            } catch (e) {
                console.error("WS Parse Error", e);
            }
        };

        ws.current.onclose = () => {
            console.log('WS Disconnected - Reconnecting...');
            // Simple reconnect logic could go here
            setTimeout(() => {
                // In a real app we'd trigger a re-render or effect to reconnect
                // For now, manual refresh or simple log
            }, 3000);
        };

        return () => {
            ws.current?.close();
        };
    }, [fetchConfig]);

    const handleSave = () => {
        saveConfig();
        // Toast: "Config saved successfully"
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 text-foreground">
            <h1 className="text-3xl font-bold text-center mb-8">Control Center</h1>

            {/* Bot Status & Controls */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        Bot Status
                        <div className="flex items-center gap-4">
                            <span className={`px-4 py-2 rounded-full text-white ${status === 'running' ? 'bg-green-600' : 'bg-red-600'}`}>
                                {status.toUpperCase()}
                            </span>
                            {status === 'running' ? (
                                <>
                                    <Button onClick={stopBot} variant="outline" className="gap-2" disabled={loadingBot}>
                                        {loadingBot ? 'Stopping...' : <><PowerOff size={16} /> Stop</>}
                                    </Button>
                                    <Button onClick={killBot} variant="destructive" className="gap-2" disabled={loadingBot}>
                                        {loadingBot ? 'Killing...' : <><AlertTriangle size={16} /> Kill Switch</>}
                                    </Button>
                                </>
                            ) : (
                                <Button onClick={startBot} className="gap-2 bg-green-600 text-white hover:bg-green-700" disabled={loadingBot}>
                                    {loadingBot ? 'Starting...' : <><Power size={16} /> Start Bot</>}
                                </Button>
                            )}
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p>Market Status: {isMarketOpen ? '🟢 Open' : '🔴 Closed/Holiday'}</p>
                            <p className="mt-2 text-xl font-semibold">Current PnL: <span className={pnL >= 0 ? 'text-green-600' : 'text-red-600'}>${pnL.toFixed(2)}</span></p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Live Logs */}
            <Card>
                <CardHeader><CardTitle>Live Logs</CardTitle></CardHeader>
                <CardContent>
                    <div className="h-64 overflow-y-auto font-mono text-sm bg-black text-green-400 p-4 rounded scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-black">
                        {logs.length === 0 ? (
                            <div className="opacity-50 italic">Waiting for logs...</div>
                        ) : (
                            logs.map((log, i) => <div key={i}>{log}</div>)
                        )}
                        <div ref={(el) => el?.scrollIntoView({ behavior: "smooth" })} />
                    </div>
                </CardContent>
            </Card>

            {/* Live PnL Chart */}
            <Card>
                <CardHeader><CardTitle>Live PnL</CardTitle></CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={pnLChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="time" stroke="#888" />
                                <YAxis stroke="#888" />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                                <Line type="monotone" dataKey="pnL" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Configuration Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Exchange Type</Label>
                            <Select value={config.exchangeType} onValueChange={(v: string) => setConfig({ exchangeType: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="crypto">Crypto</SelectItem>
                                    <SelectItem value="forex">Forex</SelectItem>
                                    <SelectItem value="traditional">Stock/ETF/Commodities</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Exchange Name</Label>
                            <Input value={config.exchangeName} onChange={(e) => setConfig({ exchangeName: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Risk Limit (% per trade)</Label>
                            <Input type="number" value={config.riskLimit} onChange={(e) => setConfig({ riskLimit: Number(e.target.value) })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Max Drawdown (%)</Label>
                            <Input type="number" value={config.maxDrawdown} onChange={(e) => setConfig({ maxDrawdown: Number(e.target.value) })} />
                        </div>
                    </div>
                    <Button onClick={handleSave} className="w-full mt-4" disabled={loadingConfig}>
                        {loadingConfig ? 'Saving...' : 'Save Configuration'}
                    </Button>
                </CardContent>
            </Card>

            {/* Future Extensions Placeholder */}
            <Card className="bg-muted/50">
                <CardHeader><CardTitle>Future Modules (Coming Soon)</CardTitle></CardHeader>
                <CardContent>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li>Strategy Parameters (AI weights, indicators)</li>
                        <li>API Keys Management (masked)</li>
                        <li>Trade History Table</li>
                        <li>Real-time Logs Feed (WebSocket)</li>
                        <li>Telegram Alert Settings</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
};

export default ControlCenter;
