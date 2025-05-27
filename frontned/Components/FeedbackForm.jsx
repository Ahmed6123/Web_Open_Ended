import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Typography,
  Snackbar,
  Alert
} from '@mui/material';
import axios from 'axios';

const FeedbackForm = () => {
  const [feedback, setFeedback] = useState({
    studentName: '',
    subject: '',
    rating: '',
    comments: ''
  });
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!feedback.studentName.trim()) newErrors.studentName = 'Student name is required';
    if (!feedback.subject.trim()) newErrors.subject = 'Subject is required';
    if (!feedback.rating) newErrors.rating = 'Rating is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const response = await axios.post('http://localhost:5000/api/feedback', feedback);
      
      if (response.data.success) {
        setAlert({
          open: true,
          message: 'Feedback submitted successfully!',
          severity: 'success'
        });
        
        // Reset form
        setFeedback({
          studentName: '',
          subject: '',
          rating: '',
          comments: ''
        });
      }
    } catch (error) {
      setAlert({
        open: true,
        message: error.response?.data?.error || 'Failed to submit feedback',
        severity: 'error'
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedback({ ...feedback, [name]: value });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500, mx: 'auto', p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
      <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
        Submit Feedback
      </Typography>
      
      <TextField
        fullWidth
        label="Student Name"
        name="studentName"
        value={feedback.studentName}
        onChange={handleChange}
        margin="normal"
        error={!!errors.studentName}
        helperText={errors.studentName}
        required
      />

      <TextField
        fullWidth
        label="Subject"
        name="subject"
        value={feedback.subject}
        onChange={handleChange}
        margin="normal"
        error={!!errors.subject}
        helperText={errors.subject}
        required
      />

      <FormControl 
        fullWidth 
        margin="normal" 
        error={!!errors.rating}
        required
      >
        <InputLabel>Rating</InputLabel>
        <Select
          value={feedback.rating}
          label="Rating"
          name="rating"
          onChange={handleChange}
        >
          {[1, 2, 3, 4, 5].map(num => (
            <MenuItem key={num} value={num}>{num}</MenuItem>
          ))}
        </Select>
        {errors.rating && (
          <Typography variant="caption" color="error">
            {errors.rating}
          </Typography>
        )}
      </FormControl>

      <TextField
        fullWidth
        label="Comments"
        name="comments"
        value={feedback.comments}
        onChange={handleChange}
        margin="normal"
        multiline
        rows={4}
      />

      <Button 
        type="submit" 
        variant="contained" 
        color="primary" 
        sx={{ mt: 3 }}
        fullWidth
      >
        Submit Feedback
      </Button>

      <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FeedbackForm;