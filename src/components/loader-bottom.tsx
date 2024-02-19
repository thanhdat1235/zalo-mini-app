import Spinner from "assets/gif/spinner.gif";
import React from "react";
import { Box } from "zmp-ui";

const LoaderBottom = () => {
  return (
    <Box className="flex items-center w-full mb-8">
      <img src={Spinner} alt="" className=" w-[40px] h-[40px] mx-[auto] z-10" />
    </Box>
  );
};
export default LoaderBottom;
