import React, { useState, useEffect } from "react";
import axios from "axios";

const Home = () => {
  const [characters, setCharacters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('https://rickandmortyapi.com/api/character');
        setCharacters(response.data.results);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  // Filter characters based on search input
  const filteredCharacters = characters.filter((character) =>
    character.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Home Page</h1>
      <input
        type="text"
        placeholder="Search characters by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Name</th>
            <th>Species</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredCharacters.map((character) => (
            <tr key={character.id}>
              <td>
                <img src={character.image} alt={character.name} width="50" />
              </td>
              <td>{character.name}</td>
              <td>{character.species}</td>
              <td>{character.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
