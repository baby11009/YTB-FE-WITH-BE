import { useState, useEffect, memo } from "react";

const CheckBox2 = ({ noAnimation, checked, setChecked }) => {
  const [active, setActive] = useState(false);

  const [firstRender, setFirstRender] = useState(true);

  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }
    setActive(true);
    let timeOut = setTimeout(() => {
      setActive(false);
    }, 300);

    return () => {
      clearTimeout(timeOut);
    };
  }, [clicked]);

  return (
    <div className='relative'>
      <div
        className={`size-[20px] rounded-[2px] border-[2px] relative z-[30] cursor-pointer
        ${!checked ? " border-white" : "bg-blue-3E border-transparent"}
        `}
        onMouseDown={() => setClicked(true)}
        onMouseUp={() => setClicked(false)}
        onClick={async () => {
          if (setChecked) {
            if (setChecked instanceof Promise) {
              await setChecked();
            } else {
              setChecked();
            }
          }
        }}
      >
        {checked && <div className='check-mark'></div>}
      </div>

      {active && !noAnimation && (
        <div
          className={`absolute top-[-17px] left-[-17px] size-[54px] rounded-[50%] opacity-[0.3] z-[20] ping
            ${!checked ? "bg-blue-3E" : "bg-white-F1"}
            `}
        ></div>
      )}
    </div>
  );
};
export default memo(CheckBox2);
