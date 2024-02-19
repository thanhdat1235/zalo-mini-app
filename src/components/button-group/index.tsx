import React, { useEffect, useState } from "react";
import { Box } from "zmp-ui";
import IconClose from "assets/images/icon-close.png";
import IconChat from "assets/images/chat.png";
import IconCall from "assets/images/call.png";
import { zaloService } from "services/zalo-service";
import config from "config";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "redux/store";
import { Customer } from "models/user";
import Logo from "assets/images/logo.png";
import { setUserInfo } from "redux/slices/user-slice";
import { TouchOpacity } from "zalo-ui";

type DisplayIconType = {
  isShowIconChat: boolean;
  isShowIconCall: boolean;
  isShowIconFollow: boolean;
};
const ButtonGroup = () => {
  const [isShowIcon, setIsShowIcon] = useState<DisplayIconType>({
    isShowIconChat: true,
    isShowIconCall: true,
    isShowIconFollow: true,
  });

  const dispatch = useDispatch<AppDispatch>();
  const userInfo = useSelector<RootState, Customer>(
    (state) => state.userStore.user,
  );

  useEffect(() => {
    if (Object.keys(userInfo).length > 0 && userInfo.isFollowOA) {
      setIsShowIcon({
        ...isShowIcon,
        isShowIconFollow: Boolean(!userInfo.isFollowOA),
      });
    }
  }, [userInfo?.isFollowOA]);

  const handleOpenChatScreen = async () => {
    await zaloService.openChatScreen();
  };

  const handleCallHotLine = async () => {
    window.open(`tel:${config.VITE_HOTLINE}`);
  };

  const handleChatCloseClick = (e: React.MouseEvent) => {
    setIsShowIcon({ ...isShowIcon, isShowIconChat: false });
    e.stopPropagation();
  };

  const handleCallCloseClick = (e: React.MouseEvent) => {
    setIsShowIcon({ ...isShowIcon, isShowIconCall: false });
    e.stopPropagation();
  };

  const handleFollowCloseClick = (e: React.MouseEvent) => {
    setIsShowIcon({ ...isShowIcon, isShowIconFollow: false });
    e.stopPropagation();
  };

  const handleFollowOA = async () => {
    try {
      const zaloRes = await zaloService.followZaloOA();
      dispatch(setUserInfo(zaloRes));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box className="z-[2] fixed right-3 bottom-[65px] ">
      {isShowIcon.isShowIconFollow && (
        <TouchOpacity
          className={`relative flex justify-center items-center w-[46px] h-[46px] rounded-[50%] border-[1px] border-primary bg-background-icon mb-2`}
          onClick={handleFollowOA}
        >
          <img src={Logo} className="w-[26px] h-[25px]" />
          <Box
            onClick={handleFollowCloseClick}
            className="absolute top-[-2px] right-[-3px] flex justify-center items-center bg-background-icon rounded-[50%]"
          >
            <img src={IconClose} className="w-[11px] h-[11px]" />
          </Box>
        </TouchOpacity>
      )}
      {isShowIcon.isShowIconChat && (
        <TouchOpacity
          className={`relative flex justify-center items-center w-[46px] h-[46px] rounded-[50%] border-[1px] border-primary bg-background-icon animate-fade-in mb-2`}
          onClick={handleOpenChatScreen}
        >
          <img src={IconChat} className="w-[26px] h-[25px]" />
          <Box
            onClick={handleChatCloseClick}
            className="absolute top-[-2px] right-[-3px] flex justify-center items-center bg-background-icon rounded-[50%]"
          >
            <img src={IconClose} className="w-[11px] h-[11px]" />
          </Box>
        </TouchOpacity>
      )}
      {isShowIcon.isShowIconCall && (
        <TouchOpacity
          className={`relative flex justify-center items-center w-[46px] h-[46px] rounded-[50%] border-[1px] border-primary bg-background-icon animate-phone-shake`}
          onClick={handleCallHotLine}
        >
          <img src={IconCall} className="w-[26px] h-[25px]" />
          <Box
            onClick={handleCallCloseClick}
            className="absolute top-[-2px] right-[-3px] flex justify-center items-center bg-background-icon rounded-[50%]"
          >
            <img src={IconClose} className="w-[11px] h-[11px]" />
          </Box>
        </TouchOpacity>
      )}
    </Box>
  );
};

export default ButtonGroup;
