import './App.css';
import axios from 'axios';
import crypto from 'crypto-js';

// LAST FM ROOT: http://ws.audioscrobbler.com/2.0/
const apiKey = process.env.REACT_APP_LASTFM_API_KEY;
const apiSecret = process.env.REACT_APP_LASTFM_SECRET;
const albumInfo = [];

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



// Testing
console.log("ApiKey "+apiKey);
console.log("ApiSecret "+apiSecret);
console.log("token "+token);
console.log("Apisig "+apiSig);

// Get user's session key -- Turns out this is not going to be used but I will here for now...
axios.get(`http://ws.audioscrobbler.com/2.0/?method=auth.getSession&api_key=${apiKey}&format=json&api_sig=${apiSig}&token=${token}`)
  .then(function (res) {
    const userName = res.data.session.name;

    // Second API call to get user's top albums
    return axios.get(`http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${userName}&api_key=${apiKey}&format=json`);
  })
  .then(function (res) {
    const albums = res.data.topalbums.album;
    const albumInfo = albums.map(album => {
      return {
        name: album.name,
        image: album.image[3]["#text"]
      };
    });

    console.log(albumInfo);
    // console.log(albumInfo[0]);
    // handleAlbums(albums);
  })
  .catch(err => {
    console.log(err.response);
  });

// function handleAlbums(albums) {
//   console.log('In handleAlbums:', albums); // Use albums here
// }


const test = [
  {
    name: "The Tale of a Cruel World (Calamity Original Game Soundtrack)",
    image: "https://lastfm.freetls.fastly.net/i/u/174s/08e266530603dca9437f4f3d2553beef.jpg"
  },
  {
    name: "Another Album Name",
    image: "https://via.placeholder.com/150"
  }
];

// console.log(test[0].name);
// console.log(test[1].image);

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

let i = getRandomInt(50);
console.log(i);

function App() {
  return (
    <div>
      <h1>Pixel Album Game</h1>
      <button onClick={handleLogin}>Login with Last.fm</button>
      <p>{}</p>
      <img></img>
    </div>
    
  );
}

export default App;
