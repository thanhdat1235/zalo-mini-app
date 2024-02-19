import React, { forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Header, Icon, Input } from "zmp-ui";

import SearchIcon from "assets/svg/search.svg";
import { PATH_NAME } from "constants/router";

interface HeaderSearchProps {
  showBackIcon?: boolean;
  autoFocus?: boolean;
  onSearch?(value: string): void;
}

const HeaderSearch = (
  { autoFocus, showBackIcon, onSearch }: HeaderSearchProps,
  ref,
) => {
  const navigate = useNavigate();

  return (
    <Header
      id="header-custom"
      className="app-header h-header-search no-border flex items-center bg-primary p-1"
      showBackIcon={false}
      title={
        (
          <Box className="flex items-center">
            <Box
              className="w-10 h-10 flex"
              onClick={() => {
                if (showBackIcon) navigate(-1);
                else navigate(PATH_NAME.HOME);
              }}
            >
              <Icon
                icon={`${showBackIcon ? "zi-chevron-left" : "zi-home"}`}
                className="text-white m-auto"
                size={30}
              />
            </Box>

            <Box
              className="bg-background flex items-center rounded-full border border-gray/[.2] ml-1 pl-4 pr-6 w-[50%]"
              onClick={() => navigate(PATH_NAME.SEARCH)}
            >
              <img src={SearchIcon} className="w-4 object-contain" />
              <input
                ref={ref}
                autoFocus={autoFocus}
                onChange={(e) => {
                  if (onSearch) onSearch(e.target.value);
                }}
                placeholder="Tìm nhanh sản phẩm"
                className="rounded-full text-sm pl-3 outline-none border-none bg-transparent w-[100%] h-[30px]"
              />
            </Box>
          </Box>
        ) as unknown as string
      }
    />
  );
};

export default forwardRef(HeaderSearch);
