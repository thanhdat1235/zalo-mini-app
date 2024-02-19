import React, { useState } from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Box, List, Page, Text, useNavigate } from "zmp-ui";

import privacyPolicy from "assets/images/privacy-policy.jpg";
import ProductDefaultImg from "assets/images/product-detail.png";
import userChevronRight from "assets/images/user-chevron-right.png";
import userCrown from "assets/images/user-crown.png";
import UserIcon from "assets/images/user-icon.png";
import userFAQ from "assets/images/user-question.png";
import userReferralCode from "assets/images/user-referral-code.png";
import userReferral from "assets/images/user-referral-icon.png";
import userStar from "assets/images/user-star-icon.png";
import BoxCancelIcon from "assets/svg/box-cancel.svg";
import CoinIcon from "assets/svg/coin.svg";
import GiftIcon from "assets/svg/gift.svg";
import OrderSuccessIcon from "assets/svg/order-success.svg";
import PackageIcon from "assets/svg/package.svg";
import ShippingIcon from "assets/svg/shipping.svg";
import WalletIcon from "assets/svg/wallet.svg";

import { HeaderThird } from "components/header/header-third";
import { PATH_NAME } from "constants/router";
import { OrderPaymentMethod, OrderStatus } from "models/orders";
import { Customer } from "models/user";
import { RootState } from "redux/store";
import { productService } from "services/product-service";
import { userService } from "services/user-service";
import { zaloService } from "services/zalo-service";
import { QueryKey } from "types/api";
import { formatCurrencyVND, getOldPriceProduct } from "utils/number";
import { TouchOpacity } from "zalo-ui";
import ProductItem from "components/product/product-item";

const REDIRECT_ZALO_OA = "REDIRECT_ZALO_OA";
interface OrderMenuProps {
  key: OrderStatus;
  title: string;
  icon: string;
  paymentMethod?: OrderPaymentMethod | null;
  amount: number;
}

const optionUsersBottom = [
  {
    title: "FAQs",
    path: `${PATH_NAME.USER_FAQS}`,
    icon: userFAQ,
  },
  {
    title: "Chính sách dịch vụ",
    path: `${PATH_NAME.POLICY_SERVICES}`,
    icon: privacyPolicy,
  },
  {
    title: "Tìm hiểu thêm về Mămmy Việt Nam",
    path: REDIRECT_ZALO_OA,
    icon: userStar,
  },
];

const UserPage = () => {
  const navigate = useNavigate();
  const user = useSelector<RootState, Customer>(
    (state) => state.userStore.user
  );

  const optionUsersTop = [
    {
      title: "Thông tin của bạn",
      path: `${PATH_NAME.USER}/${user.id}`,
      icon: UserIcon,
    },
    {
      title: "Gói thành viên",
      path: `${PATH_NAME.UPDATE_CROWN}/${user.id}`,
      icon: userCrown,
    },
    {
      title: "Mã giới thiệu",
      path: `${PATH_NAME.REFERRAL_CODE}/${user.id}`,
      icon: userReferralCode,
    },
    {
      title: "Người bạn đã giới thiệu thành công",
      path: `${PATH_NAME.LIST_REFERRAL}/${user.id}`,
      icon: userReferral,
    },
  ];

  const orderMenuItem: OrderMenuProps[] = [
    {
      key: OrderStatus.WAITING_CONFIRM,
      title: "Chờ xác nhận",
      icon: WalletIcon,
      paymentMethod: OrderPaymentMethod.GATEWAY,
      amount: 0,
    },
    {
      key: OrderStatus.WAITING_PICKUP,
      title: "Chờ lấy hàng",
      icon: PackageIcon,
      amount: 0,
    },
    {
      key: OrderStatus.SHIPPING,
      title: "Đang vận chuyển",
      icon: ShippingIcon,
      amount: 0,
    },
    {
      key: OrderStatus.SUCCESS,
      title: "Hoàn thành",
      icon: OrderSuccessIcon,
      amount: 0,
    },
    {
      key: OrderStatus.CANCELED,
      title: "Đơn đã hủy",
      icon: BoxCancelIcon,
      amount: 0,
    },
  ];

  const [orderMenu, setOrderMenu] = useState<OrderMenuProps[]>(orderMenuItem);

  const { data: allProductPaid } = useQuery(
    [QueryKey.PRODUCT_PAID],
    async () => await productService.getAllProductsPaid()
  );

  useQuery([QueryKey.TOTAL_ORDER], async () => {
    const totalOrders = await userService.getTotalOrder();
    const newOrderMenu = orderMenu;

    for (let i = 0; i < newOrderMenu.length; i++) {
      const menuItem = newOrderMenu[i];

      newOrderMenu[i] = {
        ...menuItem,
        amount: totalOrders[menuItem.key],
      };
    }
    setOrderMenu(newOrderMenu);
  });

  const handleClickLink = (path: string) => {
    if (path === REDIRECT_ZALO_OA) {
      zaloService.openChatScreen();
    } else {
      navigate(path);
    }
  };

  return (
    <Page className="relative flex-1 flex flex-col bg-background-primary">
      <HeaderThird title="Tài khoản" />
      <Box className="bg-background overflow-auto flex-1 z-20">
        <Box>
          <Box className="bg-primary px-4 pt-1 border-b border-background-primary">
            <Box
              className="bg-background rounded-t-lg flex items-center justify-between py-2 px-4"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Text className="font-bold text-primary text-sm">Mămmy xu</Text>
              <Box className="flex items-center">
                <img src={CoinIcon} className="mr-1 w-4 h-4 " />
                <Text className="font-bold text-sm text-text-black">
                  {user.coin || 0}
                </Text>
              </Box>
            </Box>
          </Box>
          <Box className="bg-background-primary px-4 pb-2">
            <TouchOpacity
              className="bg-background rounded-b-lg flex items-center justify-between py-2 px-4"
              onClick={() => navigate(PATH_NAME.VOUCHER_PAGE)}
            >
              <Box className="flex items-center">
                <Box className="p-[6px] mr-2 bg-[#9bd929] bg-opacity-20 rounded-full">
                  <img src={GiftIcon} className="w-4 h-4" />
                </Box>
                <Text className="text-text-black">Ưu đãi</Text>
              </Box>
              <Box>
                <img src={userChevronRight} className="w-4 h-4" />
              </Box>
            </TouchOpacity>
          </Box>
        </Box>
        <Box className="mt-5">
          <List className="mx-4">
            {optionUsersTop.map((optionUser, index) => (
              <TouchOpacity
                key={index}
                className="h-[56px] text-[14px] font-medium text-text-black tracking-[0.3px] leading-[21px] flex items-center justify-between"
              >
                <Link
                  to={optionUser.path}
                  className="flex items-center flex-row-reverse justify-end flex-[2] w-[100%]"
                >
                  {optionUser.title}
                  <img
                    src={optionUser.icon}
                    className="w-[40px] h-[40px] mr-3"
                  />
                </Link>
                <img
                  src={userChevronRight}
                  alt="User Arrow"
                  className="w-[16px] h-[16px]"
                />
              </TouchOpacity>
            ))}
          </List>
          <span className="block mx-4 h-[1px] bg-[#F3F4F6] mt-3"></span>
          <Box className="mx-4">
            <TouchOpacity
              onClick={() => navigate(PATH_NAME.USER_ORDER)}
              className="flex justify-between items-center pt-[16px]"
            >
              <Text className="text-[14px] font-[500] leading-[21px] text-text-black">
                Đơn hàng của bạn
              </Text>
              <img
                src={userChevronRight}
                alt=""
                className="w-[16px] h-[16px]"
              />
            </TouchOpacity>
            <Box className="flex justify-between items-center pt-[22px] pb-[38px] ">
              {orderMenu.map((orderMenuItem) => (
                <TouchOpacity
                  key={orderMenuItem.key}
                  className="flex flex-wrap flex-col-reverse items-center w-[74px]"
                  onClick={() =>
                    navigate(
                      `${PATH_NAME.USER_ORDER}?status=${orderMenuItem.key}`
                    )
                  }
                >
                  <Text className="h-[24px] text-[10px] font-[500] leading-[16px] text-center mt-[4px]">
                    {orderMenuItem.title}
                  </Text>
                  <Box className="relative">
                    <img
                      src={orderMenuItem.icon}
                      alt={orderMenuItem.title}
                      className="w-[24px] h-[24px] object-contain"
                    />
                    {orderMenuItem.amount > 0 && (
                      <span className="absolute top-[-5px] right-[-12.5px] px-1 py-[0.7px] text-text-color text-[8px] font-[700] bg-primary-color w-[15px] h-[15px] leading-[10px] rounded-full flex justify-center items-center">
                        {orderMenuItem.amount > 9 ? "9+" : orderMenuItem.amount}
                      </span>
                    )}
                  </Box>
                </TouchOpacity>
              ))}
            </Box>
          </Box>
          <span className="block mx-4 h-[1px] bg-[#F3F4F6]"></span>
          {allProductPaid && allProductPaid.length > 0 ? (
            <Box className="mx-4 py-4">
              <Box className="flex justify-between">
                <Text className="text-text-black">Mua lại</Text>
                <Box
                  className="flex items-center"
                  onClick={() => navigate(PATH_NAME.PRODUCT_REORDER)}
                >
                  <TouchOpacity className="text-xs text-gray mr-1">
                    Xem thêm
                  </TouchOpacity>
                  <img
                    src={userChevronRight}
                    alt="icon arrow left"
                    className="w-4 h-4"
                  />
                </Box>
              </Box>
              <Box className="overflow-auto scrollbar-hide mt-3">
                <Box className="grid grid-flow-col gap-2 grid-rows-1 justify-start snap-x">
                  {allProductPaid?.map((product) => (
                    <TouchOpacity
                      key={product.id}
                      className="w-[140px] bg-background-primary rounded-lg flex flex-col justify-items-start snap-start"
                      onClick={() =>
                        navigate(`${PATH_NAME.PRODUCT}/${product.id}`)
                      }
                    >
                      <Box className="flex items-center justify-center w-full overflow-hidden">
                        <img
                          src={product?.addyImageUrl || product?.image || ProductDefaultImg}
                          alt="product img"
                          className="block w-full h-[140px] object-cover"
                          onError={(e: any) => {
                            e.target.onerror = null;
                            e.target.src = ProductDefaultImg;
                          }}
                        />
                      </Box>
                      <Box className="flex flex-col items-center">
                        <Text className="px-[8px] text-center font-normal mt-2 text-[15px] leading-[17px] line-clamp-2">
                          {product.name || ""}
                        </Text>
                        <Box className="flex flex-row items-center">
                          <Text className="text-grey-color font-normal text-center text-[10px] line-through">
                            {formatCurrencyVND(
                              getOldPriceProduct(
                                product.oldPrice,
                                product.salePriceBackup
                              )
                            )}
                          </Text>
                          <Text className="font-normal text-primary-color text-center text-[15px] ml-[2px]">
                            {formatCurrencyVND(product.price || 0)}
                          </Text>
                        </Box>
                      </Box>
                    </TouchOpacity>
                  ))}
                </Box>
              </Box>
            </Box>
          ) : (
            <></>
          )}
          <span className="block mx-4 h-[1px] bg-[#F3F4F6]"></span>
          <List className="mx-4 pt-[7px] pb-4">
            {optionUsersBottom.map((option) => (
              <TouchOpacity
                className="h-[56px] text-[14px] font-medium text-text-black tracking-[0.3px] leading-[21px] flex items-center justify-between mb-[8px]"
                key={option.path}
              >
                <Box
                  onClick={() => handleClickLink(option.path)}
                  className="flex items-center flex-row-reverse flex-[1] justify-end"
                >
                  {option.title}
                  <img
                    src={option.icon}
                    className="w-[40px] h-[40px] mr-[16px] "
                  />
                </Box>
                <img
                  src={userChevronRight}
                  alt="User Arrow"
                  className="w-[16px] h-[16px]"
                />
              </TouchOpacity>
            ))}
          </List>
        </Box>
      </Box>
    </Page>
  );
};

export default UserPage;
