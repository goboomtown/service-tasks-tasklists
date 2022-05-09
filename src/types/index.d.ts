export {};

interface State {
  createApp: any;
  App: any;
  config: any;
}

declare global {
  interface Window {
    VUETASKS: any;
  }
}
