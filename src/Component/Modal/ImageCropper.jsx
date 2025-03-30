import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop";
import { useRef, useState } from "react";
import { CloseIcon, PlusIcon } from "../../Assets/Icons";
import { useAuthContext } from "../../Auth Provider/authContext";
import "react-image-crop/dist/ReactCrop.css";
import setCanvasPreview from "../../util/setCanvasPreview";

const ImageCropper = ({
  minWidth = 160,
  minHeight = 160,
  aspectRatio = 1,
  setPreview,
  setData,
}) => {
  const { setIsShowing } = useAuthContext();
  const imgRef = useRef(null);
  const inputRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState();
  const [error, setError] = useState("");
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });


  const onSelectFile = (e) => {
    const file = e.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const imageElement = new Image();
      const imageUrl = reader.result?.toString() || "";
      imageElement.src = imageUrl;

      imageElement.addEventListener("load", (e) => {
        if (error) setError("");
        const { naturalWidth, naturalHeight } = e.currentTarget;
        if (naturalWidth < minWidth || naturalHeight < minHeight) {
          setError(`Image must be at least ${minWidth} x ${minHeight} pixels.`);
          return setImgSrc("");
        } else {
          setImgSrc(imageUrl);
          setImgSize({ width: naturalHeight, height: naturalHeight });
        }
      });
    });
    reader.readAsDataURL(file);
  };

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent =
      ((minWidth * (imgRef?.current?.offsetWidth / imgSize.width)) / width) *
      100;
    // const cropWidthInPercent = (minWidth / width) * 100;
    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      aspectRatio,
      width,
      height,
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

  const handleOnCrop = () => {
    setCanvasPreview(
      imgRef.current, // HTMLImageElement
      previewCanvasRef.current, // HTMLCanvasElement
      convertToPixelCrop(crop, imgRef.current.width, imgRef.current.height),
    );
    const dataUrl = previewCanvasRef.current.toDataURL();
    previewCanvasRef.current.toBlob((blob) => {
      setData(blob);
    });
    setPreview(dataUrl);
    setIsShowing(undefined);
  };

  return (
    <div
      className={`w-[100vw] h-[100vh]  sm:w-[95vw]  sm:h-[95vh] bg-black rounded-[10px] p-[20px] flex flex-col items-center ${
        imgSrc ? "justify-between" : "gap-[32px]"
      }`}
    >
      <div className='flex self-end'>
        <button
          className='size-[40px] rounded-[50%] hover:bg-black-0.1 flex items-center justify-center '
          onClick={() => setIsShowing(undefined)}
        >
          <div className='w-[24px]'>
            <CloseIcon />
          </div>
        </button>
      </div>

      {imgSrc ? (
        <>
          <ReactCrop
            crop={crop}
            onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
            circularCrop={minWidth === minHeight}
            keepSelection
            aspect={aspectRatio}
            minWidth={minWidth * (imgRef?.current?.offsetWidth / imgSize.width)}
            minHeight={
              minHeight * (imgRef?.current?.offsetHeight / imgSize.height)
            }
          >
            <img
              ref={imgRef}
              src={imgSrc}
              draggable={false}
              alt='Upload'
              style={{ maxHeight: `min(65vh,${minHeight}px)` }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
          <div className='flex items-center justify-center gap-[16px]'>
            <button
              className='text-white py-2 px-6 font-[500] rounded-[30px] bg-sky-500 hover:bg-sky-600'
              onClick={() => handleOnCrop()}
            >
              Crop
            </button>
            <button
              className='text-white py-2 px-6 font-[500] rounded-[30px] bg-sky-500 hover:bg-sky-600'
              onClick={() => {
                setImgSrc("");
              }}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <div>
          <label
            className='cursor-pointer w-[85vw] h-[65vh] 2xsm:w-[70vw] md:w-[65vw]  lg:w-[45vw] border-[2px] border-dashed rounded-[10px]
              flex flex-col items-center justify-center p-[12px]'
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();
              inputRef.current.files = e.dataTransfer.files;
              onSelectFile(inputRef.current);
            }}
          >
            <div className='flex flex-col items-center gap-[16px]'>
              <div className='w-[60px]'>
                <PlusIcon />
              </div>
              <span className='text-center'>
                Drag and drop an image here or click to select an image.
              </span>
            </div>
            <input
              type='file'
              accept='image/*'
              ref={inputRef}
              onChange={(e) => {
                onSelectFile(e.target);
              }}
              className='hidden'
            />
          </label>
          {error && <div className='text-red-400  mt-[8px]'>{error}</div>}
        </div>
      )}
      {crop && (
        <canvas
          ref={previewCanvasRef}
          style={{
            display: "none",
            border: "1px solid black",
            objectFit: "contain",
            width: minWidth * (imgRef?.current?.offsetWidth / imgSize.width),
            height:
              minHeight * (imgRef?.current?.offsetHeight / imgSize.height),
          }}
        />
      )}
    </div>
  );
};
export default ImageCropper;
