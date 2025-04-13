import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [artistName, setArtistName] = useState("");
  const [artistEmail, setArtistEmail] = useState("");
  const [artworkTitle, setArtworkTitle] = useState("");
  const [artworkDescription, setArtworkDescription] = useState("");
  const [artworkImage, setArtworkImage] = useState(null);
  const [artworksByArtist, setArtworksByArtist] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [artists, setArtists] = useState([]);
  const [showAllArtists, setShowAllArtists] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [artworkPrice, setArtworkPrice] = useState("");


  const fetchArtworks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/artworks/by-artist");
      setArtworksByArtist(res.data || []);
    } catch (error) {
      console.error("Error fetching artworks:", error);
    }
  };

  const fetchAllArtists = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/artists");
      setArtists(res.data || []);
    } catch (error) {
      console.error("Error fetching artists:", error);
    }
  };

  useEffect(() => {
    fetchArtworks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", artistName);
    formData.append("email", artistEmail);
    formData.append("title", artworkTitle);
    formData.append("description", artworkDescription);
    formData.append("image", artworkImage);
    formData.append("price", artworkPrice);


    try {
      const res = await axios.post("http://localhost:5000/api/artworks", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newArtwork = {
        _id: res.data.newArtwork._id,
        title: artworkTitle,
        description: artworkDescription,
        image: res.data.newArtwork.image,
        price: artworkPrice
      };      

      setArtworkPrice("");

      const updated = [...artworksByArtist];
      const existingArtistIndex = updated.findIndex(
        (group) => group.artist.email === artistEmail
      );

      if (existingArtistIndex !== -1) {
        updated[existingArtistIndex].artworks.unshift(newArtwork);
      } else {
        updated.unshift({
          artist: { name: artistName, email: artistEmail },
          artworks: [newArtwork],
        });
      }

      setArtworksByArtist(updated);
      setArtistName("");
      setArtistEmail("");
      setArtworkTitle("");
      setArtworkDescription("");
      setArtworkImage(null);
    } catch (error) {
      alert("Failed to upload artwork");
      console.error(error);
    }
  };

  const handleDelete = async (artworkId) => {
    try {
      await axios.delete(`http://localhost:5000/api/artworks/${artworkId}`);
      fetchArtworks();
    } catch (error) {
      console.error("Error deleting artwork", error);
    }
  };

  const filteredArtworks = artworksByArtist
    .map((group) => ({
      ...group,
      artworks: group.artworks.filter((art) =>
        art.title.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((group) => group.artworks.length > 0);
    

  return (
    
    <div className="App">
      <h2>🎨 Upload New Artwork</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          placeholder="Artist Name"
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Artist Email"
          value={artistEmail}
          onChange={(e) => setArtistEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Artwork Title"
          value={artworkTitle}
          onChange={(e) => setArtworkTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Artwork Description"
          value={artworkDescription}
          onChange={(e) => setArtworkDescription(e.target.value)}
          required
          rows="4"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setArtworkImage(e.target.files[0])}
          required
        />
        
        <input
  type="number"
  placeholder="Artwork Price"
  value={artworkPrice}
  onChange={(e) => setArtworkPrice(e.target.value)}
  required
/>

        <button type="submit">Upload Artwork</button>
      </form>

      <div style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="🔍 Search by Title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: "8px", width: "300px", fontSize: "1rem", marginRight: "1rem" }}
        />
        <button
          className="show-artists-button"
           onClick={() => {
            if (!showAllArtists) fetchAllArtists();
            setShowAllArtists(!showAllArtists);
          }}
        >
          {showAllArtists ? "Hide Artist List" : "Show All Artists"}
        </button>
      </div>

      {showAllArtists && (
        <div style={{ marginBottom: "2rem" }}>
        <h3>🎨 All Artists with Uploaded Work</h3>
        <ul>
          {artworksByArtist
            .filter((group) => group.artworks.length > 0) // show only those with artwork
            .map((group, idx) => (
              <li key={idx}>
                <strong>{group.artist?.name}</strong> ({group.artist?.email})
              </li>
            ))}
        </ul>
      </div>
      )}
      {/* Add this after the gallery and before the final closing </div> */}
{selectedArtwork && (
  <div className="modal-backdrop" onClick={() => setSelectedArtwork(null)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <img
        src={`http://localhost:5000/uploads/${selectedArtwork.image}`}
        alt={selectedArtwork.title}
      />
      <h2>{selectedArtwork.title}</h2>
      <p><strong>Artist:</strong> {selectedArtwork.artistName}</p>
      <p><strong>Description:</strong> {selectedArtwork.description}</p>
      {selectedArtwork.price && <p><strong>Price:</strong> ₹{selectedArtwork.price}</p>}
      <button onClick={() => setSelectedArtwork(null)}>Close</button>
    </div>
  </div>
)}


      <h3>🖼️ Artworks Gallery</h3>
      {filteredArtworks.length === 0 ? (
        <p>No artworks found.</p>
      ) : (
        filteredArtworks.map((group, index) => (
          <div className="artist-folder" key={index}>
            <h4>{group.artist.name}</h4>
            <div className="artwork-grid">
              {group.artworks.map((art) => (
                <div className="artwork-card" key={art._id}
                onClick={() =>
                  setSelectedArtwork({
                    ...art,
                    artistName: group.artist.name,
                    price: art.price
                  })
                }
              >
                  <img src={`http://localhost:5000/uploads/${art.image}`} alt={art.title} />
                  <h5>{art.title}</h5>
                  <p>{art.description}</p>
                  <p className="art-price"><strong>Price:</strong> ₹{art.price || "Not available"}</p>
                  <button
                    onClick={() => handleDelete(art._id)}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: "#ff4d4d",
                      border: "none",
                      color: "white",
                      padding: "5px 10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
