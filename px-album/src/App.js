import './App.css';
import crypto from 'crypto-js';

const apiKey = process.env.REACT_APP_LASTFM_API_KEY;
const apiSecret = process.env.REACT_APP_LASTFM_SECRET;

const handleLogin = () => {
  const lastFmAuthUrl = `http://www.last.fm/api/auth/?api_key=${apiKey}&cb=http://localhost:3000`;
  window.location.href = lastFmAuthUrl;
};

const params = new URLSearchParams(window.location.search);
const userToken = params.get('token');

console.log("ApiKey "+apiKey);
console.log("userToken "+userToken);
console.log("ApiSecret "+apiSecret);

const apiSig = crypto.MD5(
  `api_key${apiKey}methodauth.getSessiontoken${userToken}${apiSecret}`
).toString();


console.log("Apisig "+apiSig);

function App() {
  return (
    <div>
      <h1>Pixel Album Game</h1>
      <button onClick={handleLogin}>Login with Last.fm</button>
    </div>
  );
}

export default App;
