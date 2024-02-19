import React, { useImperativeHandle, useState } from "react";
import { Modal } from "zalo-ui";

interface ModalState {
  visible?: boolean;
  title?: string;
  description?: string;
  isShowBtnAccept?: boolean;
  isShowBtnCancel?: boolean;
  buttonAcceptText?: string;
  buttonCancelText?: string;
  type?: string;
  onAccept?: () => void;
  onCancel?: () => void;
}

interface GlobalModalProps {
  onAccept?: () => void;
  onCancel?: () => void;
}

export const globalModalRef = React.createRef<any>();

export const globalModal = {
  show: ({
    title,
    description,
    type,
    isShowBtnAccept,
    isShowBtnCancel,
    buttonAcceptText,
    buttonCancelText,
    onAccept,
    onCancel,
  }: ModalState) => {
    globalModalRef?.current?.show({
      title,
      description,
      type,
      isShowBtnAccept,
      isShowBtnCancel,
      buttonAcceptText,
      buttonCancelText,
      onAccept,
      onCancel,
    });
  },
  hide: () => {
    globalModalRef?.current?.hide();
  },
  onAccept: () => {
    globalModalRef?.current?.onAccept();
  },
};

const GlobalModal = React.forwardRef((__props: GlobalModalProps, ref) => {
  const [modal, setModal] = useState<ModalState>({
    visible: false,
    title: "",
    description: "",
    type: "",
    isShowBtnAccept: false,
    isShowBtnCancel: false,
    buttonAcceptText: "Xác nhận",
    buttonCancelText: "Huỷ",
  });

  useImperativeHandle(ref, () => {
    return { show, hide };
  });

  const show = ({
    title,
    description,
    isShowBtnAccept,
    isShowBtnCancel,
    buttonAcceptText,
    buttonCancelText,
    onAccept,
    onCancel,
  }: ModalState) => {
    setModal({
      visible: true,
      title,
      description,
      isShowBtnAccept,
      isShowBtnCancel,
      buttonAcceptText,
      buttonCancelText,
      onAccept,
      onCancel,
    });
  };

  const hide = () => {
    setModal({
      ...modal,
      visible: false,
      title: "",
      description: "",
      type: "",
    });
  };

  const handleAccept = () => {
    setModal({
      ...modal,
      visible: false,
    });
    modal.onAccept?.();
  };

  const handleOnCancel = () => {
    setModal({
      ...modal,
      visible: false,
    });
    modal.onCancel?.();
  };

  return (
    <Modal visible={modal.visible || false}>
      <div className="w-[80vw] bg-background rounded-2 p-2">
        <div className="flex flex-col items-center border-b-[0.1px] border-gray-second">
          <p className="font-medium text-lg mb-3 text-black">{modal.title}</p>
          <p className="font-medium text-xs mb-4 px-3 items-center ">
            {modal.description}
          </p>
        </div>
        <div className="flex items-center justify-center">
          {modal.isShowBtnCancel && (
            <button
              onClick={handleOnCancel}
              className={`font-medium mt-2 p-2 mr-2 w-[80%] bg-red-500 rounded-md`}
            >
              <p className="text-white">{modal.buttonCancelText || "Huỷ"}</p>
            </button>
          )}
          {modal.isShowBtnAccept && (
            <button
              onClick={handleAccept}
              className={`font-medium mt-2 p-2 w-[80%] bg-primary rounded-md`}
            >
              <p className="text-white">
                {modal.buttonAcceptText || "Xác nhận"}
              </p>
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
});

export default GlobalModal;
