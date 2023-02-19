declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PUBLIC_KEY?: string;
      SECRET_KEY?: string;
      SERVER_PUBLIC_KEY?: string;
      PUMP_ASSOCIATED?: string;
    }
  }
}

export {};
