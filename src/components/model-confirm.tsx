import React from "react";
import { createPortal } from "react-dom";
import { TouchOpacity } from "zalo-ui";
import { Box, Icon, Modal, Text } from "zmp-ui";

interface ModelConfirmProps {
  isVisible: boolean;
  title?: string;
  desc?: string;
  onConfirm(): void;
  onExit(): void;
}

const ModelConfirm = ({
  title,
  desc,
  onExit,
  onConfirm,
  isVisible,
}: ModelConfirmProps) => {
  return createPortal(
    <Modal onClose={onExit} visible={isVisible}>
      <Box className="flex flex-col items-center">
        <Box className="bg-red-100 p-4 rounded-full">
          <Box className="p-4 bg-red-500 rounded-full">
            <Icon icon="zi-exclamation" className="text-white" size={40} />
          </Box>
        </Box>
        <Box className="mt-5">
          {title && (
            <Text className="uppercase text-xl font-bold text-center">
              {title}
            </Text>
          )}
          {desc && (
            <Text className="text-sm font-light mt-3 text-center">{desc}</Text>
          )}
        </Box>
        <Box className="mt-8 grid grid-cols-2 gap-1 w-full">
          <TouchOpacity
            className="border-[0.5px] border-gray bg-background-primary text-center px-2 py-3 rounded-lg font-bold"
            onClick={onExit}
          >
            Không
          </TouchOpacity>
          <TouchOpacity
            className="rounded-lg text-center text-white bg-primary-color px-2 py-3 font-bold"
            onClick={onConfirm}
          >
            Có
          </TouchOpacity>
        </Box>
      </Box>
    </Modal>,
    document.body
  );
};

export default ModelConfirm;
