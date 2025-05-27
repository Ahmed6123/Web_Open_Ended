const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// POST - Submit feedback
router.post('/feedback', async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).json({ success: true, data: feedback });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// GET - Get all feedbacks
router.get('/feedbacks', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: feedbacks.length, data: feedbacks });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// GET - Get feedback by subject
router.get('/feedbacks/:subject', async (req, res) => {
  try {
    const subject = req.params.subject;
    const feedbacks = await Feedback.find({ subject }).sort({ createdAt: -1 });
    
    if (feedbacks.length === 0) {
      return res.status(404).json({ success: false, message: 'No feedbacks found for this subject' });
    }
    
    res.status(200).json({ success: true, count: feedbacks.length, data: feedbacks });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;