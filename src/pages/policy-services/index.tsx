import userChevronRight from "assets/images/user-chevron-right.png";
import HeaderSecond from "components/header/header-second";
import { PATH_NAME } from "constants/router";
import React from "react";
import { useNavigate } from "react-router-dom";
import { PageScrollView, TouchOpacity } from "zalo-ui";
import { Box } from "zmp-ui";

const policies = [
  {
    title: "Chính sách bảo mật",
    path: `${PATH_NAME.PRIVACY_POLICY}`,
  },
  {
    title: "Chính sách đổi trả",
    path: `${PATH_NAME.RETURN_POLICY}`,
  },
  {
    title: "Chính sách giao hàng",
    path: `${PATH_NAME.DELIVERY_POLICY}`,
  },
  {
    title: "Chính sách kiểm hàng",
    path: `${PATH_NAME.INSPECTION_POLICY}`,
  },
  {
    title: "Trách nhiệm giao nhận",
    path: `${PATH_NAME.RESPONSIBILITY}`,
  },
  {
    title: "Tuyên bố miễn trừ",
    path: `${PATH_NAME.DISCLAIMER}`,
  },
];

const PrivacyService = () => {
  const navigate = useNavigate();

  return (
    <PageScrollView
      renderHeader={
        <HeaderSecond showBackIcon={true} title="Chính sách dịch vụ" />
      }
    >
      <Box className="overflow-auto flex-1 px-6 bg-background">
        {policies.map((policy, index) => (
          <TouchOpacity
            key={index}
            className="h-[56px] w-full text-[14px] font-medium text-text-black tracking-[0.3px] border-b-solid border-b-background-primary flex items-center justify-between"
            onClick={() => navigate(policy.path)}
          >
            {policy.title}
            <img
              src={userChevronRight}
              alt="User Arrow"
              className="w-[16px] h-[16px] flex justify-end"
            />
          </TouchOpacity>
        ))}
      </Box>
    </PageScrollView>
  );
};

export default PrivacyService;
