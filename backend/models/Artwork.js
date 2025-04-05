const mongoose = require('mongoose');

const ArtworkSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    artist: { type: String, required: true },
    category: { type: String }
});

module.exports = mongoose.model('Artwork', ArtworkSchema);