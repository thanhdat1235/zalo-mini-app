import React from "react";
import { Box } from "zmp-ui";

interface StepProps {
  information?: boolean;
  paymentMethod?: boolean;
  finish?: boolean;
}

const Step = ({ information, paymentMethod, finish }: StepProps) => {
  return (
    <Box className="mx-8 my-4 pb-4">
      <Box className="flex pb-3">
        <Box className="flex-1"></Box>

        <Box className="flex-1">
          <Box
            className={`w-10 h-10 justify-center bg-background-gray-second ${
              information && "bg-primary"
            } mx-auto rounded-full text-lg text-white flex items-center`}
          >
            <span className="text-center text-background-primary font-bold text-[18px]">
              1
            </span>
          </Box>
        </Box>

        <Box className="w-1/2 flex items-center justify-center">
          <Box className="w-full bg-gray-300 rounded items-center justify-center flex-1">
            <Box className="bg-gray-second text-xs leading-none py-[0.5px] text-center text-gray-900 w-full"></Box>
          </Box>
        </Box>

        <Box className="flex-1">
          <Box
            className={`w-10 h-10 justify-center bg-background-gray-second ${
              paymentMethod && "bg-primary"
            } mx-auto rounded-full text-lg text-white flex items-center`}
          >
            <span className="text-center text-background-primary font-bold text-[18px]">
              2
            </span>
          </Box>
        </Box>

        <Box className="w-1/2 flex items-center justify-center">
          <Box className="w-full bg-gray-300 rounded items-center justify-center flex-1">
            <Box className="bg-gray-second text-xs leading-none py-[0.5px] text-center text-gray-900 w-full"></Box>
          </Box>
        </Box>

        <Box className="flex-1">
          <Box
            className={`w-10 h-10 justify-center bg-background-gray-second ${
              finish && "bg-primary"
            } mx-auto rounded-full text-lg text-white flex items-center`}
          >
            <span className="text-center text-background-primary font-bold text-[18px]">
              3
            </span>
          </Box>
        </Box>
        <Box className="flex-1"></Box>
      </Box>
      <Box className="flex text-xs ">
        <Box className="w-1/2 text-left ml-[-10px]">Thông tin</Box>

        <Box className="w-1/2 text-center">Phương thức thanh toán</Box>

        <Box className="w-1/2 text-right mr-[-10px]">Hoàn thành</Box>
      </Box>
    </Box>
  );
};

export default Step;
