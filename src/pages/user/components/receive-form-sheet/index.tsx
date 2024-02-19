import SheetTitle from "components/sheet-title";
import React from "react";
import { useForm } from "react-hook-form";
import { Box, Sheet } from "zmp-ui";

interface ReceiveFormSheetProps {
  visible: boolean;
  onClose: () => void;
}

const ReceiveFormSheet = ({ visible, onClose }: ReceiveFormSheetProps) => {
  // const {
  //     getValues,
  //     handleSubmit,
  //     control,
  //     reset,
  //     formState: { errors },
  //   } = useForm<SubscriptionBuyRequest>({
  //     defaultValues: {},
  //   });

  return (
    <Sheet
      visible={visible}
      mask
      autoHeight
      handler
      swipeToClose
      maskClosable
      onClose={onClose}
    >
      <Box className="mx-4 mb-5">
        <SheetTitle title="Thông tin nhận quà" onClose={onClose} />
        <Box className=""></Box>
      </Box>
    </Sheet>
  );
};

export default ReceiveFormSheet;
