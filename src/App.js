import './App.css';
import Popup from './Components/Popup';

function App() {
  const wordapi=process.env.REACT_APP_WORDAPI
  const wordhost=process.env.REACT_APP_WHOST
  const tkey=process.env.REACT_APP_TKEY
  console.log(wordapi,wordhost)
  return (
    <Popup prop={{wordapi,wordhost,tkey}}/>
  );
}

export default App;
