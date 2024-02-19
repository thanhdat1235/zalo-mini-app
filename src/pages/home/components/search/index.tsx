import React from "react";
import { useNavigate } from "react-router-dom";

import SearchIcon from "assets/svg/search.svg";
import { PATH_NAME } from "constants/router";
import { TouchOpacity } from "zalo-ui";

interface SearchProps {}

const Search = ({}: SearchProps) => {
  const navigate = useNavigate();

  return (
    <TouchOpacity
      className="bg-background flex items-center rounded-full border border-gray/[.2] m-4 px-4"
      onClick={() => navigate(PATH_NAME.SEARCH)}
    >
      <img src={SearchIcon} className=" w-5 object-contain" />
      <input
        placeholder="Tìm nhanh sản phẩm ..."
        className="rounded-full text-sm h-[36px] pl-5 outline-none border-none bg-transparent w-full"
      />
    </TouchOpacity>
  );
};

export default Search;
