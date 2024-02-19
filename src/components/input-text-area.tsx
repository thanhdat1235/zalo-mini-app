import React from "react";
import { TouchOpacity } from "zalo-ui";
import { Icon, Input, Text } from "zmp-ui";

interface InputTextAreaProps {
  title?: string;
  value?: string;
  placeholder?: string;
  isClose?: boolean;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement> | undefined;
  onClose?(): void;
}

const InputTextArea = ({
  title,
  value,
  placeholder,
  isClose = true,
  onChange,
  onClose,
}: InputTextAreaProps) => {
  return (
    <div className="relative my-3">
      <Input.TextArea
        id="ticket-input"
        value={value}
        showCount
        className="bg-[#F0F3F6] border-0 pt-6 text-[12px]"
        placeholder={placeholder}
        onChange={onChange}
      />
      <Text className="absolute top-1 left-2 text-md block text-[13px] font-semibold ml-1 text-text-black">
        {title}
      </Text>
      {isClose && value && (
        <TouchOpacity onClick={onClose}>
          <Icon
            icon="zi-close-circle"
            size={14}
            className="absolute right-2 top-2"
          />
        </TouchOpacity>
      )}
    </div>
  );
};

export default InputTextArea;
