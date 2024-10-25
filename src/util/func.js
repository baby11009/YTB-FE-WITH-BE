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
