const MuteAudio = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      height='24'
      viewBox='0 0 24 24'
      width='24'
      focusable='false'
      aria-hidden='true'
      style={{
        pointerEvents: "none",
        display: "inherit",
      }}
      fill='rgb(255,255,255)'
    >
      <path d='M14 9.71V7.62c2 .46 3.5 2.24 3.5 4.38 0 .58-.13 1.13-.33 1.64l-1.67-1.67c-.02-1.01-.63-1.88-1.5-2.26zM19 12c0 1-.26 1.94-.7 2.77l1.47 1.47C20.54 15.01 21 13.56 21 12c0-4.08-3.05-7.44-7-7.93v2.02c2.83.48 5 2.94 5 5.91zM3.15 3.85l4.17 4.17L6.16 9H3v6h3.16L12 19.93v-7.22l2 2v1.67c.43-.1.83-.27 1.2-.48l1.09 1.09c-.68.45-1.45.78-2.28.92v2.02c1.39-.17 2.66-.71 3.73-1.49l2.42 2.42.71-.71-17-17-.72.7zm8.85.22L9.62 6.08 12 8.46V4.07z'></path>
    </svg>
  );
};
export default MuteAudio;
