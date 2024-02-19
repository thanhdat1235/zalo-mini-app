import HeaderSecond from "components/header/header-second";
import LoaderBottom from "components/loader-bottom";
import React, { useRef } from "react";
import { useInfiniteQuery, useQuery } from "react-query";
import { saleService } from "services/sale-service";
import { QueryKey } from "types/api";
import { Page } from "zmp-ui";
import TicketItem from "../components/ticket-item";
import { PAGE_DEFAULT } from "constants/defaultValue";
import useInfiniteScroll from "hooks/useInfiniteScroll";
import { TicketItemSkeleton } from "components/skeletons";

const VoucherListPage = () => {
  const isFetchNextVoucherPage = useRef<boolean>(false);

  const {
    data: saleRes,
    isLoading: isLoadingSale,
    isFetchingNextPage: isFetchingNextPageSale,
    fetchNextPage: fetchNextPageSale,
  } = useInfiniteQuery(
    [QueryKey.VOUCHERS],
    async ({ pageParam = 0 }) => {
      const params = {
        pageIndex: pageParam,
        pageSize: PAGE_DEFAULT,
      };

      const response = await saleService.getAllSale(params);
      isFetchNextVoucherPage.current = false;

      return response;
    },
    {
      getNextPageParam: (lastPage) => {
        if (!lastPage.last) {
          return lastPage.pageable.pageNumber + 1;
        }
        return undefined;
      },
    },
  );

  useInfiniteScroll(() => handleLoadMoreVouchers(), "voucher-list");

  const handleLoadMoreVouchers = () => {
    if (!isFetchNextVoucherPage.current) {
      isFetchNextVoucherPage.current = true;
      fetchNextPageSale();
    }
  };

  return (
    <Page className="flex flex-col bg-background">
      <HeaderSecond title="Danh sách ưu đãi" showBackIcon={true} />
      <div
        className="flex flex-col overflow-auto px-4 scrollbar-hide"
        id="voucher-list"
      >
        {isLoadingSale ? (
          [...new Array(6)].map((_, index) => (
            <TicketItemSkeleton key={index} />
          ))
        ) : saleRes?.pages?.[0]?.totalElements === 0 ? (
          <div className="mt-8">
            <p className="text-center">
              Oops! Không tìm thấy ưu đãi nào dành cho bạn
            </p>
          </div>
        ) : (
          saleRes?.pages.map((page) => {
            return page?.content.map((saleItem) => (
              <div className="-mb-2" key={saleItem.id}>
                <TicketItem
                  voucherSystem={{
                    ...saleItem,
                    canUse: false,
                  }}
                  showCheckBox={false}
                />
              </div>
            ));
          })
        )}
        {isFetchingNextPageSale && <LoaderBottom />}
      </div>
    </Page>
  );
};

export default VoucherListPage;
