import { Location, LocationRes, LocationType } from "models/location";
import React, { useState } from "react";
import { Box, Button, Icon, Sheet, Text } from "zmp-ui";

export interface SheetValues {
  title?: string;
  label: string;
  optionAddress?: Location[];
  height?: number;
  action?: (val: any) => void;
  currentID: number;
  disabled?: boolean;
  bgColor?: string;
  fontSize?: string;
}

const SheetComponent = (props: SheetValues) => {
  const [actionSheetVisible, setActionSheetVisible] = useState(false);

  return (
    <>
      <Box
        mt={4}
        className={`flex justify-center items-center rounded-lg  ${
          props.bgColor ? props.bgColor : "!bg-[#F0F3F6] "
        } ${props.disabled && "opacity-40"}`}
      >
        <Button
          disabled={props.disabled}
          className={`font-medium text-start rounded-none !bg-[unset] p-4 h-[unset] text-black ${
            props.fontSize ? props.fontSize : ""
          }`}
          fullWidth
          onClick={() => {
            setActionSheetVisible(true);
          }}
        >
          {props.currentID <= 0 ? props.title : props.label}
        </Button>
        <Box className="mr-2">
          <Icon icon="zi-chevron-down" className="" />
        </Box>
      </Box>
      <Sheet
        height={props.height}
        mask
        visible={actionSheetVisible}
        title={props?.title}
        onClose={() => setActionSheetVisible(false)}
        swipeToClose
      >
        <Box className="mt-2 px-2 overflow-y-scroll max-h-[80vh]">
          {Array.isArray(props.optionAddress) &&
            props?.optionAddress?.map((item, index) => (
              <Box
                key={item.id}
                className="w-full flex justify-between items-center py-4 pl-4 pr-8"
              >
                <Button
                  key={index}
                  className={`text-base text-start rounded-md p-0 h-[unset] ${
                    props.currentID === item.id ? "text-primary" : "text-black"
                  }`}
                  fullWidth
                  variant="secondary"
                  onClick={() => {
                    setActionSheetVisible(false);
                    props.action?.(item);
                  }}
                >
                  {item.name}
                </Button>
                {props.currentID === item.id && (
                  <Icon icon="zi-check" className="text-primary" />
                )}
              </Box>
            ))}
        </Box>
      </Sheet>
    </>
  );
};

export default SheetComponent;
