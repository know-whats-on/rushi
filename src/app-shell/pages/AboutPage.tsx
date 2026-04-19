import FirstVisitLoadingShell from "../../components/FirstVisitLoadingShell";
import PortfolioHome from "../../pages/PortfolioHome";
const AboutPage = () => (
  <div className="studio-app-about-home">
    <FirstVisitLoadingShell>
      <PortfolioHome />
    </FirstVisitLoadingShell>
  </div>
);

export default AboutPage;
