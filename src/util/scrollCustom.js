export const scrollToTop = () => {
  window.scrollTo(0, 0);
};

export const checkScrollPosition = (ref, setAtStart, setAtEnd) => {
  setAtStart(ref.current.scrollLeft === 0);

  setAtEnd(
    Math.ceil(ref.current.scrollLeft + 1 + ref.current.clientWidth) >=
      ref.current.scrollWidth,
  );
};

export const smoothScroll = (
  direction,
  ref,
  duration = 100,
  scrollDistance,
) => {
  if (!ref?.current) return;

  const start = ref.current.scrollLeft;
  const maxScrollLeft = ref.current.scrollWidth - ref.current.clientWidth;

  // Determine the scroll distance
  let distance = direction === "left" ? -scrollDistance : scrollDistance;

  if (
    direction !== "left" &&
    maxScrollLeft - (Math.ceil(start) + scrollDistance) < 3 &&
    maxScrollLeft - (Math.ceil(start) + scrollDistance) >= 0
  ) {
    distance = ref.current.scrollWidth - start;
  }

  // Clamp the target scroll position within bounds
  const target = Math.min(
    Math.max(0, start + distance), // Ensure it doesn't go below 0
    maxScrollLeft, // Ensure it doesn't exceed maxScrollLeft
  );

  const startTime = performance.now();

  const scroll = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1); // Ensure progress is within [0, 1]

    // Ease-in-out quad easing function
    const ease = (t) => t * (2 - t);
    const easedProgress = ease(progress);

    // Calculate the next scroll position
    ref.current.scrollLeft = start + (target - start) * easedProgress;

    // Continue animation if not yet complete
    if (progress < 1) {
      requestAnimationFrame(scroll);
    }
  };

  requestAnimationFrame(scroll);
};
