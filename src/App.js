import './App.css';
import './defaultStyle.css'
import Main from './pages/main'
import { HashRouter } from 'react-router-dom';

function App() {

  return (
    <HashRouter>
      {/* <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes" /> */}
      <div className="App">
          <Main />
      </div>
    </HashRouter>
  );
}

export default App;
