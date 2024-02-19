import React from "react";
import { Header } from "zmp-ui";

interface AppHeaderProps {
  title: string;
  showBackIcon: boolean;
  onBack?(): void;
  className?: string;
}
const HeaderSecond = (props: AppHeaderProps) => {
  return (
    <Header
      id="header__main-el"
      className={`sticky top-0 bg-white-color h-header font-bold bg-primary ${props.className}`}
      title={props.title}
      showBackIcon={props.showBackIcon}
      textColor="#fff"
      onBackClick={props?.onBack}
    />
  );
};

export default HeaderSecond;
