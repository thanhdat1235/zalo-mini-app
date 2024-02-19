import React, { FC } from "react";
import { Box, Text } from "zmp-ui";

const ListItem: FC<{ icon: string; value: string }> = ({ icon, value }) => {
  return (
    <Box className="flex items-center my-4">
      <img src={icon} alt="icon check" className="h-4 w-4" />
      <Text className="ml-4 text-[16px]">{value}</Text>
    </Box>
  );
};

export default ListItem;
