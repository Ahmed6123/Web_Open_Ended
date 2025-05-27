import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from 'axios';

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch all feedbacks initially and when subject filter changes
  useEffect(() => {
    fetchFeedbacks();
  }, [selectedSubject]);

  // Fetch all subjects for the filter dropdown
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/feedbacks');
        if (response.data.success) {
          // Extract unique subjects
          const uniqueSubjects = [...new Set(response.data.data.map(item => item.subject))];
          setSubjects(uniqueSubjects);
        }
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    fetchSubjects();
  }, []);

  const fetchFeedbacks = async () => {
    setLoading(true);
    setError('');
    
    try {
      const url = selectedSubject 
        ? `http://localhost:5000/api/feedbacks/${selectedSubject}`
        : 'http://localhost:5000/api/feedbacks';
      
      const response = await axios.get(url);
      
      if (response.data.success) {
        setFeedbacks(response.data.data);
      } else {
        setError('Failed to fetch feedbacks');
        setFeedbacks([]);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching feedbacks');
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  return (
    <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
      <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
        Feedback List
      </Typography>
      
      <FormControl sx={{ mb: 3, minWidth: 200 }}>
        <InputLabel>Filter by Subject</InputLabel>
        <Select
          value={selectedSubject}
          label="Filter by Subject"
          onChange={handleSubjectChange}
        >
          <MenuItem value="">All Subjects</MenuItem>
          {subjects.map(subject => (
            <MenuItem key={subject} value={subject}>{subject}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
      ) : feedbacks.length === 0 ? (
        <Alert severity="info" sx={{ my: 2 }}>No feedbacks found</Alert>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Student Name</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Subject</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Rating</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Comments</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feedbacks.map((feedback) => (
                <TableRow key={feedback._id} hover>
                  <TableCell>{feedback.studentName}</TableCell>
                  <TableCell>{feedback.subject}</TableCell>
                  <TableCell>{feedback.rating}</TableCell>
                  <TableCell>{feedback.comments}</TableCell>
                  <TableCell>
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default FeedbackList;