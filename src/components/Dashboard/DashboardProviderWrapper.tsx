import React from 'react';
import { DashboardProvider } from './DashboardContext';
import DashboardRouter from './DashboardRouter';

/**
 * A wrapper component that provides the DashboardContext to the Dashboard routes
 */
const DashboardProviderWrapper: React.FC = () => {
  return (
    <DashboardProvider>
      <DashboardRouter />
    </DashboardProvider>
  );
};

export default DashboardProviderWrapper;