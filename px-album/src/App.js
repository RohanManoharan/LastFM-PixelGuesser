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
      axios.get(`http://ws.audioscrobbler.com/2.0/?method=auth.getSession&api_key=${apiKey}&format=json&api_sig=${apiSig}&token=${token}`)
        .then((res) => {
          const userName = res.data.session.name;

          // Second API call to get user's top albums
          return axios.get(`http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${userName}&api_key=${apiKey}&format=json`);
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
      document.getElementById("genAlbumError").textContent="Please Login to lastFM first!";
    }
  }

  function pixelateImage(){
    let c = document.createElement("canvas");
    let img1 = new Image();
    img1.crossOrigin = "Anonymous";


    img1.onload = function(){
      document.getElementById("ab-img").remove();
      let w = img1.width;
      let h = img1.height;

      c.width = w;
      c.height = h;
      let ctx = c.getContext("2d");
      ctx.drawImage(img1,0,0);

      let pixelArr = ctx.getImageData(0,0,w,h).data;
      let sample_size=20;

      for (let y=0;y<h;y+=sample_size)
        for(let x=0;x<w;x+=sample_size){
      let p = (x+(y*w))*4;
      ctx.fillStyle = "rgba(" + pixelArr[p] + "," + pixelArr[p+1] + "," + pixelArr[p+2] + "," + pixelArr[p+3] + ")";
      ctx.fillRect(x,y,sample_size,sample_size);
    }


      let img2  = new Image();
      img2.src = c.toDataURL("image/jpeg");
      img2.width = w;
      document.body.appendChild(img2);
    }
    img1.src = document.getElementById('ab-img').src;
  }

  return (
    <div>
      <h1>Pixel Album Game</h1>
      <button onClick={handleLogin}>Login with Last.fm</button>
      <p id='ab-name'>{albumName} </p>
      <img id='ab-img' src={albumImg} alt={albumName} /> <br></br>
      <button onClick={generateRandomAlbum}>Generate</button>
      <button onClick={pixelateImage}>Pixelate</button>

      <p id="genAlbumError"></p>
    </div>
  );
}

export default App;
