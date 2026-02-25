import React from 'react';
import { PortfolioTracking } from './PortfolioTracking';
import { Charts } from './Charts';
import { QuickActions } from './QuickActions';

const DashboardPage = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <PortfolioTracking />
      <Charts />
      <QuickActions />
    </div>
  );
};

export default DashboardPage;
