import { BrowserRouter } from "react-router-dom";
import AppShellContent from "./AppShellContent";

const AppShell = () => {
  const basename =
    typeof window !== "undefined" &&
    window.location.pathname.endsWith("/app-shell.html")
      ? "/app-shell.html"
      : "/app";

  return (
    <BrowserRouter basename={basename}>
      <AppShellContent />
    </BrowserRouter>
  );
};

export default AppShell;
