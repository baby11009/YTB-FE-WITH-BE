const CustomeFuncBtn = ({
  data,
  currentId,
  setOpened,
  productData,
  productIndex,
}) => {
  return (
    <div
      className={`flex items-center h-[40px] px-[16px] py-[2px] cursor-pointer
        ${
          currentId === data.id
            ? "bg-hover-black hover:bg-[rgba(255,255,255,0.2)]"
            : "hover:bg-hover-black"
        } `}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        setOpened(false);
        if (data.handleOnClick) {
          data.handleOnClick(data, productData, productIndex);
        }
      }}
    >
      {data.icon && (
        <div className='mr-[16px] w-[24px] text-white-F1'>{data.icon}</div>
      )}
      <div
        className={`text-[14px] leading-[20px] text-nowrap ${
          data.icon && "mr-[24px]"
        } `}
      >
        {data.text}
      </div>
    </div>
  );
};

const CustomeFuncBox = ({
  style,
  setOpened,
  currentId,
  funcList1,
  funcList2,
  productData,
  productIndex,
  size,
}) => {
  return (
    <div
      className={`absolute bg-[#282828] rounded-[12px] z-[2000] py-[8px]
        ${style}
    `}
    >
      <div className='flex flex-col overflow-hidden'>
        {funcList1 &&
          funcList1.map((item) => {
            if (
              typeof item.condition === "function" &&
              item.condition(productIndex, size)
            ) {
              return null;
            } else if (item.condition) {
              return null;
            }

            return (
              <CustomeFuncBtn
                key={item.id}
                data={item}
                currentId={currentId}
                setOpened={setOpened}
                productData={productData}
                productIndex={productIndex}
              />
            );
          })}
        {funcList2 && (
          <hr className='border-[rgba(255,255,255,0.2)] my-[8px]' />
        )}
        {funcList2 &&
          funcList2.map((item) => {
            if (
              typeof item.condition === "function" &&
              item.condition(productIndex, size)
            ) {
              return null;
            } else if (typeof item.condition === "boolean" && item.condition) {
              return null;
            }

            return (
              <CustomeFuncBtn
                key={item.id}
                data={item}
                currentId={currentId}
                setOpened={setOpened}
                productData={productData}
                productIndex={productIndex}
              />
            );
          })}
      </div>
    </div>
  );
};
export default CustomeFuncBox;
