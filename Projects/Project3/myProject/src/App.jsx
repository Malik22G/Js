import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('Blake Blosom'); // Initialize searchTerm with a default value
  const [data,setData] = useState([]);
  const options = {
    method: 'GET',
    url: `https://porn-gallery.p.rapidapi.com/pornos/${searchTerm}`,
    headers: {
      'X-RapidAPI-Key': 'c06aad9008mshed198d4baea5047p1a214cjsne50c1042eddf',
      'X-RapidAPI-Host': 'porn-gallery.p.rapidapi.com',
    },
  };

  const fetchData = async () => {
    try {
      const response = await axios.request(options);
      console.log(response.data.results);
      setData(response.data.results);

    } catch (error) {
      console.error(error);
    }
  };
  
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData(); 
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="text" value={searchTerm} onChange={handleInputChange} />
        <button type="submit">Search</button>
      </form>

      <div className="image-gallery">
      {data.map((shoot, shootIndex) => (
    <div key={shootIndex}>
      <h2>Images from {shoot.title}</h2>
      <div className="image-list">
        {shoot.images.map((image, imageIndex) => (
          <img key={imageIndex} src={image} />
        ))}
      </div>
    </div>
  ))}
</div>
    </>
  );
}

export default App;
