import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useInfiniteQuery } from "react-query";
import { Box, List, Sheet, Text } from "zmp-ui";

import IconEmptyFaqs from "assets/images/empty-faqs.png";
import SearchIcon from "assets/svg/search.svg";
import SheetTitle from "components/bottom-sheet/sheet-title";
import HeaderSecond from "components/header/header-second";
import LoaderBottom from "components/loader-bottom";
import { FaqsItemSkeleton } from "components/skeletons";
import { PAGE_DEFAULT } from "constants/defaultValue";
import useDebounce from "hooks/useDebounce";
import { faqsService } from "services/faqs-service";
import { QueryKey } from "types/api";
import { PageScrollView, TouchOpacity } from "zalo-ui";

interface FaqsItemProps {
  id: number;
  title?: string;
  desc?: string;
}

const FaqsPage = () => {
  const isFetchNextPage = useRef<boolean>(false);
  const refSearchInput = useRef<any>();

  const [searchKey, setSearchKey] = useState<string>();

  const debounced = useDebounce(searchKey, 500);

  useEffect(() => {
    refetchFaqs();
  }, [debounced]);

  const {
    data: faqsData,
    isLoading: isLoadingFaqs,
    fetchNextPage: fetchNextPageFaqs,
    isFetchingNextPage: isFetchingNextPageFaqs,
    refetch: refetchFaqs,
  } = useInfiniteQuery(
    [QueryKey.FAQS],
    async ({ pageParam = 0 }) => {
      const params = {
        pageIndex: pageParam,
        pageSize: PAGE_DEFAULT,
        title: searchKey,
      };
      const response = await faqsService.getFaqs(params);
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
    },
  );

  const handleLoadMore = () => {
    if (!isFetchNextPage.current) {
      isFetchNextPage.current = true;
      fetchNextPageFaqs();
    }
  };

  return (
    <PageScrollView
      renderHeader={
        <HeaderSecond title="Câu hỏi thường gặp" showBackIcon={true} />
      }
      scrollToTop
      targetIdScroll="faqs"
      scrollToTopClassName="bottom-2 left-2"
      onLoadMore={handleLoadMore}
    >
      <Box
        className="bg-background px-6 h-full overflow-auto  scrollbar-hide"
        id="faqs"
      >
        <Text className="text-[24px] font-[700] text-text-black leading-[24px] py-[21px]">
          Bạn có thắc mắc gì dọ ?
        </Text>
        <Box className="sticky top-0 left-0 right-0 py-3 bg-background">
          <Box
            className="bg-background flex items-center rounded-full border border-gray/[.2] px-4 w-full"
            onClick={() => refSearchInput.current.focus()}
          >
            <img src={SearchIcon} className=" w-5 object-contain" />
            <input
              ref={refSearchInput}
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              placeholder="Tìm kiếm ..."
              className="rounded-full text-sm h-[36px] pl-5 outline-none border-none bg-transparent w-full"
            />
          </Box>
        </Box>
        {isLoadingFaqs ? (
          <>
            {[...new Array(4)].map((_, index) => (
              <FaqsItemSkeleton key={index} />
            ))}
          </>
        ) : faqsData?.pages?.[0]?.totalElements &&
          faqsData.pages[0].totalElements > 0 ? (
          <Box className="mt-5 mb-[64px]">
            <List>
              {faqsData?.pages?.map(
                (page) =>
                  page?.content?.map((content) => (
                    <FaqsItem
                      key={content.id}
                      id={content.id}
                      title={content?.title}
                      desc={content.description}
                    />
                  )),
              )}
            </List>
            {isFetchingNextPageFaqs && <LoaderBottom />}
          </Box>
        ) : (
          <Box className="flex flex-col items-center">
            <Box className="w-1/2 mt-4">
              <img src={IconEmptyFaqs} alt="icon empty faqs" />
            </Box>
            <Box className="mt-5">
              <Text className="text-[16px]">
                Không tìm thấy câu hỏi thường gặp nào
              </Text>
            </Box>
          </Box>
        )}
      </Box>
    </PageScrollView>
  );
};

export default FaqsPage;

const FaqsItem = ({ id, title, desc }: FaqsItemProps) => {
  const [isShow, setIsShow] = useState<boolean>(false);

  return (
    <>
      <TouchOpacity
        key={id}
        className="bg-background px-[20px] py-[20px] rounded-[20px] border-[#F3F4F6] border-[1px] border-solid mb-[16px]"
        onClick={() => setIsShow(true)}
      >
        <Text className="text-[16px] font-[700] text-text-black leading-[24px] line-clamp-2">
          {title}
        </Text>
        <Text className="text-[12px] text-[#6B7280] leading-[18px] mt-1 line-clamp-3">
          {desc}
        </Text>
      </TouchOpacity>
      {createPortal(
        <Sheet
          visible={isShow}
          onClose={() => setIsShow(false)}
          autoHeight
          mask
          maskClosable
          handler
          swipeToClose
        >
          <SheetTitle
            title="Câu hỏi thường gặp"
            onClose={() => setIsShow(false)}
          />
          <Box className="px-4 overflow-auto scrollbar-hide max-h-[80vh] pb-5 bg-thumbnail z-10">
            <Box>
              <Box>
                <Text className="text-lg font-bold mt-2 mb-1">{title}</Text>
              </Box>
              <Box className="mb-5">
                <Text className="text-justify">{desc}</Text>
              </Box>
            </Box>
          </Box>
        </Sheet>,
        document.body,
      )}
    </>
  );
};
