// import React from "react";
// import { createPortal } from "react-dom";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { Box, Icon } from "zmp-ui";

// import { PATH_NAME } from "constants/router";
// import { HomeContentBody, HomeContentType } from "models/home-config";
// import { Sale, SaleType } from "models/sale";
// import { setIsShowHomeBanner } from "redux/slices/home-config-slice";
// import { AppDispatch } from "redux/store";

// interface HomeBannerProps {
//   homeBanner: HomeContentBody;
// }

// const HomeBanner = (props: HomeBannerProps) => {
//   const { homeBanner } = props;
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();

//   const handleNavigate = () => {
//     console.log("click nef");

//     switch (homeBanner.type) {
//       case HomeContentType.SALE:
//         handleNavigateSale(homeBanner.data);
//         break;
//       case HomeContentType.CATEGORY:
//         homeBanner.data?.nhanhVnId &&
//           navigate(
//             `${PATH_NAME.PRODUCT}?categoryId=${homeBanner.data.nhanhVnId}`
//           );
//         break;
//       case HomeContentType.SUBSCRIPTION:
//         homeBanner.data?.id && navigate(`${PATH_NAME.SUBSCRIPTION}`);
//         break;

//       default:
//         dispatch(setIsShowHomeBanner(false));
//         break;
//     }
//   };

//   const handleNavigateSale = (data: Sale) => {
//     switch (data?.type) {
//       case SaleType.FLASH_SALE:
//       case SaleType.SALE_CAMPAIGN:
//       case SaleType.SALE_FOR_NEW_CUSTOMER:
//         navigate(`${PATH_NAME.FLASH_SALE}/${data.id}`);
//         break;
//       default:
//         dispatch(setIsShowHomeBanner(false));
//         break;
//     }
//   };

//   return createPortal(
//     <div
//       className="fixed top-0 left-0 right-0 bottom-0 bg-black/[.5] !z-[999] flex items-center justify-center"
//       onClick={(e) => {
//         // e.stopPropagation();
//         dispatch(setIsShowHomeBanner(false));
//       }}
//     >
//       <Box className="w-[95%] max-h-[90vh] relative flex items-center justify-center">
//         <div
//           className="absolute -top-3 -right-1 border border-white border-solid rounded-full p-1 w-7 h-7 flex items-center justify-center"
//           onClick={() => {
//             dispatch(setIsShowHomeBanner(false));
//             console.log("click 1 ");
//           }}
//         >
//           <Icon icon="zi-close" style={{ color: "white" }} size={18} />
//         </div>
//         <div
//           className="rounded-xl overflow-hidden object-cover flex justify-center items-center h-full w-full"
//           onClick={(e) => {
//             e.stopPropagation();
//             handleNavigate();
//             dispatch(setIsShowHomeBanner(false));
//           }}
//         >
//           <img
//             src={homeBanner.bannerUrl}
//             alt="home banner"
//             className="object-cover h-full w-full"
//             onError={(e: any) => {
//               e.target.onerror = null;
//               dispatch(setIsShowHomeBanner(false));
//             }}
//           />
//         </div>
//       </Box>
//     </div>,
//     document.body
//   );
// };

// export default HomeBanner;

import React from "react";
import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Icon } from "zmp-ui";

import { PATH_NAME } from "constants/router";
import { HomeContentBody, HomeContentType } from "models/home-config";
import { Sale, SaleType } from "models/sale";
import { setIsShowHomeBanner } from "redux/slices/home-config-slice";
import { AppDispatch } from "redux/store";

interface HomeBannerProps {
  homeBanner: HomeContentBody;
}

const HomeBanner = (props: HomeBannerProps) => {
  const { homeBanner } = props;
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleNavigate = () => {
    switch (homeBanner.type) {
      case HomeContentType.SALE:
        handleNavigateSale(homeBanner.data);
        break;
      case HomeContentType.CATEGORY:
        homeBanner.data?.nhanhVnId &&
          navigate(
            `${PATH_NAME.PRODUCT}?categoryId=${homeBanner.data.nhanhVnId}`
          );
        break;
      case HomeContentType.SUBSCRIPTION:
        homeBanner.data?.id && navigate(`${PATH_NAME.SUBSCRIPTION}`);
        break;

      default:
        dispatch(setIsShowHomeBanner(true));
        break;
    }
  };

  const handleNavigateSale = (data: Sale) => {
    switch (data?.type) {
      case SaleType.FLASH_SALE:
      case SaleType.SALE_CAMPAIGN:
      case SaleType.SALE_FOR_NEW_CUSTOMER:
        navigate(`${PATH_NAME.FLASH_SALE}/${data.id}`);
        break;
      default:
        dispatch(setIsShowHomeBanner(true));
        break;
    }
  };

  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 bottom-0 bg-black/[.5] !z-[999] flex items-center justify-center"
        onClick={(e) => {
          e.stopPropagation();
          dispatch(setIsShowHomeBanner(true));
        }}
      >
        <div className="w-[95%] max-h-[90vh] relative flex items-center justify-center">
          <div
            className="absolute -top-3 !z-[9999] -right-1 border border-white border-solid rounded-full p-1 w-7 h-7 flex items-center justify-center pointer-events-auto"
            onClick={(e) => {
              e.stopPropagation();
              dispatch(setIsShowHomeBanner(true));
            }}
          >
            <Icon icon="zi-close" style={{ color: "white" }} size={18} />
          </div>
          <div
            className="rounded-xl !z-[999] overflow-hidden object-cover flex justify-center items-center h-full w-full"
            onClick={(e) => {
              e.stopPropagation();
              dispatch(setIsShowHomeBanner(true));
              handleNavigate();
            }}
          >
            <img
              src={homeBanner.bannerUrl}
              alt="home banner"
              className="object-cover h-full w-full"
              onError={(e: any) => {
                e.target.onerror = null;
                dispatch(setIsShowHomeBanner(true));
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeBanner;
