const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Artist = require('../models/artist');
const Artwork = require('../models/Artwork');

// 🔧 Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// ➕ POST - Add new artwork with image upload
router.post('/', upload.single('image'), async (req, res) => {
  console.log('BODY:', req.body);
  console.log('FILE:', req.file);
  const { name, email, title, description,price } = req.body;

  if (!name || !email || !title || !description || !req.file) {
    return res.status(400).json({ error: 'All fields including image are required' });
  }

  try {
    let artist = await Artist.findOne({ email });
    if (!artist) {
      artist = new Artist({ name, email });
      await artist.save();
    }

    const newArtwork = new Artwork({
      title,
      image: req.file.filename,  // store filename
      description,
      price,
      artistId: artist._id
    });

    await newArtwork.save();
    res.status(201).json({
      message: 'Artwork created successfully',
      newArtwork: {
        _id: newArtwork._id,
        image: newArtwork.image,
        title: newArtwork.title,
        description: newArtwork.description,
        price: newArtwork.price 
      }
    });    

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ❌ DELETE - Remove artwork by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedArtwork = await Artwork.findByIdAndDelete(req.params.id);
    if (!deletedArtwork) {
      return res.status(404).json({ error: 'Artwork not found' });
    }
    res.status(200).json({ message: 'Artwork deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📂 GET - All artworks with artist info
router.get('/', async (req, res) => {
  try {
    const artworks = await Artwork.find().populate('artistId');
    res.status(200).json(artworks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📂 GET - Grouped artworks by artist
router.get('/by-artist', async (req, res) => {
  try {
    const artists = await Artist.find();
    const groupedData = await Promise.all(
      artists.map(async (artist) => {
        const artworks = await Artwork.find({ artistId: artist._id });
        return {
          artistName: artist.name,
          artistEmail: artist.email,
          artworks
        };
      })
    );
    res.status(200).json(
      groupedData.map(group => ({
        artist: {
          name: group.artistName,
          email: group.artistEmail
        },
        artworks: group.artworks
      }))
    );
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🖼️ Serve uploaded images
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

module.exports = router;
