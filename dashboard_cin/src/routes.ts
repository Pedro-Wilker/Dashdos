import * as React from 'react'; // Required for JSX
import { HomePage } from './pages/HomePage';
import { InteractivePage } from './pages/InteractivePage';
import { SlideshowPage } from './pages/SlideshowPage';
import AdminScreen from './components/screens/AdminScreen';
import DiretoriaScreen from './components/screens/DiretoriaScreen';
import SacScreen from './components/screens/SacScreen';
import CartaScreen from './components/screens/CartaScreen';
import ArticulacaoScreen from './components/screens/ArticulacaoScreen';
import NgaScreen from './components/screens/NgaScreen';
import PontosScreen from './components/screens/PontosScreen';
import CapitalScreen from './components/screens/CapitalScreen';
import InteriorScreen from './components/screens/InteriorScreen';
import NudScreen from './components/screens/NudScreen';
import MovelScreen from './components/screens/MovelScreen';
import { PresentationChartBarIcon, UserCircleIcon, Cog6ToothIcon, InboxIcon, PowerIcon } from '@heroicons/react/24/solid';

// Define Logout component
const Logout: React.FC = () => <div>Logout Placeholder</div>;

interface Route {
  path: string;
  element: React.ReactNode;
  label: string;
  icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  subItems?: { path: string; label: string }[];
}

export const routes: Route[] = [
  { path: '/', element: <HomePage />, label: 'Home', icon: PresentationChartBarIcon },
  {
    path: '/interactive',
    element: <InteractivePage />,
    label: 'Dashboard CIN',
    icon: PresentationChartBarIcon,
    subItems: [
      { path: '/interactive/analytics', label: 'Analytics' },
      { path: '/interactive/reporting', label: 'Reporting' },
      { path: '/interactive/projects', label: 'Projects' },
    ],
  },
  { path: '/interactive/full', element: <InteractivePage />, label: 'Dashboard Completo', icon: PresentationChartBarIcon },
  { path: '/slideshow', element: <SlideshowPage />, label: 'Slideshow', icon: PresentationChartBarIcon },
  { path: '/admin', element: <AdminScreen />, label: 'ADMIN', icon: UserCircleIcon },
  { path: '/diretoria', element: <DiretoriaScreen />, label: 'DIRETORIA', icon: Cog6ToothIcon },
  { path: '/sac', element: <SacScreen />, label: 'SAC', icon: InboxIcon },
  { path: '/carta', element: <CartaScreen />, label: 'CARTA', icon: InboxIcon },
  { path: '/articulacao', element: <ArticulacaoScreen />, label: 'ARTICULAÇÃO', icon: InboxIcon },
  { path: '/nga', element: <NgaScreen />, label: 'NGA', icon: InboxIcon },
  { path: '/pontos', element: <PontosScreen />, label: 'PONTOS', icon: InboxIcon },
  { path: '/capital', element: <CapitalScreen />, label: 'CAPITAL', icon: InboxIcon },
  { path: '/interior', element: <InteriorScreen />, label: 'INTERIOR', icon: InboxIcon },
  { path: '/nud', element: <NudScreen />, label: 'NUD', icon: InboxIcon },
  { path: '/movel', element: <MovelScreen />, label: 'MÓVEL', icon: InboxIcon },
  { path: '/logout', element: <Logout />, label: 'Log Out', icon: PowerIcon },
];