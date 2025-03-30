import { CheckIcon } from "../../Assets/Icons";

const CustomeFuncBtn = ({
  data,
  useCheckIcon,
  currentId,
  setOpened,
  productData,
  productIndex,
}) => {
  return (
    <div
      className={`flex items-center h-[40px] px-[16px] py-[2px] cursor-pointer w=full
        ${
          currentId === data.id && !useCheckIcon
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
      {useCheckIcon && currentId === data.id && (
        <div className='w-[24px] ml-auto'>
          <CheckIcon />
        </div>
      )}
    </div>
  );
};

const CustomeFuncBox = ({
  style,
  useCheckIcon,
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
              typeof item.renderCondition === "function" &&
              !item.renderCondition(productIndex, size)
            ) {
              return null;
            } else if (
              typeof item.renderCondition === "boolean" &&
              !item.renderCondition
            ) {
              return null;
            }

            return (
              <CustomeFuncBtn
                key={item.id}
                data={item}
                useCheckIcon={useCheckIcon}
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
              typeof item.renderCondition === "function" &&
              item.renderCondition(productIndex, size)
            ) {
              return null;
            } else if (
              typeof item.renderCondition === "boolean" &&
              !item.renderCondition
            ) {
              return null;
            }

            return (
              <CustomeFuncBtn
                key={item.id}
                data={item}
                useCheckIcon={useCheckIcon}
                currentId={currentId}
                setOpened={setOpened}
                productData={productData}
                productIndex={productIndex}
              />
            );
          })}
      </div>

      {funcList1.length < 1 && (!funcList2 || funcList2.length < 1) && (
        <div className='text-center  h-[40px] w-full px-[16px] py-[8px] select-none'>
          No data matched
        </div>
      )}
    </div>
  );
};
export default CustomeFuncBox;
