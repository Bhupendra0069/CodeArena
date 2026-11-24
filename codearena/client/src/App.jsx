import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Problems from './pages/Problems'
import ProblemDetails from './pages/ProblemDetails'
import CreateBattle from './pages/CreateBattle'
import BattleRoom from './pages/BattleRoom'
import Results from './pages/Results'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-dark-900">
          <Navbar />

          <main className="flex-1">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/problems" element={<Problems />} />

              {/* Problem details — public read, auth to submit */}
              <Route path="/problems/:id" element={
                <ProtectedRoute><ProblemDetails /></ProtectedRoute>
              } />

              {/* Protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute><Profile /></ProtectedRoute>
              } />
              <Route path="/battles/create" element={
                <ProtectedRoute><CreateBattle /></ProtectedRoute>
              } />
              <Route path="/battle/:id" element={
                <ProtectedRoute><BattleRoom /></ProtectedRoute>
              } />
              <Route path="/results/:id" element={
                <ProtectedRoute><Results /></ProtectedRoute>
              } />

              {/* 404 */}
              <Route path="*" element={
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                  <h1 className="text-6xl font-black text-gray-700 mb-4">404</h1>
                  <p className="text-gray-500 mb-6">Page not found.</p>
                  <a href="/" className="btn-primary px-6">Go Home</a>
                </div>
              } />
            </Routes>
          </main>

          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}
