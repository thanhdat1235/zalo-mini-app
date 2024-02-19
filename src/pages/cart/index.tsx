import React, { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Box, Button, Text } from "zmp-ui";

import IconCart from "assets/svg/cart4x.svg";
import { globalModal } from "components/global-modal";
import { HeaderPrimary } from "components/header/header-primary";
import { PAGE_DEFAULT } from "constants/defaultValue";
import { PATH_NAME } from "constants/router";
import useURLParams from "hooks/useURLParams";
import { Cart, CartOrderField } from "models/cart";
import { CalculateRes } from "models/orders";
import { setOrder, setTotalAmount } from "redux/slices/order-slice";
import { AppDispatch, RootState } from "redux/store";
import { cartService } from "services/cart-service";
import { orderService } from "services/order-service";
import { QueryKey } from "types/api";
import { PageScrollView, TouchOpacity } from "zalo-ui";
import { ListCartItem } from "./list-item";
import { CartPreview } from "./preview";
import TicketPicker from "./ticket-picker";

const CartPage = () => {
  const { pageSize, productIds } = useURLParams();

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const isShowingNotificationPriceChange = useRef<boolean>(false);
  const isFetchNextPage = useRef<boolean>(false);

  const cartIdsSelected = useSelector<RootState, number[]>(
    (state) => state.cartStore.cartItemSelected,
  );

  const preSelectItems: number[] = productIds
    ?.split(",")
    ?.map((number) => parseInt(number));

  const [calculatePrice, setCalculatePrice] = useState<CalculateRes>();
  const [cartIds, setCartIds] = useState<number[]>([]);

  const {
    data: carts,
    fetchNextPage: fetchNextPageCart,
    refetch: refetchCart,
  } = useInfiniteQuery(
    [QueryKey.CART],
    async ({ pageParam = 0 }) => {
      const params = {
        pageIndex: pageParam,
        pageSize: Number.parseInt(pageSize) || PAGE_DEFAULT,
        sortBy: CartOrderField.CreatedDate,
      };
      const response = await cartService.getCart(params);
      isFetchNextPage.current = false;
      return response;
    },
    {
      getNextPageParam: (lastPage) => {
        if (!lastPage.last) {
          return lastPage.pageable.pageNumber + 1;
        }
        return undefined;
      },
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    if (cartIdsSelected?.length > 0) {
      handleCalculate(cartIdsSelected);
    } else {
      setCalculatePrice(undefined);
    }
  }, [cartIdsSelected]);

  const handleCalculate = async (cartIds: number[]) => {
    try {
      const calculateResponse = await orderService.getCalculateOrder({
        cartIds,
      });

      dispatch(setTotalAmount(calculateResponse.totalAmount));
      setCalculatePrice(calculateResponse);
      if (
        calculateResponse.priceChangedNotification &&
        !isShowingNotificationPriceChange.current
      ) {
        handleChangePrice();
        isShowingNotificationPriceChange.current = true;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangePrice = async () => {
    globalModal.show({
      title: "Giá sản phẩm đã thay đổi",
      description: `Số lượng sản phẩm của bạn đã chọn đã vượt quá giới hạn của chương trình sale, vì vậy giá sản phẩm sẽ được cập nhật lại.`,
      isShowBtnAccept: true,
    });
  };

  const handleRefetchCart = () => {
    refetchCart();
    if (cartIdsSelected?.length > 0) {
      handleCalculate(cartIdsSelected);
    }
  };

  const handleLoadMoreCart = () => {
    if (!isFetchNextPage.current) {
      isFetchNextPage.current = true;
      fetchNextPageCart();
    }
  };

  const handleOrder = () => {
    let cartList: Cart[] = [];
    carts?.pages?.forEach((item) => {
      cartList = [...cartList, ...item.content];
    });

    const cartSelect = cartList.filter((cart) => cartIds.includes(cart.id));

    dispatch(
      setOrder({
        cartIds: cartIds,
        carts: cartSelect,
        quantity: null,
        nhanhVnProductId: null,
      }),
    );
    navigate(PATH_NAME.ORDER_FORM);
  };

  const handleSelectSaleVoucher = () => {
    let cartList: Cart[] = [];
    carts?.pages?.forEach((item) => {
      cartList = [...cartList, ...item.content];
    });

    const cartSelect = cartList.filter((cart) => cartIds.includes(cart.id));

    dispatch(
      setOrder({
        cartIds: null,
        carts: cartSelect,
        quantity: null,
        nhanhVnProductId: null,
      }),
    );
  };

  return (
    <PageScrollView
      renderHeader={<HeaderPrimary title="Giỏ hàng" />}
      scrollToTop
      targetIdScroll="cart-product"
      scrollToTopClassName="bottom-[calc(var(--h-bottom-content)+10px)] left-2"
      onLoadMore={handleLoadMoreCart}
    >
      <Box id="cart-product" className="overflow-auto">
        {carts?.pages?.[0]?.totalElements ? (
          <>
            <ListCartItem
              listItem={carts}
              onChangeProductsSelected={(ids) => setCartIds(ids)}
              refetchCart={handleRefetchCart}
              preSelectedItems={preSelectItems}
              gifts={calculatePrice?.gifts}
              totalPrice={calculatePrice?.totalPayment || 0}
              totalDiscountPrice={calculatePrice?.totalMoneyDiscount || 0}
            />
            <Box className="fixed bottom-[-1px] left-0 right-0 mb-[var(--h-bottom-navigation)] mt-2 bg-background">
              <TicketPicker onSelect={handleSelectSaleVoucher} />
              <CartPreview
                isDisable={!(cartIds.length > 0)}
                calculatePrice={calculatePrice}
                onSubmit={handleOrder}
              />
            </Box>
          </>
        ) : (
          <Box className="flex flex-col items-center">
            <img src={IconCart} alt="icon cart" className="mt-[80px]" />
            <Text className="my-5 text-sm">
              Bạn chưa có sản phẩm nào tồn tại trong giỏ hàng
            </Text>
            <TouchOpacity className="w-4/5">
              <Button
                className="w-full"
                onClick={() => navigate(PATH_NAME.HOME)}
                size="medium"
              >
                Về trang chủ mua sắm nào
              </Button>
            </TouchOpacity>
          </Box>
        )}
      </Box>
    </PageScrollView>
  );
};

export default CartPage;
