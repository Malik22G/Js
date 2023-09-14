import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

const Home = () => {
  const [characters, setCharacters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    try {
      const response = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
      const data = await response.json();

      if (data.results.length === 0) {
        setHasMore(false);
        return;
      }

      setCharacters((prevCharacters) => [...prevCharacters, ...data.results]);
      setPage(page + 1);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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
      <InfiniteScroll
        dataLength={characters.length}
        next={fetchCharacters}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={<p>No more characters to load.</p>}
      >
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
                <td>
                  <Link to={`/profile/${character.id}`}>{character.name}</Link>
                </td>
                <td>{character.species}</td>
                <td>{character.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </InfiniteScroll>
    </div>
  );
};

export default Home;
