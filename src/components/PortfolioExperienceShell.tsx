import { PropsWithChildren } from "react";
import Cursor from "./Cursor";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import FirstVisitLoadingShell from "./FirstVisitLoadingShell";

const PortfolioExperienceShell = ({ children }: PropsWithChildren) => {
  return (
    <FirstVisitLoadingShell>
      <Cursor />
      <Navbar />
      <SocialIcons />
      {children}
    </FirstVisitLoadingShell>
  );
};

export default PortfolioExperienceShell;
