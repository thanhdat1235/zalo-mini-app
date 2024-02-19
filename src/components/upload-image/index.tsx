import React, { useState } from "react";

interface UploadImageProps {
  onUpload(): void;
  label: string;
  Icon?: React.JSX.Element;
}

const UploadImage = ({ onUpload, label, Icon }: UploadImageProps) => {
  const [fileUrl, setFileUrl] = useState<string>("");

  return (
    <div className="rounded-xl border border-gray/[.5] border-dashed">
      {fileUrl ? (
        <div className="min-h-[100px] px-2 py-4">
          <div className="flex items-center border border-gray/[.2] rounded-xl px-4 py-2">
            <div className="flex items-center flex-1 relative">
              <div className="flex-1 flex justify-center">
                <img src={fileUrl} className="max-h-[400px] object-cover" />
              </div>
              <div
                onClick={() => setFileUrl("")}
                className="absolute top-2 right-2 z-10 bg-background rounded-full"
              >
                {Icon}
              </div>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-black text-[10px]">{label}</span>
          </div>
        </div>
      ) : (
        <div
          className="min-h-[60px] flex items-center justify-center"
          onClick={onUpload}
        >
          <span className="font-medium text-gray">{label}</span>
        </div>
      )}
    </div>
  );
};

export default UploadImage;
