export const IsEnd = (setIsEnd) => {
  const documentHeight = document.documentElement.scrollHeight;
  // The current vertical position of the scroll bar
  const scrollTop = window.scrollY;
  // The height of the viewport
  const viewportHeight = window.innerHeight;

  // Check if the scroll position is at the bottom of the page
  setIsEnd(Math.ceil(scrollTop + viewportHeight) >= documentHeight);
};
export const IsElementEnd = (setIsEnd, element) => {

  const scrollHeight = element.target.scrollHeight;
  const scrollTop = element.target.scrollTop;
  const clientHeight = element.target.clientHeight;

  setIsEnd(Math.ceil(clientHeight + scrollTop) >= scrollHeight);
};

export const IsTop = (setIsTop) => {
  setIsTop(window.scrollY === 0);
};
