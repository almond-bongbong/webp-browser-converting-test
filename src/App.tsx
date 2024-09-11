import "./App.css";
import { encode } from "@jsquash/webp";

// File을 ImageData로 변환하는 함수
const fileToImageData = (file: File): Promise<ImageData> =>
  new Promise((resolve, reject) => {
    const img = new Image();

    // 이미지 로드 완료 시
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      // 캔버스 컨텍스트 생성 실패 시
      if (!ctx) {
        reject(new Error("캔버스 컨텍스트를 생성할 수 없습니다."));
        return;
      }

      ctx.drawImage(img, 0, 0);
      resolve(ctx.getImageData(0, 0, img.width, img.height));
    };

    // 이미지 로드 실패 시
    img.onerror = reject;

    // 이미지 로드
    img.src = URL.createObjectURL(file);
  });

const formatFileSize = (size: number) => {
  const units = ["B", "KB", "MB", "GB"];
  let unitIndex = 0;
  let sizeInUnits = size;

  while (sizeInUnits >= 1024 && unitIndex < units.length - 1) {
    sizeInUnits /= 1024;
    unitIndex++;
  }

  return `${sizeInUnits.toFixed(2)} ${units[unitIndex]}`;
};

function App() {
  /**
   * 파일 변경 시
   * @param e 파일 변경 이벤트
   */
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("Original file size:", formatFileSize(file.size));

    const imageData = await fileToImageData(file);
    const webp = await encode(imageData, {
      quality: 80,
    });

    console.log("WebP file size:", formatFileSize(webp.byteLength));
  };

  return (
    <div>
      <h1>WebP Converting Test</h1>

      <p>Example page for webp converting test with @jsquash/webp</p>

      <label>
        <input type="file" accept="image/*" onChange={handleChange} />
      </label>
    </div>
  );
}

export default App;
