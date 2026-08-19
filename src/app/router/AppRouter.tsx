import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { MainLayout } from '../layouts/MainLayout'
import {
  DashboardPage,
  ExerciseDetailsPage,
  ExerciseFormPage,
  ExercisesListPage,
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
      { path: 'exercises', element: <ExercisesListPage /> },
      { path: 'exercises/new', element: <ExerciseFormPage /> },
      { path: 'exercises/:exerciseId', element: <ExerciseDetailsPage /> },
      { path: 'exercises/:exerciseId/edit', element: <ExerciseFormPage /> },
      { path: 'history', element: <HistoryPage /> },
      { path: 'statistics', element: <StatisticsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
])

export const AppRouter = () => <RouterProvider router={router} />
