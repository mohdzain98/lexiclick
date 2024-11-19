import "./App.css";
import Popup from "./Components/Popup";

function App() {
  const wordapi = process.env.REACT_APP_WORDAPI;
  const wordhost = process.env.REACT_APP_WHOST;
  const host = process.env.REACT_APP_HOST;
  const api = process.env.REACT_APP_API;

  return <Popup prop={{ wordapi, wordhost, host, api }} />;
}

export default App;
