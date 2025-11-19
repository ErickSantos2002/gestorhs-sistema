import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { dashboardService } from '@/services';
import { DashboardMetrics } from '@/types';

interface DashboardContextData {
  metrics: DashboardMetrics | null;
  loading: boolean;
  refreshMetrics: () => Promise<void>;
  lastUpdate: Date | null;
}

export const DashboardContext = createContext<DashboardContextData>({} as DashboardContextData);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const refreshMetrics = useCallback(async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getMetrics();
      setMetrics(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Erro ao carregar métricas:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        metrics,
        loading,
        refreshMetrics,
        lastUpdate,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
