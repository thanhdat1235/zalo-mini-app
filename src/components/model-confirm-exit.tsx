import React, { useEffect, useState } from "react";
import { closeApp, offConfirmToExit, onConfirmToExit } from "zmp-sdk";
import { Box, Icon, Modal, Text } from "zmp-ui";
import { createPortal } from "react-dom";

import appConfig from "../../app-config.json";
import { TouchOpacity } from "zalo-ui";

const ModelConfirmExit = () => {
  const [confirmModalVisible, setConfirmModalVisible] =
    useState<boolean>(false);

  useEffect(() => {
    onConfirmToExit(() => setConfirmModalVisible(true));
    return () => offConfirmToExit();
  }, []);

  return createPortal(
    <Modal visible={confirmModalVisible} className="z-[999999]">
      <Box className="flex flex-col items-center">
        <Box className="bg-orange-100 p-4 rounded-full">
          <Box className="p-4 bg-orange-500 rounded-full">
            <Icon icon="zi-exclamation" className="text-white" size={40} />
          </Box>
        </Box>
        <Box className="mt-5">
          <Text className="uppercase text-xl font-bold text-center">
            {appConfig.app.title}
          </Text>
          <Text className="text-sm font-light mt-3 text-center">
            Bạn có chắc muốn rời khỏi Mini App không?
          </Text>
        </Box>
        <Box className="mt-8 grid grid-cols-2 gap-1 w-full">
          <TouchOpacity
            className="border border-primary text-center text-primary px-2 py-3 rounded-lg font-bold"
            onClick={() => {
              closeApp();
            }}
          >
            Rời khỏi
          </TouchOpacity>
          <TouchOpacity
            className="rounded-lg text-center text-white bg-primary px-2 py-3 font-bold"
            onClick={() => setConfirmModalVisible(false)}
          >
            Ở lại Mini App
          </TouchOpacity>
        </Box>
      </Box>
    </Modal>,
    document.body,
  );
};

export default ModelConfirmExit;
