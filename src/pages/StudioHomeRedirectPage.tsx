import { Navigate, useLocation } from "react-router-dom";

const StudioHomeRedirectPage = () => {
  const location = useLocation();

  return (
    <Navigate
      replace
      to={{
        pathname: "/studio",
        search: location.search,
        hash: location.hash,
      }}
    />
  );
};

export default StudioHomeRedirectPage;
