import './App.css';
import Popup from './Components/Popup';

function App() {
  const wordapi=process.env.REACT_APP_WORDAPI
  const wordhost=process.env.REACT_APP_WHOST
  const host=process.env.REACT_APP_HOST
  
  return (
    <Popup prop={{wordapi,wordhost,host}}/>
  );
}

export default App;
