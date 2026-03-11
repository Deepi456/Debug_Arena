import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import HostDashboard from './pages/HostDashboard';
import HostEvent from './pages/HostEvent';
import StudentJoin from './pages/StudentJoin';
import ExamArea from './pages/ExamArea';
import ResultPage from './pages/ResultPage';
import DisqualifiedPage from './pages/DisqualifiedPage';
import LandingPage from './pages/LandingPage';
import WaitingRoom from './pages/WaitingRoom';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-[#0a0b0d] text-gray-200 font-sans selection:bg-blue-500/30">
          <Routes>
            <Route path="/" element={<LandingPage />} />

            {/* Host Routes */}
            <Route path="/host" element={<HostDashboard />} />
            <Route path="/host-dashboard" element={<HostEvent />} />

            {/* Student Routes */}
            <Route path="/join" element={<StudentJoin />} />
            <Route path="/waiting-room" element={<WaitingRoom />} />
            <Route path="/exam/:eventCode/:studentId" element={<ExamArea />} />
            <Route path="/result/:eventCode/:studentId" element={<ResultPage />} />
            <Route path="/disqualified/:eventCode/:studentId" element={<DisqualifiedPage />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
