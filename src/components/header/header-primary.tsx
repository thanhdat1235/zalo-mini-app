import React from "react";
import { Box, Header, Text } from "zmp-ui";
// import { useRecoilValueLoadable } from "recoil";
// import { userState } from "state";
import logo from "assets/images/logo.jpg";
import { PATH_NAME } from "constants/router";
import { useNavigate } from "react-router-dom";
import { getConfig } from "utils/config";

interface HeaderCustomProps {
  title: string;
  isClickSearch?: boolean;
}
export const HeaderPrimary = ({ title, isClickSearch }: HeaderCustomProps) => {
  const navigate = useNavigate();

  const handleNavigateSearch = () => {
    if (isClickSearch) {
      navigate(PATH_NAME.SEARCH);
    }
  };

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
            justifyContent="space-between"
            textAlign="center"
            alignContent="center"
            className="space-x-2"
          >
            <img
              className="w-8 h-8 rounded-lg"
              src={getConfig((c) => c.template.headerLogo) || logo}
              onClick={() => navigate(PATH_NAME.HOME)}
            />
            <Text.Title
              size="normal"
              className="text-center font-bold"
              onClick={handleNavigateSearch}
            >
              {title}
            </Text.Title>
            <Box className="w-8 h-8"></Box>
          </Box>
        ) as unknown as string
      }
    />
  );
};
