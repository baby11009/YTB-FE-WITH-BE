const ShortFullScreen = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      enableBackground='new 0 0 24 24'
      height='24'
      viewBox='0 0 24 24'
      width='24'
      focusable='false'
      aria-hidden='true'
      style={{
        pointerEvents: "none",
        display: "inherit",
        width: "100%",
        height: "100%",
      }}
      fill='currentColor'
    >
      <path d='M5 9H4V4h5v1H5v4zm15-5h-5v1h4v4h1V4zm0 11h-1v4h-4v1h5v-5zM9 19H5v-4H4v5h5v-1z'></path>
    </svg>
  );
};
export default ShortFullScreen;
