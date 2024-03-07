import './App.css';
import './defaultStyle.css'
import Main from './pages/main'
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <div className="block">
          <Main />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
