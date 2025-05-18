const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');

// Sign in with magic link
router.post('/signin', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: process.env.REDIRECT_URL || 'http://localhost:5000',
      }
    });
    
    if (error) throw error;
    
    res.status(200).json({ message: 'Magic link sent successfully' });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get session data
router.get('/session', async (req, res) => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Session error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Sign out
router.post('/signout', async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
    
    res.status(200).json({ message: 'Signed out successfully' });
  } catch (error) {
    console.error('Sign out error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;