/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { ListResponse, SearchParams } from "types/api";

interface DataProps {
  [key: string]: any;
}

interface Props<T> {
  funcLoadData({
    pageIndex,
    pageSize,
    orderby,
    filterStatus,
  }: SearchParams): Promise<ListResponse<T>>;
  params?: SearchParams;
  dataBody?: DataProps;
}

const useLoadMore = <T>({ funcLoadData, params, dataBody }: Props<T>) => {
  const isReload = useRef(false);
  const isLoadMore = useRef(false);
  const hasMoreRef = useRef(false);
  const hasMore = hasMoreRef.current;
  const isFetching = useRef(false);

  const pageSize = 10;
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loadingReload, setLoadingReload] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoadData, setIsLoadData] = useState(false);
  const [searchParamsData, setSearchParamsData] = useState<
    SearchParams | undefined
  >(params);
  const [dataBodyRequest, setDataBodyRequest] = useState<DataProps | undefined>(
    dataBody,
  );

  useEffect(() => {
    fetchData();
  }, [isLoadData, searchParamsData]);

  const fetchData = async () => {
    if (isFetching.current) {
      return;
    }
    isFetching.current = true;
    isReload.current ? setLoadingReload(true) : setLoading(true);
    try {
      const response = await funcLoadData({
        pageIndex: isReload.current
          ? 1
          : isLoadMore.current
          ? pageNumber + 1
          : pageNumber,
        pageSize: pageSize,
        ...searchParamsData,
        data: dataBodyRequest,
        // orderby,
      });

      setData((prevData) => {
        if (isReload.current) {
          return [...response.content];
        } else {
          return [...prevData, ...response.content];
        }
      });

      setTotalRecords(response.totalElements);

      if (isReload.current) {
        hasMoreRef.current = response.totalElements > response.content.length;
        setPageNumber(1);
      } else {
        hasMoreRef.current =
          response.totalElements > data.length + response.content.length;
        if (isLoadMore.current) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      isReload.current = false;
      isLoadMore.current = false;
      isFetching.current = false;
      setLoading(false);
      setLoadingReload(false);
    }
  };

  const loadMore = () => {
    if (!hasMore) {
      return;
    }
    isLoadMore.current = true;
    setIsLoadData(!isLoadData);
  };

  const onReload = () => {
    isReload.current = true;
    setIsLoadData(!isLoadData);
  };

  const setSearchParams = (searchParams: SearchParams) => {
    setSearchParamsData({
      ...searchParamsData,
      ...searchParams,
    });
  };

  const setDataBody = (dataBodyReq: DataProps) => {
    setDataBodyRequest(dataBodyReq);
  };

  return {
    data,
    totalRecords,
    loading,
    loadingReload,
    hasMore,
    loadMore,
    onReload,
    setSearchParams,
    setDataBody,
  };
};

export default useLoadMore;
