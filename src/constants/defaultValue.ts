export const PAGE_DEFAULT = 10;

export const listResponseDefaultValue = {
  content: [],
  pageable: {
    sort: {
      unsorted: true,
      sorted: false,
      empty: true,
    },
    offset: 0,
    pageNumber: 0,
    pageSize: 10,
    paged: true,
    unpaged: false,
  },
  last: false,
  totalPages: 0,
  totalElements: 0,
  size: 10,
  number: 0,
  sort: {
    unsorted: true,
    sorted: false,
    empty: true,
  },
  first: false,
  numberOfElements: 0,
  empty: false,
};

export const searchParamsDefault = {
  pageIndex: 0,
  pageSize: 10,
  sortBy: "createdDate",
  ascending: false,
};
