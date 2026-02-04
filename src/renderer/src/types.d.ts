declare global {
  interface Window {
    localflow: {
      ping: () => string
    }
  }
}

export {}
