import React, { useState } from "react";
import { useQuery } from "react-query";
import { Box, Sheet } from "zmp-ui";

import { vietQrService } from "services/vietqr-service";
import { QueryKey } from "types/api";
import BankAppItem, { BankAppItemSkeleton } from "./bank-app-item";
import SheetTitle from "components/bottom-sheet/sheet-title";
import { getSystemInfo } from "zmp-sdk";

interface BankSelectProps {
  visible: boolean;
  onClose(): void;
}

const BankSelect = ({ visible, onClose }: BankSelectProps) => {
  const { platform } = getSystemInfo();

  const { data: bankAppResponse, isLoading: isLoadingBankApp } = useQuery(
    [QueryKey.BANK_APP, platform],
    async () => await vietQrService.getBankApp(platform),
    { enabled: Boolean(platform) },
  );

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      swipeToClose
      maskClosable
      autoHeight
      className="!bg-background-primary bank-select"
    >
      <Box className="max-h-[80vh] overflow-auto bg-background-primary">
        <Box className="sticky top-0 left-0 right-0 px-4 pt-3 bg-background-primary">
          <SheetTitle title="Chọn ngân hàng thanh toán" onClose={onClose} />
        </Box>
        {isLoadingBankApp ? (
          <Box className="mt-2">
            <BankAppItemSkeleton />
            <BankAppItemSkeleton />
            <BankAppItemSkeleton />
          </Box>
        ) : (
          <Box className="mt-2 mb-4">
            {bankAppResponse?.apps?.map((bankApp) => (
              <BankAppItem {...bankApp} key={bankApp.appId} />
            ))}
          </Box>
        )}
      </Box>
    </Sheet>
  );
};

export default BankSelect;
