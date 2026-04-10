import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import FirstVisitLoadingShell from "./components/FirstVisitLoadingShell";
import PortfolioExperienceShell from "./components/PortfolioExperienceShell";
import PublicExperienceShell from "./components/PublicExperienceShell";
import PortfolioHome from "./pages/PortfolioHome";
import PublicDocumentPage from "./pages/PublicDocumentPage";
import PresentationRemotePage from "./pages/PresentationRemotePage";
import StudioBriefPage from "./pages/StudioBriefPage";
import StudioHomeRedirectPage from "./pages/StudioHomeRedirectPage";
import StudioLibraryPage from "./pages/StudioLibraryPage";
import StudioProjectRedirectPage from "./pages/StudioProjectRedirectPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PortfolioExperienceShell>
              <PortfolioHome />
            </PortfolioExperienceShell>
          }
        />
        <Route
          path="/studio"
          element={
            <FirstVisitLoadingShell>
              <StudioLibraryPage />
            </FirstVisitLoadingShell>
          }
        />
        <Route
          path="/studio/brief"
          element={
            <FirstVisitLoadingShell>
              <StudioBriefPage />
            </FirstVisitLoadingShell>
          }
        />
        <Route element={<PublicExperienceShell />}>
          <Route path="/studio/project/:code" element={<PublicDocumentPage />} />
        </Route>
        <Route
          path="/studio/create"
          element={<Navigate to="/studio" replace />}
        />
        <Route path="/studio/project/sample" element={<Navigate to="/studio" replace />} />
        <Route
          path="/remote"
          element={
            <FirstVisitLoadingShell>
              <PresentationRemotePage />
            </FirstVisitLoadingShell>
          }
        />
        <Route path="/work-with-rushi" element={<StudioHomeRedirectPage />} />
        <Route path="/quote" element={<StudioHomeRedirectPage />} />
        <Route path="/quote-admin" element={<Navigate to="/studio" replace />} />
        <Route path="/document/:code" element={<StudioProjectRedirectPage />} />
        <Route path="/quote/:code" element={<StudioProjectRedirectPage />} />
        <Route path="/brochure/:code" element={<StudioProjectRedirectPage />} />
        <Route path="/studio/sample" element={<Navigate to="/studio" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
