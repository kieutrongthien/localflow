declare global {
  interface Window {
    localflow: {
      ping: () => string
      getVersion: () => Promise<string>
    }
  }
}

export {}
