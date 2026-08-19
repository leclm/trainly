import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { MainLayout } from '../layouts/MainLayout'
import {
  DashboardPage,
  ExercisesPage,
  HistoryPage,
  SettingsPage,
  StatisticsPage,
  WorkoutsPage,
} from '../../pages'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'workouts', element: <WorkoutsPage /> },
      { path: 'exercises', element: <ExercisesPage /> },
      { path: 'history', element: <HistoryPage /> },
      { path: 'statistics', element: <StatisticsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
])

export const AppRouter = () => <RouterProvider router={router} />
