const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
  title: String,
  image: String,
  description: String,
  price: { type: Number },
  artistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Artwork', artworkSchema);
