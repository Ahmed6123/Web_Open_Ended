import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container, CssBaseline, Box, createTheme, ThemeProvider } from '@mui/material';
import FeedbackForm from '../Components/FeedbackForm';
import FeedbackList from '../Components/FeedbackList';
import Login from '../Components/Login';
import Navigation from '../Components/Navigation';
import { AuthProvider, useAuth } from './context/AuthContext';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function AppContent() {
  const { isAuthenticated } = useAuth();
  
  return (
    <Router>
      <Navigation />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Box>
                  <FeedbackForm />
                  <FeedbackList />
                </Box>
              </ProtectedRoute>
            } />
          </Routes>
        </Box>
      </Container>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;