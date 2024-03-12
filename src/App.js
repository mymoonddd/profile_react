import './App.css';
import './defaultStyle.css'
import Main from './pages/main'
import { HashRouter } from 'react-router-dom';

function App() {
  return (
    <HashRouter>
      <div className="App">
        <div className="block">
          <Main />
        </div>
      </div>
    </HashRouter>
  );
}

export default App;
