import AccountActiveIcon from "assets/svg/bottom-menu/account-active.svg";
import AccountIcon from "assets/svg/bottom-menu/account.svg";
import AllProductActiveIcon from "assets/svg/bottom-menu/all-product-active.svg";
import AllProductIcon from "assets/svg/bottom-menu/all-product.svg";
import HomeActiveIcon from "assets/svg/bottom-menu/home-active.svg";
import HomeIcon from "assets/svg/bottom-menu/home.svg";
import TicketActiveIcon from "assets/svg/bottom-menu/ticket-active.svg";
import TicketIcon from "assets/svg/bottom-menu/ticket.svg";
import { PATH_NAME } from "constants/router";
import React, { FC, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { BottomNavigation as BottomNavigationZmpUI } from "zmp-ui";
import { useVirtualKeyboardVisible } from "../hooks/useVirtualKeyboardVisible";
import { MenuItem } from "../types/menu";
import CartIcon from "./cart-icon";

const tabs: Record<string, MenuItem> = {
  [`${PATH_NAME.HOME}`]: {
    label: "Trang chủ",
    icon: <img src={HomeIcon} />,
    activeIcon: <img src={HomeActiveIcon} />,
  },
  [`${PATH_NAME.PRODUCT}`]: {
    label: "Sản phẩm",
    icon: <img src={AllProductIcon} />,
    activeIcon: <img src={AllProductActiveIcon} />,
  },
  [`${PATH_NAME.COMBO_ADVANTAGE_PACKS}`]: {
    label: "Ưu đãi",
    icon: <img src={TicketIcon} />,
    activeIcon: <img src={TicketActiveIcon} />,
  },
  [`${PATH_NAME.CART}`]: {
    label: "Giỏ hàng",
    icon: <CartIcon />,
    activeIcon: <CartIcon isActive />,
  },
  [`${PATH_NAME.USER}`]: {
    label: "Cá nhân",
    icon: <img src={AccountIcon} />,
    activeIcon: <img src={AccountActiveIcon} />,
  },
};

export type TabKeys = keyof typeof tabs;

export const NO_BOTTOM_NAVIGATION_PAGES: string[] = [
  PATH_NAME.SEARCH,
  PATH_NAME.CATEGORY,
];

export const SHOW_BOTTOM_NAVIGATION_PAGES: string[] = [
  PATH_NAME.HOME,
  PATH_NAME.PRODUCT,
  PATH_NAME.COMBO_ADVANTAGE_PACKS,
  PATH_NAME.CART,
  PATH_NAME.USER,
];

export const BottomNavigation: FC = () => {
  const [activeTab, setActiveTab] = useState<TabKeys>("/");
  const keyboardVisible = useVirtualKeyboardVisible();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    handleActive();
  }, [location.pathname]);

  const handleActive = () => {
    setActiveTab(location.pathname);
  };

  const showBottomNav = useMemo(() => {
    return SHOW_BOTTOM_NAVIGATION_PAGES.includes(location.pathname);
  }, [location]);

  if (showBottomNav || keyboardVisible) {
    return (
      <BottomNavigationZmpUI
        id="footer"
        activeKey={activeTab}
        onChange={(key: TabKeys) => setActiveTab(key)}
        className="z-50 bottom-navigation"
      >
        {Object.keys(tabs).map((path: TabKeys) => (
          <BottomNavigationZmpUI.Item
            className="justify-center"
            key={path}
            label={tabs[path].label}
            icon={tabs[path].icon}
            activeIcon={tabs[path].activeIcon}
            onClick={() => navigate(path)}
          />
        ))}
      </BottomNavigationZmpUI>
    );
  }

  return <></>;
};
