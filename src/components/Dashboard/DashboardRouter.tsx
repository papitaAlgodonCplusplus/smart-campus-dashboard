// src/components/Dashboard/DashboardRouter.tsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import OverviewPage from '../../pages/Dashboard/OverviewPage';
import FacultadesPage from '../../pages/Dashboard/FacultadesPage';
import SodasPage from '../../pages/Dashboard/SodasPage';
import AmenidadesPage from '../../pages/Dashboard/AmenidadesPage';
import MuseosPage from '../../pages/Dashboard/MuseosPage';
import MonumentosPage from '../../pages/Dashboard/MonumentosPage';
import BuildingsPage from '../../pages/Dashboard/BuildingsPage';
import ReservationsPage from '../../pages/Dashboard/ReservationsPage'; 
import EventosPage from '../../pages/EventosPage';
import MarketplacePage from '../../pages/MarketplacePage';

const DashboardRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<OverviewPage />} />
        <Route path="facultades" element={<FacultadesPage />} />
        <Route path="sodas" element={<SodasPage />} />
        <Route path="amenidades" element={<AmenidadesPage />} />
        <Route path="museos" element={<MuseosPage />} />
        <Route path="monumentos" element={<MonumentosPage />} />
        <Route path="edificios" element={<BuildingsPage />} />
        <Route path="reservaciones" element={<ReservationsPage />} />
        <Route path="eventos" element={<EventosPage />} />
        <Route path="marketplace" element={<MarketplacePage />} />
        <Route path="*" element={<Navigate replace to="/dashboard" />} />
      </Route>
    </Routes>
  );
};

export default DashboardRouter;