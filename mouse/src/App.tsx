
import mouseimage from './assets/images/mouse_call.PNG';
import './App.css';
import { TokenizationComponent } from './components';

function App() {
  return (
    <>
      <img src={mouseimage} alt="MOUSE" style={{ width: '23%', height: 'auto' }} />
      <h1>MOUSE</h1>
      <TokenizationComponent />
    </>
  );
}

export default App;
