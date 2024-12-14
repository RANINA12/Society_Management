const express = require('express');
const ServiceProvider = require('../Models/ServiceProvider');
const auth = require('../Middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const { service } = req.query;
    const query = service ? { service } : {};
    const serviceProviders = await ServiceProvider.find(query);
    res.json(serviceProviders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service providers.' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const serviceProvider = new ServiceProvider(req.body);
    await serviceProvider.save();
    res.status(201).json(serviceProvider);
  } catch (error) {
    res.status(500).json({ message: 'Error creating service provider.' });
  }
});

module.exports = router;