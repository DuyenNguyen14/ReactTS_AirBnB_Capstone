import { ChangeEvent, useRef, useState } from "react";

type Props = {};

export default function useUploadImage() {
  const [selectedImg, setSelectedImg] = useState<string | ArrayBuffer | null>();
  const [hideBtn, setHideBtn] = useState(true);
  const imgRef = useRef<any>();

  let reader = new FileReader();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      let file = e.target.files[0];
      if (
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png"
      ) {
        const src = reader.readAsDataURL(file);
        reader.onload = (e: ProgressEvent<FileReader>) => {
          setSelectedImg(e.target?.result);
        };
        setHideBtn(false);
      }
    }
  };

  const handleCancelUploadImg = () => {
    const fileInp = document.getElementById("hinhAnh") as HTMLInputElement;
    fileInp.value = "";
    setSelectedImg(undefined);
    setHideBtn(true);
  };

  return {
    selectedImg,
    setSelectedImg,
    handleFileChange,
    handleCancelUploadImg,
    imgRef,
    hideBtn,
    setHideBtn,
  };
}
