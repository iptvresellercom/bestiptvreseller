/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SMTP_EMAIL: string;
  readonly VITE_SMTP_PASSWORD: string;
  readonly VITE_RECEIVER_EMAIL: string;
  readonly VITE_GEMINI_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}