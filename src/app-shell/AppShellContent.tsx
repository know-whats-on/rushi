import { useCallback, useEffect, useRef, useState } from "react";
import { NavLink, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import FirstVisitLoadingShell from "../components/FirstVisitLoadingShell";
import GuestLecturerAdminPage from "./pages/GuestLecturerAdminPage";
import PresentationRemotePage from "../pages/PresentationRemotePage";
import PublicDocumentPage from "../pages/PublicDocumentPage";
import StudioBriefPage from "../pages/StudioBriefPage";
import StudioGuestLecturerPage from "../pages/StudioGuestLecturerPage";
import StudioLibraryPage from "../pages/StudioLibraryPage";
import type { RemoteSessionSnapshot } from "./lib/remoteSession";
import { isNativeStudioApp } from "./lib/nativeBridge";
import { remoteWidgetSetup } from "./lib/remoteWidgetSetup";
import AboutPage from "./pages/AboutPage";
import QrPage from "./pages/QrPage";
import RemoteHomePage from "./pages/RemoteHomePage";
import RemoteWidgetSetupPage from "./pages/RemoteWidgetSetupPage";
import "./app-shell.css";

const REMOTE_HREF = "/remote";

const AppShellContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mainRef = useRef<HTMLElement | null>(null);
  const [remoteSessionSnapshot, setRemoteSessionSnapshot] =
    useState<RemoteSessionSnapshot | null>(null);
  const isImmersiveSurface =
    location.pathname === "/studio" ||
    location.pathname.startsWith("/studio/") ||
    location.pathname === "/remote" ||
    location.pathname.startsWith("/remote/") ||
    location.pathname === "/qr" ||
    location.pathname === "/about" ||
    location.pathname === "/remote-widget";
  const showsNativeWidgetRoute = isNativeStudioApp();

  const consumePendingRemoteLaunch = useCallback(async () => {
    if (!isNativeStudioApp()) {
      return;
    }

    try {
      const pendingLaunch = await remoteWidgetSetup.consumePendingRemoteLaunch();
      if (!pendingLaunch?.routePath) {
        return;
      }

      setRemoteSessionSnapshot(null);
      navigate(pendingLaunch.routePath);
    } catch {
      // The fallback path is best-effort. Ignore launch handoff failures here.
    }
  }, [navigate]);

  useEffect(() => {
    const mainNode = mainRef.current;

    if (!mainNode) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      mainNode.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [location.pathname]);

  useEffect(() => {
    if (!isNativeStudioApp()) {
      return;
    }

    void consumePendingRemoteLaunch();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void consumePendingRemoteLaunch();
      }
    };
    const handleFocus = () => {
      void consumePendingRemoteLaunch();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [consumePendingRemoteLaunch]);

  return (
    <div className="studio-app-shell">
      <div className="studio-app-chrome">
        <main
          ref={mainRef}
          className={`studio-app-main${
            isImmersiveSurface
              ? " studio-app-main--immersive"
              : " studio-app-main--standard"
          }`}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/studio" replace />} />
            <Route
              path="/studio"
              element={
                <FirstVisitLoadingShell>
                  <StudioLibraryPage portfolioHref="/about" studioHref="/studio" />
                </FirstVisitLoadingShell>
              }
            />
            <Route
              path="/studio/brief"
              element={
                <FirstVisitLoadingShell>
                  <StudioBriefPage portfolioHref="/about" studioHref="/studio" />
                </FirstVisitLoadingShell>
              }
            />
            <Route
              path="/studio/guest-lecturers"
              element={
                <StudioGuestLecturerPage portfolioHref="/about" studioHref="/studio" />
              }
            />
            <Route
              path="/studio/project/:code"
              element={<PublicDocumentPage portfolioHref="/about" studioHref="/studio" />}
            />
            <Route
              path="/guest-lecturers"
              element={<GuestLecturerAdminPage />}
            />
            <Route
              path="/remote"
              element={
                <FirstVisitLoadingShell>
                  <RemoteHomePage
                    remoteSessionSnapshot={remoteSessionSnapshot}
                    onRemoteSessionSnapshotChange={setRemoteSessionSnapshot}
                  />
                </FirstVisitLoadingShell>
              }
            />
            <Route
              path="/remote/infs5700"
              element={
                <FirstVisitLoadingShell>
                  <PresentationRemotePage
                    fixedTarget={{
                      code: "INFS5700",
                      sessionId: "PUBLIC",
                    }}
                    remoteSessionSnapshot={remoteSessionSnapshot}
                    onRemoteSessionSnapshotChange={setRemoteSessionSnapshot}
                  />
                </FirstVisitLoadingShell>
              }
            />
            <Route
              path="/remote/rheempresso"
              element={
                <FirstVisitLoadingShell>
                  <PresentationRemotePage
                    fixedTarget={{
                      code: "RHEEMPRESSO",
                      sessionId: "PUBLIC",
                    }}
                    remoteSessionSnapshot={remoteSessionSnapshot}
                    onRemoteSessionSnapshotChange={setRemoteSessionSnapshot}
                  />
                </FirstVisitLoadingShell>
              }
            />
            <Route path="/qr" element={<QrPage />} />
            <Route path="/remote-widget" element={<RemoteWidgetSetupPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/studio" replace />} />
          </Routes>
        </main>

        <nav className="studio-app-nav" aria-label="App navigation">
          <NavLink
            to="/studio"
            className={({ isActive }) =>
              `studio-app-nav-link${isActive ? " is-active" : ""}`
            }
          >
            Studio
          </NavLink>
          <NavLink
            to={REMOTE_HREF}
            className={({ isActive }) =>
              `studio-app-nav-link${isActive ? " is-active" : ""}`
            }
          >
            Remote
          </NavLink>
          <NavLink
            to="/guest-lecturers"
            className={({ isActive }) =>
              `studio-app-nav-link${isActive ? " is-active" : ""}`
            }
          >
            Guests
          </NavLink>
          <NavLink
            to="/qr"
            className={({ isActive }) =>
              `studio-app-nav-link${isActive ? " is-active" : ""}`
            }
          >
            QR
          </NavLink>
          {showsNativeWidgetRoute ? (
            <NavLink
              to="/remote-widget"
              className={({ isActive }) =>
                `studio-app-nav-link${isActive ? " is-active" : ""}`
              }
            >
              Widget
            </NavLink>
          ) : null}
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `studio-app-nav-link${isActive ? " is-active" : ""}`
            }
          >
            About
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default AppShellContent;
