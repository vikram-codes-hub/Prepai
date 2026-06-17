import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Generator from './pages/Generator'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import Bookmarks from './pages/Bookmarks'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0f0f0f',
              color: '#f0f0f0',
              border: '1px solid #1a1a1a',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px'
            },
            success: {
              iconTheme: { primary: '#ff6a00', secondary: '#0f0f0f' }
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#0f0f0f' }
            }
          }}
        />

        <Navbar />

        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected */}
          <Route path="/generate" element={
            <ProtectedRoute><Generator /></ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/history" element={
            <ProtectedRoute><History /></ProtectedRoute>
          } />
          <Route path="/bookmarks" element={
            <ProtectedRoute><Bookmarks /></ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </AuthProvider>
  )
}