declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_ACCESS_TOKEN?: string;
    }
  }
}

export {};
