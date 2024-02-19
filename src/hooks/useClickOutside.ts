import { useEffect, useRef } from "react";

const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  handler: (event: MouseEvent | TouchEvent | KeyboardEvent) => void,
) => {
  const savedHandler =
    useRef<(event: MouseEvent | TouchEvent | KeyboardEvent) => void>();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent | TouchEvent | KeyboardEvent,
    ) => {
      if (ref.current && !ref.current.contains?.(event.target as Node)) {
        savedHandler.current?.(event);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        savedHandler.current?.(event);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [ref]);
};

export default useClickOutside;
