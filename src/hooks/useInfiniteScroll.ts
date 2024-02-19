import { useEffect } from "react";

const useInfiniteScroll = (loadMore: () => void, elementId: string) => {
  useEffect(() => {
    // const element = findElementWithScrollbar();

    const element = document.getElementById(elementId);
    // console.log(element);

    if (element) {
      element.addEventListener("scroll", () => handleScroll(element));
    }

    return () => {
      element?.removeEventListener("scroll", () => handleScroll(element));
    };
  }, []);

  const handleScroll = (content: HTMLElement) => {
    const scrollThresholdResult = window.innerHeight - content?.offsetHeight;
    const heightScroll = Math.ceil(window.innerHeight + content.scrollTop);

    // console.log(
    //   "window.innerHeight + content.scrollTop",
    //   window.innerHeight + content.scrollTop,
    //   "content.scrollHeight + scrollThreshold",
    //   content.scrollHeight + scrollThresholdResult,
    //   "content.scrollHeight",
    //   content.scrollHeight,
    //   "scrollThreshold",
    //   scrollThresholdResult,
    //   "window.innerHeight",
    //   window.innerHeight,
    //   "content.scrollTop",
    //   content.scrollTop
    // );
    if (content) {
      if (heightScroll >= content.scrollHeight + scrollThresholdResult) {
        loadMore();
      }
    }
  };
};

export default useInfiniteScroll;
