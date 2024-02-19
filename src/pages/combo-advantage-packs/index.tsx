import React from "react";
import { useQuery } from "react-query";
import { Box } from "zmp-ui";
import { PageScrollView } from "zalo-ui";

import { HeaderPrimary } from "components/header/header-primary";
import { ComboSkeleton } from "components/skeletons";
import { FlashSaleComboItem } from "pages/flash-sale/flash-sale-item";
import { categoryService } from "services/category-service";
import { QueryKey } from "types/api";

const ComboAdvantagePacks = () => {
  const { data: categoryCombo, isLoading } = useQuery(
    [QueryKey.CATEGORY_COMBO],
    async () => {
      return await categoryService.getCategoryCombo();
    },
  );

  return (
    <PageScrollView
      renderHeader={<HeaderPrimary title="Combo ưu đãi" />}
      scrollToTop
      targetIdScroll="ticket-page"
      scrollToTopClassName="bottom-[calc(var(--h-bottom-content)+10px)] left-2"
    >
      <Box id="ticket-page" className="overflow-auto flex-1">
        {!isLoading ? (
          <Box>
            <img src={categoryCombo?.banner} alt="" className="w-full h-full" />
            {categoryCombo?.products &&
            Array.isArray(categoryCombo.products) &&
            categoryCombo.products.length > 0 ? (
              <Box className="px-2 mt-2 bg-background py-1 grid grid-cols-2 grid-flow-row gap-2">
                {categoryCombo?.products.map(
                  (item) =>
                    item && (
                      <Box key={item.id}>
                        <FlashSaleComboItem product={item} />
                      </Box>
                    ),
                )}
              </Box>
            ) : (
              <span className="text-center flex justify-center items-center text-[15px] text-gray font-medium mt-[40px]">
                Hiện tại không có ưu đãi nào
              </span>
            )}
          </Box>
        ) : (
          <ComboSkeleton />
        )}
      </Box>
    </PageScrollView>
  );
};

export default ComboAdvantagePacks;
