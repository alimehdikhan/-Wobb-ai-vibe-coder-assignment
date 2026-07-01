import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { PageTransition } from "@/components/PageTransition";
import { SearchPage } from "@/pages/SearchPage";
import { ProfileDetailPage } from "@/pages/ProfileDetailPage";
import { SelectedListPage } from "@/pages/SelectedListPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PageTransition><SearchPage /></PageTransition>} />
        <Route
          path="/profile/:username"
          element={<PageTransition><ProfileDetailPage /></PageTransition>}
        />
        <Route path="/list" element={<PageTransition><SelectedListPage /></PageTransition>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
