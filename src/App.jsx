import { AppProvider } from './context/AppContext';
import TopBar from './components/TopBar';
import LeftPanel from './components/LeftPanel/LeftPanel';
import CentreCanvas from './components/Canvas/CentreCanvas';
import RightPanel from './components/RightPanel/RightPanel';
import SlideInPanel from './components/SlideInPanel';
import './App.css';

function App() {
  return (
    <AppProvider>
      <div className="app">
        <TopBar />
        <div className="app-body">
          <LeftPanel />
          <CentreCanvas />
          <RightPanel />
        </div>
        <SlideInPanel />
      </div>
    </AppProvider>
  );
}

export default App;
