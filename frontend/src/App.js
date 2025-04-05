import React, { useState } from "react";
import ArtworkList from "./components/ArtworkList";
import AddArtwork from "./components/AddArtwork";
import "./styles/App.css";

function App() {
  const [refresh, setRefresh] = useState(false);

  // Refresh the list after adding artwork
  const handleArtworkAdded = () => {
    setRefresh(!refresh);
  };

  return (
    <div className="app-container">
      <h1>🎨 Art Gallery Management</h1>
      <AddArtwork onArtworkAdded={handleArtworkAdded} />
      <ArtworkList key={refresh} />
    </div>
  );
}

export default App;
