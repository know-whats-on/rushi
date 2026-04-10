import { lazy, Suspense } from "react";
import "../App.css";

const CharacterModel = lazy(() => import("../components/Character"));
const MainContainer = lazy(() => import("../components/MainContainer"));

const PortfolioHome = () => {
  return (
    <Suspense fallback={null}>
      <MainContainer>
        <Suspense fallback={null}>
          <CharacterModel />
        </Suspense>
      </MainContainer>
    </Suspense>
  );
};

export default PortfolioHome;
