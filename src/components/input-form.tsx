import React, {
  ChangeEventHandler,
  HTMLInputTypeAttribute,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { useDispatch } from "react-redux";
import { getPhoneNumberZaloProfileThunk } from "redux/slices/user-slice";
import { AppDispatch } from "redux/store";
import { zaloService } from "services/zalo-service";
import { Box, Icon, useSnackbar } from "zmp-ui";
import zaloImg from "assets/images/zalo.jpg";
import { globalLoading } from "./global-loading";
import { TouchOpacity } from "zalo-ui";

interface InputFormProps {
  title?: string;
  value?: string;
  placeholder?: string;
  autoFocus?: boolean;
  isClose?: boolean;
  readOnly?: boolean;
  type?: HTMLInputTypeAttribute;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  allowZalo?: boolean;
  onClose?(): void;
}

const InputForm = React.forwardRef((props: InputFormProps, ref) => {
  const { openSnackbar, closeSnackbar } = useSnackbar();
  const timmerId = useRef();

  useEffect(() => {
    closeSnackbar();
    clearInterval(timmerId.current);
  }, []);

  const {
    title,
    value = "",
    placeholder,
    autoFocus = false,
    isClose = true,
    type = "text",
    readOnly = false,
    onChange,
    onClose,
    allowZalo,
  } = props;

  const dispatch = useDispatch<AppDispatch>();

  const handleGetPhoneZaloProfile = async () => {
    try {
      globalLoading.show();
      const token = await zaloService.getUserPhoneNumber();
      dispatch(getPhoneNumberZaloProfileThunk(token));
      openSnackbar({
        icon: true,
        type: "success",
        text: "Cập nhật số điện thoại từ Zalo thành công",
        duration: 3000,
      });
    } catch (err) {
      console.log(
        "🚀 ~ file: index.tsx:188 ~ handleGetPhoneZaloProfile ~ err:",
        err
      );
      openSnackbar({
        icon: true,
        type: "error",
        text: "Cập nhật số điện thoại từ Zalo thất bại",
        duration: 3000,
      });
    } finally {
      globalLoading.hide();
    }
  };

  const inputRef = useRef<any>();

  useImperativeHandle(ref, () => {
    return { focus: focus };
  });

  const focus = () => {
    inputRef.current.focus();
  };

  return (
    <Box className="flex relative items-center bg-[#F0F3F6] rounded-xl h-[57px] mt-3">
      <Box
        className={`px-2 py-1 flex-1 h-full flex flex-col ${
          !title && "justify-center"
        }`}
      >
        {title && (
          <label
            htmlFor="ticket-input"
            className="text-md block text-[13px] font-semibold ml-1 text-text-black"
          >
            {title}
          </label>
        )}
        <input
          ref={inputRef}
          type={type}
          value={value}
          autoFocus={autoFocus}
          readOnly={readOnly}
          id="ticket-input"
          className="w-full border-none outline-none bg-transparent text-[12px] ml-1 capitalize"
          placeholder={placeholder}
          onChange={onChange}
        />
        {allowZalo && (
          <TouchOpacity onClick={handleGetPhoneZaloProfile}>
            <img
              src={zaloImg}
              className="w-[50px] h-auto absolute top-[2px] right-0"
              alt="Zalo"
            />
          </TouchOpacity>
        )}
      </Box>
      {isClose && value && !allowZalo && !readOnly && (
        <TouchOpacity onClick={onClose}>
          <Icon
            icon="zi-close-circle"
            size={14}
            className="absolute right-2 top-[50%] translate-y-[-50%]"
          />
        </TouchOpacity>
      )}
    </Box>
  );
});

export default InputForm;
