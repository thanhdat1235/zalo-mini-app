const config = {
  MODE: import.meta.env.VITE_MODE,
  BASE_URL: import.meta.env.VITE_BASE_URL,
  MEASUREMENT_ID: import.meta.env.VITE_MEASUREMENT_ID,
  MEASUREMENT_PROTOCOL: import.meta.env.VITE_MEASUREMENT_PROTOCOL,
  OA_ID: import.meta.env.VITE_OA_ID,
  VITE_HOTLINE: import.meta.env.VITE_HOTLINE,
  SECRET_ZALO_KEY: import.meta.env.VITE_SECRET_ZALO_KEY,
};

export default config;
