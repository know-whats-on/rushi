import { Navigate, useLocation, useParams } from "react-router-dom";

const StudioProjectRedirectPage = () => {
  const { code = "" } = useParams();
  const location = useLocation();

  return (
    <Navigate
      replace
      to={{
        pathname: `/studio/project/${encodeURIComponent(code)}`,
        search: location.search,
        hash: location.hash,
      }}
    />
  );
};

export default StudioProjectRedirectPage;
