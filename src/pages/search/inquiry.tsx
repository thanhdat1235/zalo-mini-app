import React, { useCallback, useState } from "react";
import { debounce } from "lodash";
import { Box, Icon, Input } from "zmp-ui";

interface InquiryProps {
  onSubmit?(value?: string): void;
}

export const Inquiry = ({ onSubmit }: InquiryProps) => {
  const [keyword, setKeyword] = useState("");

  const handleChange = useCallback(
    debounce((keyword: string) => {
      setKeyword(keyword);
      onSubmit?.(keyword);
    }, 500),
    [],
  );

  return (
    <Box
      p={4}
      pt={6}
      className="bg-white transition-all ease-out flex-none rounded-full"
      ref={
        ((el: HTMLDivElement) => {
          setTimeout(() => {
            if (el) {
              el.style.paddingTop = "8px";
            }
          });
        }) as any
      }
    >
      <Box p={4} className="relative">
        <Icon
          icon="zi-search"
          size={20}
          className="absolute top-1/2 left-7 -translate-y-1/2"
        />
        <Input
          ref={(el) => {
            if (!el?.input?.value) {
              el?.focus();
            }
          }}
          defaultValue={keyword}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Tìm nhanh sản phẩm ..."
          clearable
          className="rounded-full text-sm h-[36px] pl-10"
        />
      </Box>
    </Box>
  );
};
