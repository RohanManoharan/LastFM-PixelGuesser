import './App.css';
import axios from 'axios';
import crypto from 'crypto-js';
import React, { useState, useEffect} from 'react';

// LAST FM ROOT: http://ws.audioscrobbler.com/2.0/
const apiKey = process.env.REACT_APP_LASTFM_API_KEY;
const apiSecret = process.env.REACT_APP_LASTFM_SECRET;
// const albumInfo = [];

//Login
const handleLogin = () => {
  const lastFmAuthUrl = `http://www.last.fm/api/auth/?api_key=${apiKey}&cb=http://localhost:3000`;
  window.location.href = lastFmAuthUrl;
};

// Get Token
const params = new URLSearchParams(window.location.search);
const token = params.get('token');

// Hash apiSig
const apiSig = crypto.MD5(
  `api_key${apiKey}methodauth.getSessiontoken${token}${apiSecret}`
).toString();

function App() {
  const [albumInfo, setAlbumInfo] = useState([]);
  const [albumImg, setAlbumImg] = useState('');
  const [albumName, setAlbumName] = useState('');

  // Fetch albums
  useEffect(() => {
    if (token) {
      axios
        .get(
          `http://ws.audioscrobbler.com/2.0/?method=auth.getSession&api_key=${apiKey}&format=json&api_sig=${apiSig}&token=${token}`
        )
        .then((res) => {
          const userName = res.data.session.name;

          // Second API call to get user's top albums
          return axios.get(
            `http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${userName}&api_key=${apiKey}&format=json`
          );
        })
        .then((res) => {
          const albums = res.data.topalbums.album.map((album) => ({
            name: album.name,
            image: album.image[3]['#text'],
          }));
          console.log(albums);
          setAlbumInfo(albums);
        })
        .catch((err) => {
          console.error(err.response);
        });
    }
  }, []);

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function generateRandomAlbum() {
    if (albumInfo.length > 0) {
      const i = getRandomInt(albumInfo.length);
      setAlbumImg(albumInfo[i].image);
      setAlbumName(albumInfo[i].name);
    } else {
      console.log('No albums available.');
    }
  }

  return (
    <div>
      <h1>Pixel Album Game</h1>
      <button onClick={handleLogin}>Login with Last.fm</button>
      <p>{albumName}</p>
      {albumImg && <img src={albumImg} alt={albumName} />}
      <button onClick={generateRandomAlbum}>Generate</button>
    </div>
  );
}

export default App;
