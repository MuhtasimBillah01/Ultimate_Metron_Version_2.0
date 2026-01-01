import { create } from 'zustand';
import { executeApiCall } from '@/hooks/useApiCall';

interface BotConfig {
  exchangeType: string;
  exchangeName: string;
  riskLimit: number;
  maxDrawdown: number;
  strategyMode: string;
}

interface BotState {
  config: BotConfig;
  status: 'running' | 'stopped' | 'error' | 'initializing';
  pnL: number;
  isMarketOpen: boolean;

  // Loading states
  loadingConfig: boolean;
  loadingBot: boolean;

  setConfig: (config: Partial<BotConfig>) => void;
  setStatus: (status: BotState['status']) => void;
  setPnL: (pnl: number) => void;
  setMarketOpen: (open: boolean) => void;

  fetchConfig: () => Promise<void>;
  saveConfig: () => Promise<void>;
  startBot: () => Promise<void>;
  stopBot: () => Promise<void>;
  killBot: () => Promise<void>;
  fetchStatus: () => Promise<void>;
}

export const useBotStore = create<BotState>((set, get) => ({
  config: {
    exchangeType: 'crypto',
    exchangeName: 'Binance',
    riskLimit: 2,
    maxDrawdown: 20,
    strategyMode: 'hybrid',
  },
  status: 'stopped',
  pnL: 0,
  isMarketOpen: true,
  loadingConfig: false,
  loadingBot: false,

  setConfig: (newConfig) => set({ config: { ...get().config, ...newConfig } }),
  setStatus: (status) => set({ status }),
  setPnL: (pnL) => set({ pnL }),
  setMarketOpen: (open) => set({ isMarketOpen: open }),

  fetchConfig: async () => {
    set({ loadingConfig: true });
    try {
      const data = await executeApiCall(async () => {
        const res = await fetch('/api/config');
        if (!res.ok) throw new Error('Failed to fetch config');
        return res.json();
      }, { errorMessage: 'Failed to load config' });
      set({ config: data });
    } catch {
      // Error handled by executeApiCall
    } finally {
      set({ loadingConfig: false });
    }
  },

  saveConfig: async () => {
    set({ loadingConfig: true });
    try {
      await executeApiCall(async () => {
        const res = await fetch('/api/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(get().config),
        });
        if (!res.ok) throw new Error('Failed to save config');
        return res.json();
      }, {
        successMessage: 'Config saved successfully!',
        errorMessage: 'Failed to save config'
      });
    } catch {
      // Error handled
    } finally {
      set({ loadingConfig: false });
    }
  },

  startBot: async () => {
    set({ loadingBot: true, status: 'initializing' });
    try {
      await executeApiCall(async () => {
        const res = await fetch('/api/bot/start', { method: 'POST' });
        if (!res.ok) throw new Error('Failed to start bot');
        return res.json();
      }, {
        successMessage: 'Bot started successfully!',
        errorMessage: 'Failed to start bot'
      });
      set({ status: 'running' });
    } catch {
      set({ status: 'stopped' }); // Revert on failure
    } finally {
      set({ loadingBot: false });
    }
  },

  stopBot: async () => {
    set({ loadingBot: true });
    try {
      await executeApiCall(async () => {
        const res = await fetch('/api/bot/stop', { method: 'POST' });
        if (!res.ok) throw new Error('Failed to stop bot');
        return res.json();
      }, { successMessage: 'Bot stopped', errorMessage: 'Failed to stop bot' });
      set({ status: 'stopped' });
    } catch {
      // Error handled
    } finally {
      set({ loadingBot: false });
    }
  },

  killBot: async () => {
    set({ loadingBot: true });
    try {
      await executeApiCall(async () => {
        const res = await fetch('/api/bot/kill', { method: 'POST' });
        if (!res.ok) throw new Error('Kill switch failed');
        return res.json();
      }, {
        successMessage: 'Kill switch activated!',
        errorMessage: 'Kill switch failed',
        onSuccess: () => set({ status: 'stopped' })
      });
    } catch {
      // Error handled
    } finally {
      set({ loadingBot: false });
    }
  },

  fetchStatus: async () => {
    try {
      // Keeping original fetch logic or converting to apiCall? 
      // Converting for consistency.
      const data = await apiCall(async () => {
        const res = await fetch('/api/status/');
        if (!res.ok) throw new Error('Failed to fetch status');
        return res.json();
      }, { errorMessage: undefined }); // No toast on background status fetch fail ideally? 
      // User didn't specify, but regular status polling shouldn't spam toasts.
      // So I'll suppress error toast or leave it as console error only?
      // apiCall always toasts on error if errorMessage is provided or default.
      // I'll make a slight variation or just use it. 
      // Let's just use raw fetch for status to avoid spam, OR use apiCall with empty error message if I support that?
      // My apiCall uses default if msg missing.
      // I'll stick to original logic for fetchStatus to avoid spamming toasts on polling errors.

      // actually, let's just use `fetch` + `set` explicitly to match the "Pattern" but be silent.
      const res = await fetch('/api/status/');
      if (res.ok) {
        const statusData = await res.json();
        set({
          status: statusData.botStatus,
          pnL: statusData.pnL,
          isMarketOpen: statusData.marketOpen,
        });
      }
    } catch (error) {
      console.error('Failed to fetch status:', error);
    }
  },
}));
