import React, { useEffect, useState } from "react";
import { useParams,Link } from "react-router-dom";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const { characterId } = useParams();
  const [character, setCharacter] = useState(null);

  useEffect(() => {
    async function fetchCharacter() {
      try {
        const response = await axios.get(`https://rickandmortyapi.com/api/character/${characterId}`);
        setCharacter(response.data);
      } catch (error) {
        console.error("Error fetching character data:", error);
      }
    }

    fetchCharacter();
  }, [characterId]);

  if (!character) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <Link to={`/`} className="homeBtn">Home</Link>
      <h1>Character Profile</h1>

      <div>
        <img src={character.image} alt={character.name} width="100" />
        <h2>{character.name}</h2>
        <p>Species: {character.species}</p>
        <p>Status: {character.status}</p>
        <p>Gender: {character.gender}</p>
      </div>
      
    </div>
  );
};

export default Profile;
