import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TablePagination,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Rating,
  Divider
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../src/context/AuthContext';

const FeedbackList = () => {
  const { isAdmin } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [averageRating, setAverageRating] = useState(0);

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
        const feedbackData = response.data.data;
        setFeedbacks(feedbackData);
        
        // Calculate average rating
        if (feedbackData.length > 0) {
          const totalRating = feedbackData.reduce((sum, item) => sum + item.rating, 0);
          setAverageRating((totalRating / feedbackData.length).toFixed(1));
        } else {
          setAverageRating(0);
        }
      } else {
        setError('Failed to fetch feedbacks');
        setFeedbacks([]);
        setAverageRating(0);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching feedbacks');
      setFeedbacks([]);
      setAverageRating(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
    setPage(0); // Reset to first page when changing filter
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (!isAdmin) {
    return (
      <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
        <Alert severity="info">
          You need admin privileges to view the feedback list.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
      <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
        Feedback List
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
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

        {feedbacks.length > 0 && (
          <Card sx={{ minWidth: 200, bgcolor: 'primary.light', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Average Rating
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h4" component="div" sx={{ mr: 1 }}>
                  {averageRating}
                </Typography>
                <Rating value={parseFloat(averageRating)} precision={0.1} readOnly />
              </Box>
              <Typography variant="body2">
                Based on {feedbacks.length} feedback{feedbacks.length !== 1 ? 's' : ''}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>

      <Divider sx={{ mb: 2 }} />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
      ) : feedbacks.length === 0 ? (
        <Alert severity="info" sx={{ my: 2 }}>No feedbacks found</Alert>
      ) : (
        <>
          <TableContainer component={Paper}>
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
                {feedbacks
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((feedback) => (
                    <TableRow key={feedback._id} hover>
                      <TableCell>{feedback.studentName}</TableCell>
                      <TableCell>{feedback.subject}</TableCell>
                      <TableCell>
                        <Rating value={feedback.rating} readOnly size="small" />
                      </TableCell>
                      <TableCell>{feedback.comments}</TableCell>
                      <TableCell>
                        {new Date(feedback.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={feedbacks.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </Box>
  );
};

export default FeedbackList;