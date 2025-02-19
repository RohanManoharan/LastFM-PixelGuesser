import './App.css';
import axios from 'axios';
import crypto from 'crypto-js';
import React, { useState, useEffect} from 'react';
import JSConfetti from 'js-confetti';

const jsConfetti = new JSConfetti()


// LAST FM ROOT: http://ws.audioscrobbler.com/2.0/
const apiKey = process.env.REACT_APP_LASTFM_API_KEY;
const apiSecret = process.env.REACT_APP_LASTFM_SECRET;

//Login
const handleLogin = () => {
  const lastFmAuthUrl = `https://www.last.fm/api/auth/?api_key=${apiKey}&cb=https://rohanmanoharan.github.io/LastFM-PixelGuesser/`;
  window.location.href = lastFmAuthUrl;
};

// Get Token
const params = new URLSearchParams(window.location.search);
const token = params.get('token');

// Hash apiSig
const apiSig = crypto.MD5(
  `api_key${apiKey}methodauth.getSessiontoken${token}${apiSecret}`).toString();

function App() {
  const [albumInfo, setAlbumInfo] = useState([]);
  const [albumImg, setAlbumImg] = useState('https://placehold.co/300');
  const [albumName, setAlbumName] = useState('');
  const [shuffledName, setshuffledName] = useState('');


  // Fetch albums
  useEffect(() => {
    if (token) {
      axios.get(`https://ws.audioscrobbler.com/2.0/?method=auth.getSession&api_key=${apiKey}&format=json&api_sig=${apiSig}&token=${token}`)
        .then((res) => {
          const userName = res.data.session.name;

          // Second API call to get user's top albums
          return axios.get(`https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${userName}&api_key=${apiKey}&format=json`);
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
      console.log("Please Login to Last.fm first!");
    }
  }

  const pixelateImage = (imageSrc, name) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageSrc;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const sampleSize = 20;

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

      for (let y = 0; y < canvas.height; y += sampleSize) {
        for (let x = 0; x < canvas.width; x += sampleSize) {
          const idx = (x + y * canvas.width) * 4;
          ctx.fillStyle = `rgba(${pixelData[idx]}, ${pixelData[idx + 1]}, ${pixelData[idx + 2]}, ${pixelData[idx + 3]})`;
          ctx.fillRect(x, y, sampleSize, sampleSize);
        }
      }

      const pixelatedImg = new Image();
      pixelatedImg.src = canvas.toDataURL('image/jpeg');
      pixelatedImg.alt = name;

      const imgContainer = document.getElementById('img-container');
      imgContainer.innerHTML = '';
      imgContainer.appendChild(pixelatedImg);

      const shuffledName = shuffleString(name);
      setshuffledName(shuffledName);
      console.log(shuffledName);
    };
  };

  const shuffleString = (str) => {
    return str
      .split(' ')
      .map((word) => {
        const letters = word.split('');
        for (let i = letters.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [letters[i], letters[j]] = [letters[j], letters[i]];
        }
        return letters.join('');
      })
      .join(' ');
  };

  // On Album change, pixelate and shuffle 
  useEffect(() => {
    if (albumImg) {
      pixelateImage(albumImg, albumName);
    }
  }, [albumImg]);

  function handleGuess(event){
    event.preventDefault();
    const guess = document.getElementById('guess').value;
    console.log(guess.toLowerCase());
    if (guess.toLowerCase() === albumName.toLowerCase()){
      jsConfetti.addConfetti()
      generateRandomAlbum();
      document.getElementById('guess').value = "";
    }
  }

  const reshuffleAlbumName = () => {
    if (albumName) {
      const reshuffledName = shuffleString(albumName);
      setshuffledName(reshuffledName);
      console.log(reshuffledName);
    }
  };

  // console.log(albumImg);
  // console.log(albumName);

  return (
    <div>
      <div id='navbar'>
        <h1 id='title'>Pixel Guesser</h1>
        <button id='login' onClick={handleLogin}>Login with Last.fm</button>
      </div>


<div id='gameContent'>
  <div id='generatedAlbum'>
          <p id='ab-name'>{shuffledName}</p>
          <div id="img-container">
            <img id="ab-img" src={albumImg} alt={albumName} />
          </div>
          {albumInfo.length > 0 && (
            <><form id='guess-container'>
              <input id='guess' type='text' placeholder='Guess' />
              <button id='submit' onClick={handleGuess}>Submit</button>
            </form></>
          )}
  </div>
        <div id='buttons'>
          {albumInfo.length > 0 && (
            <><button id='genAlbum' onClick={generateRandomAlbum}>Generate</button> <br />
              <button id='reshuffle' onClick={reshuffleAlbumName}>Reshuffle</button></>
          )}
        </div>
      </div>
</div>
      
  );
}

export default App;
