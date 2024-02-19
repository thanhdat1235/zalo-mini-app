import React, { Suspense, useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "react-query";
import { Box, Page, Tabs, Text } from "zmp-ui";

import HeaderSecond from "components/header/header-second";
import { PAGE_DEFAULT } from "constants/defaultValue";
import useInfiniteScroll from "hooks/useInfiniteScroll";
import useURLParams from "hooks/useURLParams";
import {
  OrderPaymentMethod,
  OrderSortField,
  OrderStatus as OrderStatusModel,
} from "models/orders";
import { orderService } from "services/order-service";
import { QueryKey } from "types/api";
import OrderStatus from "./order-status";

const orderStatus = [
  {
    id: 1,
    name: "Chờ xác nhận",
    status: OrderStatusModel.WAITING_CONFIRM,
    paymentMethod: null,
  },
  {
    id: 2,
    name: "Chờ lấy hàng",
    status: OrderStatusModel.WAITING_PICKUP,
    paymentMethod: OrderPaymentMethod.GATEWAY,
  },
  {
    id: 3,
    name: "Đang vận chuyển",
    status: OrderStatusModel.SHIPPING,
    paymentMethod: null,
  },
  {
    id: 4,
    name: "Hoàn thành",
    status: OrderStatusModel.SUCCESS,
    paymentMethod: null,
  },
  {
    id: 5,
    name: "Đã huỷ",
    status: OrderStatusModel.CANCELED,
    paymentMethod: null,
  },
  {
    id: 6,
    name: "Trả hàng",
    status: OrderStatusModel.RETURNED,
    paymentMethod: null,
  },
];

const UserOrder = () => {
  const params = useURLParams();

  const isFetchNextPage = useRef<boolean>(false);

  const [status, setStatus] = useState<OrderStatusModel>(
    (params.status as OrderStatusModel) || OrderStatusModel.WAITING_CONFIRM
  );
  const [paymentMethod, setPaymentMethod] = useState<OrderPaymentMethod>();
  interface TabBarCustomProps {
    activeKey: string;
    panes: Array<any>;
    onTabClick: (key: string, event: React.MouseEvent) => void;
  }

  const TabBarCustom = (props: TabBarCustomProps) => {
    const { activeKey, panes, onTabClick } = props;
    const containerRef = useRef<any>(null);

    useEffect(() => {
      const container = containerRef.current;
      const activeIndex = panes.findIndex((pane) => pane.key === activeKey);
      const activeBox = container?.children[activeIndex] as HTMLDivElement;

      container?.addEventListener("scroll", handleScroll);

      if (activeBox) {
        setTimeout(() => {
          activeBox.scrollIntoView();
        }, 400);
      }

      return () => {
        container?.removeEventListener("scroll", handleScroll);
      };
    }, []);

    useEffect(() => {
      const container = containerRef.current;
      const activeIndex = panes.findIndex((pane) => pane.key === activeKey);
      const activeBox = container?.children[activeIndex] as HTMLDivElement;

      if (activeBox) {
        const containerWidth = container?.offsetWidth || 0;
        const boxWidth = activeBox.offsetWidth;
        const boxLeft = activeBox.offsetLeft;
        const scrollLeft = boxLeft - (containerWidth - boxWidth) / 2;

        container?.scrollTo({
          left: scrollLeft,
          behavior: "smooth",
        });
      }
    }, [activeKey]);

    const handleScroll = () => {
      const container = containerRef.current;
      const scrollLeft = container?.scrollLeft || 0;
      const containerWidth = container?.offsetWidth || 0;
      const containerScrollWidth = container?.scrollWidth || 0;

      if (scrollLeft + containerWidth >= containerScrollWidth) {
        container.scrollTo({
          left: containerScrollWidth - containerWidth,
          behavior: "smooth",
        });
      }
    };

    return (
      <Box
        className="flex flex-row fixed top-[var(--custom-header)] h-[var(--h-order-tab)] pt-2 left-2 right-0 text-center bg-background overflow-x-auto scrollbar-hide z-[99]"
        ref={containerRef}
        style={{
          scrollSnapType: "x mandatory",
          scrollSnapAlign: "start",
        }}
      >
        {panes.map((item, index) => (
          <Box
            key={index}
            className={`flex items-center justify-center py-[13px] px-3 mx-2 rounded-xl min-w-[150px] ${
              activeKey === item.key ? "bg-primary" : "bg-background-primary"
            }`}
            onClick={(e) => {
              onTabClick(item.key, e);
              setStatus(item.key);
              setPaymentMethod(item.paymentMethod);
            }}
            style={{
              scrollSnapAlign:
                containerRef.current?.offsetWidth <
                containerRef.current?.scrollWidth
                  ? "start"
                  : "none",
            }}
          >
            <Text
              className={`font-bold text-center ${
                activeKey === item.key ? "text-white" : "text-black"
              }`}
            >
              {item?.props?.label || ""}
            </Text>
          </Box>
        ))}
      </Box>
    );
  };

  useInfiniteScroll(() => handleLoadMore(), "orders");

  const { data, fetchNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [QueryKey.ORDER, status, paymentMethod],
      queryFn: async ({ pageParam = 0 }) => {
        const statusQuery = orderStatus.find(
          (order) => order.status === status
        );
        const params = {
          pageIndex: pageParam,
          pageSize: PAGE_DEFAULT,
          statuses:
            statusQuery?.status === OrderStatusModel.WAITING_CONFIRM
              ? [OrderStatusModel.WAITING_CONFIRM, OrderStatusModel.NEW]
              : statusQuery?.status,
          paymentMethod,
          sortBy: OrderSortField.CREATED_DATE,
          ascending: false,
        };
        const response = await orderService.getOrders(params);
        isFetchNextPage.current = false;
        return response;
      },
      getNextPageParam: (lastPage) => {
        if (!lastPage.last) {
          return lastPage.pageable.pageNumber + 1;
        }
        return undefined;
      },
    });

  const handleLoadMore = () => {
    if (!isFetchNextPage.current) {
      isFetchNextPage.current = true;
      fetchNextPage();
    }
  };

  return (
    <Page className="flex flex-col bg-background">
      <HeaderSecond title="Đơn hàng" showBackIcon={true} />
      <Box id="orders" className="overflow-auto">
        <Tabs
          scrollable
          defaultActiveKey={status}
          className="order-status overflow-hidden"
          renderTabBar={TabBarCustom}
        >
          {orderStatus.map((status) => (
            <Tabs.Tab key={status.status} label={status.name}>
              <Suspense>
                <OrderStatus
                  data={data}
                  isFetchingNextPage={isFetchingNextPage}
                  isLoading={isLoading}
                />
              </Suspense>
            </Tabs.Tab>
          ))}
        </Tabs>
      </Box>
    </Page>
  );
};

export default UserOrder;
