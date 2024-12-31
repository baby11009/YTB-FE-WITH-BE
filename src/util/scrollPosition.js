export const IsEnd = (setIsEnd, tolerance = 0) => {
  const documentHeight = document.documentElement.scrollHeight;
  // The current vertical position of the scroll bar
  const scrollTop = window.scrollY;
  // The height of the viewport
  const viewportHeight = window.innerHeight;

  const isScrollable = documentHeight > viewportHeight;

  const isEnd =
    Math.ceil(scrollTop + viewportHeight + tolerance) >= documentHeight;

  // Check if the scroll position is at the bottom of the page
  setIsEnd(isScrollable && isEnd);
};
export const IsElementEnd = (setIsEnd, element) => {
  const scrollHeight = element.target.scrollHeight;
  const scrollTop = element.target.scrollTop;
  const clientHeight = element.target.clientHeight;

  const isEnd = Math.ceil(clientHeight + scrollTop) >= scrollHeight;

  const isScrollable = scrollHeight > clientHeight;

  setIsEnd(isEnd && isScrollable);
};

export const IsTop = (setIsTop) => {
  setIsTop(window.scrollY === 0);
};
