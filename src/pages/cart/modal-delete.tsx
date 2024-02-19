import React, { useImperativeHandle, useState } from "react";
import { createPortal } from "react-dom";
import { Modal, TouchOpacity } from "zalo-ui";

interface ModalDeleteProps {
  name: string;
  onDelete(): void;
}

export interface ModalDeletePropRefs {
  hide(): void;
  show(): void;
}

const ModalDelete = React.forwardRef<ModalDeletePropRefs, ModalDeleteProps>(
  ({ name, onDelete }, ref) => {
    const [showModelDelete, setShowModelDelete] = useState<boolean>(false);

    useImperativeHandle(ref, () => {
      return { show, hide };
    });

    const show = () => {
      setShowModelDelete(true);
    };

    const hide = () => {
      setShowModelDelete(false);
    };

    return createPortal(
      <Modal
        className="z-[999]"
        visible={showModelDelete}
        onClose={() => setShowModelDelete(false)}
        onRequestClose={() => setShowModelDelete(false)}
        maskClass="px-[5vw]"
      >
        <div className="">
          <p className="font-bold text-center mb-2">
            Xóa sản phẩm khỏi giỏ hàng
          </p>
          <p className="text-sm">
            Bạn muốn xóa sản phẩm {name} khỏi giỏ hàng của bạn không?
          </p>
          <div className="flex justify-end mt-6">
            <TouchOpacity
              className="mr-2 bg-gray/[.35] py-1 px-4 text-white rounded-lg"
              onClick={() => setShowModelDelete(false)}
            >
              Hủy
            </TouchOpacity>
            <TouchOpacity
              className="bg-red-500 py-1 px-4 text-white rounded-lg"
              onClick={onDelete}
            >
              Xóa
            </TouchOpacity>
          </div>
        </div>
      </Modal>,
      document.body
    );
  }
);

export default ModalDelete;
