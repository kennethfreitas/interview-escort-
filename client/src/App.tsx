import { Routes, Route } from 'react-router-dom';
import CandidatePage from './pages/CandidatePage';
import HomePage from './pages/HomePage';
import InterviewerPage from './pages/InterviewerPage';
import NewSessionPage from './pages/NewSessionPage';
import SessionSummaryPage from './pages/SessionSummaryPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/new-session" element={<NewSessionPage />} />
      <Route path="/interviewer" element={<InterviewerPage />} />
      <Route path="/candidate" element={<CandidatePage />} />
      <Route path="/summary" element={<SessionSummaryPage />} />
    </Routes>
  );
}
