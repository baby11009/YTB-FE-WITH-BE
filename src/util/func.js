export const handleClickOutScope = (e, setOpened, ref) => {
  if (ref.current && !ref.current.contains(e.target)) {
    setOpened((prev) => {
      if (typeof prev === "string") {
        return "";
      } else {
        return false;
      }
    });
  }
};

export function getRandomHexColor() {
  // Tạo giá trị số từ 0 đến 16777215 (0xFFFFFF)
  const randomNum = Math.floor(Math.random() * 16777215);
  // Chuyển số đó sang hệ thập lục phân và thêm "#" ở đầu
  return `#${randomNum.toString(16).padStart(6, "0")}`;
}

export const chunkArray = (arr, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }

  return chunks;
};

export function getRandomLinearGradient() {
  const randomColor = () => {
    const r = Math.floor(Math.random() * 256); // Red
    const g = Math.floor(Math.random() * 256); // Green
    const b = Math.floor(Math.random() * 256); // Blue
    return { r, g, b };
  };

  const color = randomColor();

  const color1 = `rgba(${color.r}, ${color.g}, ${color.b},0.800)`;

  const color2 = `rgba(${color.r}, ${color.g}, ${color.b},0.298)`;

  return `linear-gradient(to bottom, ${color1} 0%, ${color2} 33%, rgba(15,15,15,1) 100%)`;
}
