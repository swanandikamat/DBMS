const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const artworkRoutes = require('./routes/artworkRoutes'); // Artwork routes
const Artwork = require('./models/Artwork'); // Import the Artwork model

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/artgallery', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

// Artwork routes
app.use('/api/artworks', artworkRoutes);

// ✅ NEW: Route to fetch all unique artists
app.get('/api/artists', async (req, res) => {
  try {
    const artworks = await Artwork.find();
    const artistMap = {};

    artworks.forEach((art) => {
      const { name, email } = art;
      if (!artistMap[email]) {
        artistMap[email] = { name, email };
      }
    });

    const artists = Object.values(artistMap);
    res.json(artists);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch artists' });
  }
});

// Server listening
const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
