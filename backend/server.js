const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

app.get('/', (req, res) => res.send('API Running!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const artworkRoutes = require('./routes/artworkRoutes');
app.use('/api/artworks', artworkRoutes);
