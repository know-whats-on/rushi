import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PortfolioExperienceShell from "./components/PortfolioExperienceShell";
import PublicExperienceShell from "./components/PublicExperienceShell";

const PortfolioHome = lazy(() => import("./pages/PortfolioHome"));
const PublicDocumentPage = lazy(() => import("./pages/PublicDocumentPage"));
const PresentationRemotePage = lazy(() => import("./pages/PresentationRemotePage"));
const StudioBriefPage = lazy(() => import("./pages/StudioBriefPage"));
const StudioGuestLecturerPage = lazy(
  () => import("./pages/StudioGuestLecturerPage")
);
const StudioHomeRedirectPage = lazy(() => import("./pages/StudioHomeRedirectPage"));
const StudioLibraryPage = lazy(() => import("./pages/StudioLibraryPage"));
const StudioProjectRedirectPage = lazy(
  () => import("./pages/StudioProjectRedirectPage")
);

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
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
              <PublicExperienceShell>
                <StudioLibraryPage />
              </PublicExperienceShell>
            }
          />
          <Route
            path="/studio/brief"
            element={
              <PublicExperienceShell>
                <StudioBriefPage />
              </PublicExperienceShell>
            }
          />
          <Route
            path="/studio/guest-lecturers"
            element={
              <PublicExperienceShell>
                <StudioGuestLecturerPage />
              </PublicExperienceShell>
            }
          />
          <Route element={<PublicExperienceShell />}>
            <Route path="/studio/project/:code" element={<PublicDocumentPage />} />
          </Route>
          <Route
            path="/studio/create"
            element={<Navigate to="/studio" replace />}
          />
          <Route
            path="/studio/project/sample"
            element={<Navigate to="/studio" replace />}
          />
          <Route
            path="/remote"
            element={
              <PublicExperienceShell>
                <PresentationRemotePage />
              </PublicExperienceShell>
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
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
