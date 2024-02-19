import { useLocation, useNavigate } from "react-router-dom";

const useAddURLParams = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const addParamsToURL = (params: Record<string, string>) => {
    const searchParams = new URLSearchParams(location.search);
    Object.entries(params).forEach(([key, value]) => {
      searchParams.set(key, value);
    });
    navigate(`?${searchParams.toString()}`);
  };

  return addParamsToURL;
};

export default useAddURLParams;
