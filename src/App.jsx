import { useApp } from './context/AppContext';
import TopBar from './components/TopBar';
import LeftPanel from './components/LeftPanel/LeftPanel';
import CentreCanvas from './components/Canvas/CentreCanvas';
import RightPanel from './components/RightPanel/RightPanel';
import SlideInPanel from './components/SlideInPanel';
import AutoSaver from './components/AutoSaver';
import WorkPackageWorkspace from './components/Canvas/WorkPackageWorkspace';
import './App.css';

function App() {
  const { state } = useApp();
  
  return (
    <div className={`app ${state?.leftPanelCollapsed ? 'collapsed-left' : ''}`}>
      <AutoSaver />
      <TopBar />
      <div className="app-body">
        <LeftPanel />
        <CentreCanvas />
        <RightPanel />
      </div>
      <SlideInPanel />
      <WorkPackageWorkspace />
    </div>
  );
}

export default App;
