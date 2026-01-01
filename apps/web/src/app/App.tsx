import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import { toast } from 'sonner';
import { useAppStore } from '@/shared/kernel/store';

// Layouts & Providers
import MainLayout from './layouts/MainLayout';
import AuthGuard from './providers/AuthGuard';

// Importing Features
import { AuthPage } from '@/features/auth';
import { DashboardPage } from '@/features/dashboard';
import { SignalsPage } from '@/features/signals';
import { PositionsPage } from '@/features/positions';
import { LogsPage } from '@/features/logs';
import { RiskPage } from '@/features/risk-performance';
import { BacktestPage } from '@/features/backtest';
import { SettingsPage } from '@/features/settings';
import { HealthPage } from '@/features/system-health';
import ControlCenter from '../pages/ControlCenter';
// Remapped to legacy for now
import { BotPage, MarketPage, ChartPage, BlankPage1, BlankPage2 } from '@/features/legacy';
import { SystemStatus } from '@/shared/kernel/types';

// Placeholder for missing pages
const CloudTrainingPage = () => <div className="p-8 text-white">Cloud Training Module (Coming Soon)</div>;

const App: React.FC = () => {
  // Initialize auth state from localStorage to persist sessions
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('metron_session') === 'active';
  });

  const [darkMode, setDarkMode] = useState(true);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    cpuUsage: 12,
    ramUsage: 45,
    apiLatency: 45,
    vmStatus: 'Running',
    connectionStatus: 'Connected'
  });

  // Global Kill Switch Handler
  const handleKillSwitch = useCallback(() => {
    // In a real app, this calls /api/stop
    alert("🚨 KILL SWITCH ACTIVATED: ALL TRADING HALTED, POSITIONS CLOSING...");
    console.error("KILL SWITCH TRIGGERED");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('metron_session');
    setIsAuthenticated(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'Escape') {
        handleKillSwitch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKillSwitch]);

  // Simulated WebSocket System Updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        ...prev,
        cpuUsage: Math.min(100, Math.max(0, prev.cpuUsage + (Math.random() * 10 - 5))),
        apiLatency: Math.max(10, prev.apiLatency + (Math.random() * 20 - 10))
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors closeButton />
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={
          !isAuthenticated ? (
            <AuthPage onLogin={handleLogin} />
          ) : (
            <Navigate to="/" replace />
          )
        } />

        {/* Protected Routes */}
        <Route element={<AuthGuard isAuthenticated={isAuthenticated} />}>
          <Route element={
            <MainLayout
              systemStatus={systemStatus}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              onLogout={handleLogout}
              onKillSwitch={handleKillSwitch}
            />
          }>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/chart" element={<ChartPage />} />
            <Route path="/signals" element={<SignalsPage />} />
            <Route path="/market" element={<MarketPage />} />
            <Route path="/positions" element={<PositionsPage />} />
            <Route path="/logs" element={<LogsPage />} />
            <Route path="/risk" element={<RiskPage />} />
            <Route path="/bot" element={<BotPage />} />
            <Route path="/backtest" element={<BacktestPage />} />
            <Route path="/training" element={<CloudTrainingPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/health" element={<HealthPage status={systemStatus} />} />
            <Route path="/control-center" element={<ControlCenter />} />
            <Route path="/control-center" element={<ControlCenter />} />

            {/* Keeping placeholders for compatibility */}
            <Route path="/blank1" element={<BlankPage1 />} />
            <Route path="/blank2" element={<BlankPage2 />} />

            {/* Catch all redirect to dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;