import { openMediaPicker } from "zmp-sdk";
import { useState } from "react";

import { BASE_URL } from "services/url";

export enum UploadMediaType {
  ORDER = "ORDER",
  SUBSCRIPTION = "SUBSCRIPTION",
  CUSTOMER = "CUSTOMER",
}

interface UploadMediaProps {
  id: number;
  type: UploadMediaType;
  onSuccess?(): void;
  onError?(): void;
}

interface UploadMediaResponse {
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  filePath?: string;
}

type UploadMediaResponseType = UploadMediaResponse | undefined;

export const uploadMedia = ({
  id,
  type,
  onSuccess,
  onError,
}: UploadMediaProps): UploadMediaResponseType => {
  const [fileResponse, setFileResponse] = useState<UploadMediaResponse>();
  openMediaPicker({
    type: "photo",
    serverUploadUrl: `${BASE_URL}?id=${id}&type=${type}`,
    success: (res) => {
      const { data } = res;
      const result = JSON.parse(data);
      console.log("🚀 ~ file: upload.ts:31 ~ result:", result);

      if (onSuccess) onSuccess();
    },
    fail: (error) => {
      if (onError) onError();

      return null;
    },
  });

  return fileResponse;
};
