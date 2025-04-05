import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ArtworkList.css";

const ArtworkList = () => {
  const [artworks, setArtworks] = useState([]);

  // Fetch artworks from API
  const fetchArtworks = async () => {
    try {
      const res = await axios.get("/api/artworks");
      setArtworks(res.data);
    } catch (err) {
      console.error("Error fetching artworks:", err);
    }
  };

  // Delete artwork
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this artwork?")) return;

    try {
      await axios.delete(`/api/artworks/${id}`);
      setArtworks(artworks.filter((art) => art._id !== id)); // Update UI
      alert("Artwork deleted successfully!");
    } catch (err) {
      console.error("Error deleting artwork:", err);
      alert("Failed to delete artwork.");
    }
  };

  useEffect(() => {
    fetchArtworks();
  }, []);

  return (
    <div className="container">
      <h2 className="title">🖼️ Art Gallery</h2>
      <div className="artwork-grid">
        {artworks.length > 0 ? (
          artworks.map((art) => (
            <div key={art._id} className="artwork-card">
              <div className="artwork-info">
                <h3>{art.title}</h3>
                <p className="artist">By <strong>{art.artist}</strong></p>
                <p className="description">{art.description}</p>
                <p className="price">💰 ₹{art.price}</p>
              </div>
              <button className="delete-btn" onClick={() => handleDelete(art._id)}>
                🗑️ Delete
              </button>
            </div>
          ))
        ) : (
          <p className="no-artworks">No artworks available. Add some!</p>
        )}
      </div>
    </div>
  );
};

export default ArtworkList;
