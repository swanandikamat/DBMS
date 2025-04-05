import React, { useState } from "react";
import axios from "axios";
import "../styles/AddArtwork.css";

const AddArtwork = ({ onArtworkAdded }) => {
  const [artwork, setArtwork] = useState({
    title: "",
    artist: "",
    description: "",
    price: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setArtwork({ ...artwork, [e.target.name]: e.target.value });
  };

  // Submit Artwork
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!artwork.title || !artwork.artist || !artwork.description || !artwork.price) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      const res = await axios.post("/api/artworks", artwork);
      onArtworkAdded(res.data);
      setArtwork({ title: "", artist: "", description: "", price: "" }); // Reset Form
      alert("Artwork added successfully!");
    } catch (err) {
      console.error("Error adding artwork:", err);
      alert("Failed to add artwork.");
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">🎨 Add New Artwork</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Artwork Title"
          value={artwork.title}
          onChange={handleChange}
          className="input-box"
        />
        <input
          type="text"
          name="artist"
          placeholder="Artist Name"
          value={artwork.artist}
          onChange={handleChange}
          className="input-box"
        />
        <textarea
          name="description"
          placeholder="Short Description"
          value={artwork.description}
          onChange={handleChange}
          className="input-box textarea"
        ></textarea>
        <input
          type="number"
          name="price"
          placeholder="Price (₹)"
          value={artwork.price}
          onChange={handleChange}
          className="input-box"
        />
        <button type="submit" className="submit-btn">➕ Add Artwork</button>
      </form>
    </div>
  );
};

export default AddArtwork;
