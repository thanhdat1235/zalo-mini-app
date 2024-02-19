import { useEffect } from "react";
import { matchStatusBarColor } from "../utils/device";

const useMatchStatusTextColor = (visible?: boolean) => {
  useEffect(() => {
    matchStatusBarColor(visible ?? false);
  }, [visible]);
};

export default useMatchStatusTextColor;
