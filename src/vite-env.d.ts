/// <reference types="vite/client" />

// React 18's ImgHTMLAttributes only types the camelCase `fetchPriority`, but
// react-dom 18 only forwards the lowercase HTML attribute name to the DOM.
declare namespace React {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ImgHTMLAttributes<T> {
    fetchpriority?: "high" | "low" | "auto";
  }
}
