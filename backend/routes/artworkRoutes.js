const express = require('express');
const router = express.Router();
const Artwork = require('../models/Artwork');

// Get all artworks
router.get('/', async (req, res) => {
    const artworks = await Artwork.find();
    res.json(artworks);
});

// Add new artwork
router.post('/', async (req, res) => {
    const newArtwork = new Artwork(req.body);
    await newArtwork.save();
    res.json({ message: 'Artwork added!' });
});

// Delete artwork
router.delete('/:id', async (req, res) => {
    await Artwork.findByIdAndDelete(req.params.id);
    res.json({ message: 'Artwork deleted!' });
});

module.exports = router;
