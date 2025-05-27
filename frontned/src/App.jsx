import React from 'react';
import { Container, CssBaseline, Typography, Box, createTheme, ThemeProvider } from '@mui/material';
import FeedbackForm from '../Components/FeedbackForm';
import FeedbackList from '../Components/FeedbackList'

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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
            Student Feedback System
          </Typography>
          <FeedbackForm />
          <FeedbackList />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;