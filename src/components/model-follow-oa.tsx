import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { TouchOpacity } from "zalo-ui";
import { Box } from "zmp-ui";

import TapImg from "assets/images/tap.png";
import { Customer } from "models/user";
import { setIsVisibleModelFollowOA } from "redux/slices/home-config-slice";
import { setUserInfo } from "redux/slices/user-slice";
import { AppDispatch, RootState } from "redux/store";
import { systemConfigService } from "services/system-config-service";
import { zaloService } from "services/zalo-service";
import { QueryKey } from "types/api";

const ModelFollowOA = () => {
  const dispatch = useDispatch<AppDispatch>();

  const followOaState = useRef<boolean>(false);

  const user = useSelector<RootState, Customer>(
    (state) => state.userStore.user
  );

  const isShowFollowZaloOA = useSelector<RootState, boolean>(
    (state) => state.homeConfigStore.isShowFollowZaloOA
  );

  const { data: systemConfigData, isFetching: isFetchingSystemConfigData } =
    useQuery(QueryKey.SYSTEM_CONFIG, systemConfigService.getAllConfig);

  useEffect(() => {
    if (
      Object.keys(user).length > 0 &&
      !user.isFollowOA &&
      !isFetchingSystemConfigData &&
      systemConfigData &&
      Object.keys(systemConfigData).length > 0 &&
      systemConfigData?.followOaBanner &&
      !isShowFollowZaloOA
    ) {
      setTimeout(() => {
        dispatch(setIsVisibleModelFollowOA(true));
      }, 1000);
    }
  }, [user?.isFollowOA, isFetchingSystemConfigData]);

  const handleFollowZaloOA = async () => {
    try {
      dispatch(setIsVisibleModelFollowOA(false));
      const zaloRes = await zaloService.followZaloOA();
      dispatch(setUserInfo(zaloRes));
    } catch (err) {
      console.log(err);
    }
  };

  return isShowFollowZaloOA
    ? createPortal(
        <>
          <Box className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center flex-col bg-black/[.9] z-[999]">
            <Box
              className="mx-2 rounded-lg overflow-hidden"
              onClick={handleFollowZaloOA}
            >
              <img
                src={systemConfigData?.followOaBanner}
                className="object-contain h-full w-full"
              />
            </Box>
            <Box className="relative">
              <TouchOpacity
                className="button mt-5 text-white"
                onClick={handleFollowZaloOA}
              >
                Follow Zalo OA
              </TouchOpacity>
              <Box className="absolute right-0 top-full click">
                <img src={TapImg} className="w-10 h-10" />
              </Box>
            </Box>
            <TouchOpacity
              className="absolute bottom-6 text-sm pt-2 px-4 text-white"
              onClick={() => {
                dispatch(setIsVisibleModelFollowOA(false));
              }}
            >
              Bỏ qua
            </TouchOpacity>
          </Box>
        </>,
        document.body
      )
    : null;
};

export default ModelFollowOA;
