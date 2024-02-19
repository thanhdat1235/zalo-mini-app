import { Customer } from "models/user";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { Box, Button, Icon, Modal } from "zmp-ui";
import appConfig from "../../../app-config.json";

interface CoinModalProps {
  visible?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
}

const CoinModal = ({ visible, onClose, onConfirm }: CoinModalProps) => {
  const user = useSelector<RootState, Customer>(
    (state) => state.userStore.user
  );

  return (
    <Modal visible={visible} onClose={onClose} maskClosable>
      <Box className="relative">
        <Box className="p-[6px] absolute -top-8 -right-5" onClick={onClose}>
          <Icon icon="zi-close" style={{ color: "black" }} size={18} />
        </Box>
        <Box className="text-justify">
          {user?.coin && user.coin > 0 ? (
            "Sử dụng điểm thưởng của bạn để giảm giá khi mua sản phẩm"
          ) : (
            <span>
              Rất tiếc, bạn chưa có điểm thưởng để sử dụng rồi. Hãy mua săm tích
              cực tại{" "}
              <span className="text-primary font-bold uppercase">
                {appConfig.app.title}
              </span>{" "}
              để săn nhiểu điểm thưởng hơn bạn nhé.
            </span>
          )}
        </Box>
        <Button
          className="rounded-lg mt-4 w-full"
          size="medium"
          onClick={onConfirm}
        >
          Đồng ý
        </Button>
      </Box>
    </Modal>
  );
};

export default CoinModal;
