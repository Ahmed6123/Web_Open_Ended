import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
  Alert,
  FormHelperText
} from '@mui/material';
import axios from 'axios';

const FeedbackForm = () => {
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      studentName: '',
      subject: '',
      rating: '',
      comments: ''
    }
  });

  const onSubmit = async (data) => {    
    try {
      const response = await axios.post('http://localhost:5000/api/feedback', data);
      
      if (response.data.success) {
        setAlert({
          open: true,
          message: 'Feedback submitted successfully!',
          severity: 'success'
        });
        
        // Reset form
        reset();
      }
    } catch (error) {
      setAlert({
        open: true,
        message: error.response?.data?.error || 'Failed to submit feedback',
        severity: 'error'
      });
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 500, mx: 'auto', p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
      <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
        Submit Feedback
      </Typography>
      
      <Controller
        name="studentName"
        control={control}
        rules={{ 
          required: 'Student name is required',
          minLength: { value: 2, message: 'Name must be at least 2 characters' }
        }}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Student Name"
            margin="normal"
            error={!!errors.studentName}
            helperText={errors.studentName?.message}
            required
          />
        )}
      />

      <Controller
        name="subject"
        control={control}
        rules={{ required: 'Subject is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Subject"
            margin="normal"
            error={!!errors.subject}
            helperText={errors.subject?.message}
            required
          />
        )}
      />

      <Controller
        name="rating"
        control={control}
        rules={{ required: 'Rating is required' }}
        render={({ field }) => (
          <FormControl 
            fullWidth 
            margin="normal" 
            error={!!errors.rating}
            required
          >
            <InputLabel>Rating</InputLabel>
            <Select
              {...field}
              label="Rating"
            >
              {[1, 2, 3, 4, 5].map(num => (
                <MenuItem key={num} value={num}>{num}</MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.rating?.message}</FormHelperText>
          </FormControl>
        )}
      />

      <Controller
        name="comments"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Comments"
            margin="normal"
            multiline
            rows={4}
          />
        )}
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