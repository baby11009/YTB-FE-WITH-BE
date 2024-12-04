export const getMousePosition = (e, button) => {
  const { clientX } = e;
  const buttonRect = button.getBoundingClientRect();
  const clickX = clientX - buttonRect.left;
  button.style.setProperty("--scale", 1);

  const buttonWidth = buttonRect.width;
  if (clickX < buttonWidth / 3) {
    button.style.setProperty("--origin", "left");
  } else if (clickX > buttonWidth * (2 / 3)) {
    button.style.setProperty("--origin", "right");
  } else {
    button.style.setProperty("--origin", "center");
  }
};
