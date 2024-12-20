import './App.css';

const apikey = process.env.REACT_APP_LASTFM_API_KEY;
const lastFmAuthUrl = `http://www.last.fm/api/auth/?api_key=${apikey}&cb=http://example.com`;

const handleLogin = () => {
  window.location.href = lastFmAuthUrl;
};

function App() {
  return (
    <div>
      <h1>Pixel Album Game</h1>
      <button onClick={handleLogin}>Login with Last.fm</button>


    </div>
  );
}

export default App;
