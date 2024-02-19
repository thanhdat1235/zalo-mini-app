import React, { FC } from "react";
import { Box, Header, Text } from "zmp-ui";
// import { useRecoilValueLoadable } from "recoil";
// import { userState } from "state";
import logo from "assets/images/logo.jpg";
import { getConfig } from "utils/config";
import { useNavigate } from "react-router-dom";
import { PATH_NAME } from "constants/router";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { Customer } from "models/user";

interface HeaderCustomProps {
  title: string;
}
export const HeaderThird = ({ title }: HeaderCustomProps) => {
  const navigate = useNavigate();
  const user = useSelector<RootState, Customer>(
    (state) => state.userStore.user,
  );

  return (
    <Header
      id="header-custom"
      className="app-header no-border flex items-center h-header bg-primary text-white"
      showBackIcon={false}
      title={
        (
          <Box
            flex
            alignItems="center"
            alignContent="center"
            className="space-x-2"
          >
            <Box>
              <img
                className="w-8 h-8 rounded-full"
                src={
                  user.avatar || getConfig((c) => c.template.headerLogo) || logo
                }
                onError={(e: any) => {
                  e.target.onerror = null;
                  e.target.src = logo;
                }}
                onClick={() => navigate(PATH_NAME.HOME)}
              />
            </Box>
            <Box>
              <Text className="font-bold text-sm">{user.fullName}</Text>
              <Text className="text-xs">{user.phoneNumber}</Text>
            </Box>
          </Box>
        ) as unknown as string
      }
    />
  );
};
