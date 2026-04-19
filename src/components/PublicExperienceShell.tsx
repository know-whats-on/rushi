import type { PropsWithChildren } from "react";
import { Outlet, useLocation, useSearchParams } from "react-router-dom";
import Cursor from "./Cursor";
import SocialIcons from "./SocialIcons";
import PublicNavigation from "./PublicNavigation";
import PublicFooterBand from "./PublicFooterBand";
import FirstVisitLoadingShell from "./FirstVisitLoadingShell";
import "./styles/PublicExperience.css";

const PublicExperienceShell = ({ children }: PropsWithChildren) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isDocumentRoute =
    location.pathname.startsWith("/studio/project/") ||
    location.pathname.startsWith("/document/") ||
    location.pathname.startsWith("/quote/") ||
    location.pathname.startsWith("/brochure/");
  const isPrintMode = isDocumentRoute && searchParams.get("print") === "1";
  const isScreenPresentationMode =
    location.pathname.startsWith("/studio/project/") &&
    searchParams.get("mode")?.trim().toLowerCase() === "screen";
  const isHome = location.pathname === "/";
  const isGuestLecturerPublicRoute =
    location.pathname === "/studio/guest-lecturers";
  const isImmersivePublicRoute =
    location.pathname === "/studio" ||
    location.pathname === "/studio/brief" ||
    location.pathname === "/remote" ||
    location.pathname.startsWith("/remote/");
  const showFooterBand =
    !isHome &&
    !isDocumentRoute &&
    !isImmersivePublicRoute &&
    !isGuestLecturerPublicRoute;

  if (isPrintMode || isScreenPresentationMode) {
    return children ? <>{children}</> : <Outlet />;
  }

  const shellContent = (
    <>
      <Cursor />
      <PublicNavigation />
      <SocialIcons />
      <div className={`public-experience${isHome ? " is-home" : ""}`}>
        {children ? children : <Outlet />}
      </div>
      {showFooterBand ? <PublicFooterBand /> : null}
    </>
  );

  if (isImmersivePublicRoute) {
    return <FirstVisitLoadingShell>{shellContent}</FirstVisitLoadingShell>;
  }

  return shellContent;
};

export default PublicExperienceShell;
