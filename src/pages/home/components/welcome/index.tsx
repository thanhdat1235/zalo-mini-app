import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Avatar, Box, Text } from "zmp-ui";

import bgMammy from "assets/images/bg-mammy.png";
import UserIcon from "assets/images/user-icon.png";
import zaloImg from "assets/images/zalo.jpg";
import { Customer } from "models/user";
import { RootState } from "redux/store";

interface WelcomeProps {
  dailyQuestion?: string;
}

const Welcome = (props: WelcomeProps) => {
  const user = useSelector<RootState, Customer>(
    (state) => state.userStore.user,
  );

  const [isShowPreview, setIsShowPreview] = useState(false);

  const getFirstName = (fullName: string) => {
    const fullNameArr = fullName?.split(" ");

    return fullNameArr && fullNameArr?.length > 0
      ? fullNameArr[fullNameArr.length - 1]
      : "";
  };

  return (
    <Box className="flex flex-row bg-background mt-2 px-2 py-2">
      <Box className="w-[50px] h-[50px] rounded-full flex items-center justify-center over overflow-hidden shadow-xl">
        <img
          src={user.avatar || UserIcon}
          onClick={() => setIsShowPreview(!isShowPreview)}
          onError={(e: any) => {
            e.target.onerror = null;
            e.target.src = UserIcon;
          }}
          className="w-full object-contain"
        />
      </Box>
      <Box className="ml-2 flex flex-col justify-center">
        <Text className="font-bold">{`Chào ${getFirstName(
          user.fullName || "",
        )}!`}</Text>
        <Text className="font-light text-[12px]">
          {props.dailyQuestion || ""}
        </Text>
      </Box>
    </Box>
  );
};

export default Welcome;
