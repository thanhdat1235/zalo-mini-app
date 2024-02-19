import React, { useImperativeHandle, useState } from "react";

import "./style.scss";
import Logo from "assets/images/logo.png";

export const globalLoadingRef = React.createRef<any>();

export const globalLoading = {
  show: () => {
    globalLoadingRef?.current?.show();
  },
  hide: () => {
    globalLoadingRef?.current?.hide();
  },
};

const GlobalLoading = React.forwardRef((__props, ref) => {
  const [visible, setVisible] = useState<boolean>(false);

  useImperativeHandle(ref, () => {
    return { show: show, hide: hide };
  });

  const show = () => {
    setVisible(true);
  };

  const hide = () => {
    setVisible(false);
  };

  return visible ? (
    <div className="overlay">
      <div className="overlay__inner">
        <div className="overlay__content">
          <span className="spinner"></span>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 p-1">
            <img src={Logo} className="object-cover" />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
});

export default GlobalLoading;
