import { PropsWithChildren } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { LoadingProvider } from "../context/LoadingProvider";

const FirstVisitLoadingShell = ({ children }: PropsWithChildren) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isPrintMode = searchParams.get("print") === "1";

  return (
    <LoadingProvider key={location.pathname} skip={isPrintMode}>
      {children}
    </LoadingProvider>
  );
};

export default FirstVisitLoadingShell;
