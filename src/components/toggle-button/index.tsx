import React from "react";

interface ToggleButtonProps {
  label?: string;
  value: boolean;
  setValue(value: boolean): void;
}

const ToggleButton = ({ label, value, setValue }: ToggleButtonProps) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        value=""
        className="sr-only peer"
        checked={value}
        disabled={true}
      />
      <div
        className={`w-11 border-[0.5px] border-gray-second h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-gray-second after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-opacity ${
          value && "border-primary after:!bg-primary"
        }`}
        onClick={() => setValue(!value)}
      ></div>
      {label && (
        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
          {label}
        </span>
      )}
    </label>
  );
};

export default ToggleButton;
