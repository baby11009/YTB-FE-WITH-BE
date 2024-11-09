const CurveArrow = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      focusable='false'
      aria-hidden='true'
      style={{
        pointerEvents: "none",
        display: "inherit",
        width: "100%",
        height: "100%",
        fill: "currentColor",
      }}
    >
      <path fill='none' d='M0 0h24v24H0V0z'></path>
      <path d='M19 15l-6 6-1.42-1.42L15.17 16H4V4h2v10h9.17l-3.59-3.58L13 9l6 6z'></path>
    </svg>
  );
};
export default CurveArrow;
