import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import BookDetails from './pages/BookDetails'
import Login from './pages/Login'
import Signup from './pages/Signup'
import BooksTable from './pages/Dashboard/BooksTable'
import ReviewsTable from './pages/Dashboard/ReviewsTable'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Profile from './pages/Profile'

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/book/:id', element: <BookDetails /> },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },

  {
    path: '/admin',
    element: (
      <ProtectedRoute role="ADMIN">
        <BooksTable />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/reviews',
    element: (
      <ProtectedRoute role="ADMIN">
        <ReviewsTable />
      </ProtectedRoute>
    ),
  },

  { path: '/profile', element: <Profile /> },
  { path: '*', element: <NotFound /> },
])

const App = () => <RouterProvider router={router} />

export default App
