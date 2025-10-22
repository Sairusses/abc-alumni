import { Route, Routes } from "react-router-dom";

import AlumniPage from "@/pages/AlumniPage";
import WorkHistoryPage from "@/pages/WorkHistoryPage";
import EventsPage from "@/pages/EventsPage";
import ParticipationPage from "@/pages/ParticipationPage";

function App() {
  return (
    <Routes>
      <Routes>
        <Route element={<AlumniPage />} path="/" />
        <Route element={<WorkHistoryPage />} path="/work-history" />
        <Route element={<EventsPage />} path="/events" />
        <Route element={<ParticipationPage />} path="/participation" />
      </Routes>
    </Routes>
  );
}

export default App;
