import { Product } from "models/product";
import React from "react";
import { Box, Text } from "zmp-ui";

interface Gifts {
  gifts?: Product[];
}

const Gifts = ({ gifts }: Gifts) => {
  return (
    <Box className="p-4">
      <Text className="font-normal">Quà tặng: </Text>
      {gifts?.map((gift, index) => (
        <Box className="flex flex-row mt-1 justify-between" key={index}>
          <Box className="flex flex-row">
            <img
              src={gift.image}
              className="w-[50px] h-[50px] border-[0.1px] border-gray-second rounded-sm"
            />
            <Text className="font-normal ml-2">
              <span className="text-[12px] text-red-500 border-[0.5px] p-[2px] border-red-500 rounded-md">
                Quà tặng
              </span>{" "}
              {`${gift.name}`}
            </Text>
          </Box>
          <Text className="text-center font-normal">x1</Text>
        </Box>
      ))}
    </Box>
  );
};

export default Gifts;
