import { useLocation } from "react-router-dom";

const useURLParams = (): Record<string, string> => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const params: Record<string, string> = {};

  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
};

export default useURLParams;
