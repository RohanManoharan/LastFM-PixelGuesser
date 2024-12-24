import './App.css';
import axios from 'axios';
import crypto from 'crypto-js';

// LAST FM ROOT: http://ws.audioscrobbler.com/2.0/
const apiKey = process.env.REACT_APP_LASTFM_API_KEY;
const apiSecret = process.env.REACT_APP_LASTFM_SECRET;

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
    const sk = res.data.session.key;
    const userName = res.data.session.name;
    console.log(sk)
  }).catch(err => {
    console.log(err.response);
  });

//
  axios.get(`http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${userName}&api_key=${apiKey}&format=json`)
  .then(function (res) {
    const sk = res.data.session.key;
    console.log(sk)
  }).catch(err => {
    console.log(err.response);
  });


function App() {
  return (
    <div>
      <h1>Pixel Album Game</h1>
      <button onClick={handleLogin}>Login with Last.fm</button>
    </div>
  );
}

export default App;
