import { Outlet, useLocation, useSearchParams } from "react-router-dom";
import Cursor from "./Cursor";
import SocialIcons from "./SocialIcons";
import PublicNavigation from "./PublicNavigation";
import PublicFooterBand from "./PublicFooterBand";
import FirstVisitLoadingShell from "./FirstVisitLoadingShell";
import "./styles/PublicExperience.css";

const PublicExperienceShell = () => {
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
  const showFooterBand = !isHome && !isDocumentRoute;

  if (isPrintMode || isScreenPresentationMode) {
    return <Outlet />;
  }

  return (
    <FirstVisitLoadingShell>
      <Cursor />
      <PublicNavigation />
      <SocialIcons />
      <div className={`public-experience${isHome ? " is-home" : ""}`}>
        <Outlet />
      </div>
      {showFooterBand ? <PublicFooterBand /> : null}
    </FirstVisitLoadingShell>
  );
};

export default PublicExperienceShell;
