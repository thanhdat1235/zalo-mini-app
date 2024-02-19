import React, { useRef, useState } from "react";
import { useInfiniteQuery } from "react-query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Page, Text } from "zmp-ui";

import UserAvatar from "assets/images/logo.png";
import SearchIcon from "assets/svg/search.svg";
import HeaderSecond from "components/header/header-second";
import { PAGE_DEFAULT } from "constants/defaultValue";
import { PATH_NAME } from "constants/router";
import useDebounce from "hooks/useDebounce";
import useInfiniteScroll from "hooks/useInfiniteScroll";
import { Customer } from "models/user";
import { RootState } from "redux/store";
import { userService } from "services/user-service";
import { QueryKey } from "types/api";
import { DATE_FORMAT_DDMMYYYYTHHMM, formatDate } from "utils/date";
import { TouchOpacity } from "zalo-ui";

const UserListReferral = () => {
  const navigate = useNavigate();

  const isFetchNextProductPage = useRef<boolean>(false);

  const user = useSelector<RootState, Customer>(
    (state) => state.userStore.user,
  );

  const [valueSearch, setValueSearch] = useState("");
  const queryText = useDebounce(valueSearch, 500);

  const {
    data,
    fetchNextPage: fetchNextPage,
    isLoading: isLoading,
    isFetchingNextPage: isFetchingNextPage,
  } = useInfiniteQuery(
    [QueryKey.AFFILIATE_LIST, queryText],
    async ({ pageParam = 0 }) => {
      const params = {
        pageIndex: pageParam,
        pageSize: PAGE_DEFAULT,
        referredCustomerId: user.id,
        referredCustomerFullName: queryText,
      };

      const response = await userService.affiliates(params);
      isFetchNextProductPage.current = false;
      return response;
    },
    {
      getNextPageParam: (lastPage) => {
        if (!lastPage.last) {
          return lastPage.pageable.pageNumber + 1;
        }
        return undefined;
      },
      enabled: Boolean(user.id),
    },
  );

  useInfiniteScroll(() => handleLoadMore(), "referral-list");

  const handleLoadMore = () => {
    if (!isFetchNextProductPage.current) {
      isFetchNextProductPage.current = true;
      fetchNextPage();
    }
  };

  return (
    <Page className="relative flex-1 flex flex-col bg-background">
      <HeaderSecond title="Người giới thiệu" showBackIcon={true} />
      <Box
        id="referral-list"
        className="h-full overflow-auto bg-background flex flex-col"
      >
        <Box className="sticky top-0 left-0 right-0 py-3 px-5 bg-background">
          <Box className="bg-background flex items-center rounded-full border border-gray/[.2] px-4 w-full">
            <img src={SearchIcon} className=" w-5 object-contain" />
            <input
              value={valueSearch}
              onChange={(e) => setValueSearch(e.target.value)}
              placeholder="Tìm kiếm ..."
              className="rounded-full text-sm h-[36px] pl-5 outline-none border-none bg-transparent w-full"
            />
          </Box>
        </Box>
        <Box className="mx-4 flex-1">
          <Box className="mb-2 pb-4">
            {data?.pages?.[0]?.totalElements &&
            data.pages[0].totalElements > 0 ? (
              <Box>
                <Text className="text-gray mb-[24px] flex justify-start items-center text-[20px] font-[700] leading-[24px]">
                  Người được giới thiệu thành công
                </Text>
                {data?.pages.map((page) =>
                  page.content.map((item) => (
                    <li key={item.id} className="flex items-center">
                      <img
                        src={UserAvatar}
                        alt=""
                        className="h-[56px] w-[56px] rounded-[100%]"
                      />
                      <Box className="ml-[16px]">
                        <Text className="leading-[24px] flex justify-start items-end flex-wrap text-[16px] font-[600] text-text-black">
                          {item.affiliateCustomerFullName}
                        </Text>
                        <Text className="leading-[16px] font-[500] text-[11px] text-gray mt-[3px]">
                          {item.createdDate &&
                            formatDate(
                              item.createdDate,
                              DATE_FORMAT_DDMMYYYYTHHMM,
                            )}
                        </Text>
                      </Box>
                    </li>
                  )),
                )}
              </Box>
            ) : (
              <Box className="flex flex-col h-full items-center">
                <Box className="mt-5">
                  {queryText ? (
                    <Text className="text-[16px]">
                      Không có dữ liệu tìm kiếm phù hợp
                    </Text>
                  ) : (
                    <Box>
                      <Text className="text-center font-normal">
                        Không có dữ liệu, giới thiệu ngay để được những ưu đãi
                        hấp dẫn nhé!
                      </Text>
                      <TouchOpacity
                        className="w-full rounded-xl p-4 mt-2 bg-primary text-white font-bold text-center"
                        onClick={() =>
                          navigate(`${PATH_NAME.REFERRAL_CODE}/${user.id}`)
                        }
                      >
                        Giới thiệu ngay
                      </TouchOpacity>
                    </Box>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Page>
  );
};

export default UserListReferral;
