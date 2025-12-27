declare module '*.css';
declare module '*.scss';
declare module '*.sass';

// global.d.ts
export {};

declare global {
  interface Window {
    electron?: {
      print: (text: string) => void;
    };
  }
}
