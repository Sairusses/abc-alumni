import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/IndexPage";
import AlumniPage from "@/pages/AlumniPage";
import DefaultLayout from "@/layouts/default.tsx";
// import WorkHistoryPage from "@/pages/WorkHistoryPage";
// import EventsPage from "@/pages/EventsPage";
// import ParticipationPage from "@/pages/ParticipationPage";

function App() {
  return (
    <DefaultLayout>
      <Routes>
        <Route element={<IndexPage />} path="/" />
        <Route element={<AlumniPage />} path="/alumni" />
        {/*<Route element={<WorkHistoryPage />} path="/work-history" />*/}
        {/*<Route element={<EventsPage />} path="/events" />*/}
        {/*<Route element={<ParticipationPage />} path="/participation" />*/}
      </Routes>
    </DefaultLayout>
  );
}

export default App;
