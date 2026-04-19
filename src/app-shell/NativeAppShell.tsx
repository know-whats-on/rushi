import { HashRouter } from "react-router-dom";
import AppShellContent from "./AppShellContent";

const NativeAppShell = () => (
  <HashRouter>
    <AppShellContent />
  </HashRouter>
);

export default NativeAppShell;
