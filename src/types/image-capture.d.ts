// TypeScript lib.dom.d.ts does not include grabFrame() — extend the interface
interface ImageCapture {
  grabFrame(): Promise<ImageBitmap>;
}
