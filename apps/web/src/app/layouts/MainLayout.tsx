import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Radio, List, FileText,
    ShieldAlert, Activity, Settings as SettingsIcon,
    Cpu, Power, Bot, Moon, Sun,
    Menu, Bell, LogOut, LineChart,
    CloudLightning, Globe, Square, CircleDashed
} from 'lucide-react';
import { SystemStatus } from '@/shared/kernel/types';

interface MainLayoutProps {
    systemStatus: SystemStatus;
    darkMode: boolean;
    setDarkMode: (mode: boolean) => void;
    onLogout: () => void;
    onKillSwitch: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({
    systemStatus, darkMode, setDarkMode, onLogout, onKillSwitch
}) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className={`flex h-screen w-full ${darkMode ? 'dark' : ''} bg-background text-slate-200 font-sans`}>
            {/* Sidebar */}
            <aside className={`w-64 bg-slate-900 border-r border-slate-800 flex flex-col ${isMobileMenuOpen ? 'flex' : 'hidden md:flex'}`}>
                <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center font-bold text-white">M</div>
                    <h1 className="text-xl font-bold tracking-tight text-white">Metron</h1>
                </div>

                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    <NavItem to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" end />
                    <NavItem to="/chart" icon={<LineChart size={18} />} label="Chart" />
                    <NavItem to="/signals" icon={<Radio size={18} />} label="Signals" />
                    <NavItem to="/market" icon={<Globe size={18} />} label="Market Intel" badge="New" />
                    <NavItem to="/positions" icon={<List size={18} />} label="Positions" />
                    <NavItem to="/logs" icon={<FileText size={18} />} label="Logs" />
                    <NavItem to="/risk" icon={<ShieldAlert size={18} />} label="Risk & Perf" />
                    <NavItem to="/bot" icon={<Bot size={18} />} label="Bot Engine" badge="Active" />
                    <NavItem to="/backtest" icon={<Activity size={18} />} label="Backtest" />
                    <NavItem to="/training" icon={<CloudLightning size={18} />} label="AI Training" />

                    <div className="pt-4 pb-2">
                        <div className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">System</div>
                    </div>
                    <NavItem to="/settings" icon={<SettingsIcon size={18} />} label="Settings" />
                    <NavItem to="/health" icon={<Cpu size={18} />} label="System Health" />
                </nav>

                <div className="p-3 border-t border-slate-800">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors mb-2"
                    >
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>

                    <div className="px-3 pt-2 border-t border-slate-800/50">
                        <div className="flex items-center gap-2 mb-1">
                            <div className={`w-2 h-2 rounded-full ${systemStatus.connectionStatus === 'Connected' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                            <span className="text-xs text-slate-400">WS: {systemStatus.connectionStatus}</span>
                        </div>
                        <div className="text-[10px] text-slate-600 font-mono">v2.1.0-beta</div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Topbar */}
                <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 z-10">
                    <div className="flex items-center gap-6">
                        <button
                            className="md:hidden text-slate-400 hover:text-white"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <Menu size={24} />
                        </button>
                        <div className="hidden lg:flex items-center gap-4">
                            <StatusPill label="PnL Today" value="+$1,240.50" color="text-green-400" />
                            <StatusPill label="Open Risk" value="$4,500" color="text-amber-400" />
                            <StatusPill label="Latency" value={`${systemStatus.apiLatency.toFixed(0)}ms`} color="text-slate-400" />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <ClockWidget />

                        <button
                            onClick={onKillSwitch}
                            className="bg-danger hover:bg-red-600 text-white font-bold py-2 px-6 rounded shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all flex items-center gap-2"
                            title="Shift + ESC to Trigger"
                        >
                            <Power size={18} /> <span className="hidden xl:inline">KILL SWITCH</span>
                        </button>

                        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full relative">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full"
                        >
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>
                </header>

                {/* Route Container */}
                <main className="flex-1 overflow-auto bg-background p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

// --- Helper Components ---

const NavItem: React.FC<{ to: string, icon: React.ReactNode, label: string, badge?: string, end?: boolean }> = ({
    to, icon, label, badge, end
}) => (
    <NavLink
        to={to}
        end={end}
        className={({ isActive }) => `w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
            ? 'bg-primary/10 text-primary border-l-2 border-primary'
            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
            }`}
    >
        <div className="flex items-center gap-3">
            {icon}
            <span>{label}</span>
        </div>
        {badge && <span className="bg-green-500/20 text-green-400 text-[10px] px-1.5 py-0.5 rounded uppercase">{badge}</span>}
    </NavLink>
);

const StatusPill: React.FC<{ label: string, value: string, color: string }> = ({ label, value, color }) => (
    <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{label}</span>
        <span className={`text-sm font-mono font-semibold ${color}`}>{value}</span>
    </div>
);

const ClockWidget: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const seconds = time.getSeconds();
    const minutes = time.getMinutes();
    const hours = time.getHours();
    // Rotations
    const secDeg = seconds * 6;
    const minDeg = minutes * 6 + seconds * 0.1;
    const hourDeg = (hours % 12) * 30 + minutes * 0.5;

    return (
        <div className="hidden xl:flex items-center gap-3 px-3 py-1.5 bg-slate-800/40 rounded-lg border border-slate-700/50 mr-2">
            <div className="relative w-8 h-8 rounded-full border-2 border-slate-500 bg-slate-900 shadow-inner">
                <div className="absolute top-1/2 left-1/2 w-0.5 h-2 bg-slate-200 rounded-full origin-bottom" style={{ transform: `translate(-50%, -100%) rotate(${hourDeg}deg)` }} />
                <div className="absolute top-1/2 left-1/2 w-0.5 h-3 bg-slate-400 rounded-full origin-bottom" style={{ transform: `translate(-50%, -100%) rotate(${minDeg}deg)` }} />
                <div className="absolute top-1/2 left-1/2 w-[1px] h-3.5 bg-red-500 rounded-full origin-bottom" style={{ transform: `translate(-50%, -100%) rotate(${secDeg}deg)` }} />
                <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-red-500 rounded-full -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="flex flex-col items-start justify-center -space-y-0.5">
                <span className="text-lg font-mono font-bold text-slate-200 leading-none">{time.toLocaleTimeString('en-GB', { hour12: false })}</span>
                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">UTC</span>
            </div>
        </div>
    );
};

export default MainLayout;
