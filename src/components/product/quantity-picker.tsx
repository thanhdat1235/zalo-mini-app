import React from "react";
import { TouchOpacity } from "zalo-ui";
import { Box, Icon, Text } from "zmp-ui";

type size = "small" | "medium";

export const QuantityPicker = ({
  value,
  onChange,
  size,
  limit,
  minimum,
}: {
  value: number;
  onChange: (quantity: number) => void;
  size: size;
  limit?: number;
  minimum?: number;
}) => {
  return (
    <Box flex className="items-center">
      <TouchOpacity
        disabled={Boolean(
          minimum !== undefined ? minimum >= value : value === 1
        )}
        onClick={() => {
          onChange(value - 1);
        }}
        className={`h-5 w-5 border-[#00000040] border rounded flex items-center justify-center ${
          size === "medium" && "h-7 w-7"
        } ${
          Boolean(minimum !== undefined ? minimum >= value : value === 1) &&
          "opacity-20"
        }`}
      >
        -
      </TouchOpacity>
      <Box flex justifyContent="center" alignItems="center" className="flex-1">
        <Text
          size="large"
          className={`text-[12px] mx-2 ${size === "medium" && "text-[14px]"}`}
        >
          {value}
        </Text>
      </Box>
      <TouchOpacity
        disabled={Boolean(limit && limit === value)}
        onClick={() => onChange(value + 1)}
        className={`h-5 w-5 border-[#00000040] border rounded flex items-center justify-center  ${
          size === "medium" && "h-7 w-7"
        } ${Boolean(limit && limit === value) && "opacity-20"}`}
      >
        <Icon icon="zi-plus" size={10} />
      </TouchOpacity>
    </Box>
  );
};
