const mongoose = require('mongoose');

const serviceProviderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  service: { type: String, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String, required: true },
});

module.exports = mongoose.model('ServiceProvider', serviceProviderSchema);