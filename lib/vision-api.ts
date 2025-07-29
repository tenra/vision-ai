import { ImageAnnotatorClient } from "@google-cloud/vision";

export interface VisionLabel {
  description: string;
  score: number;
}

export interface VisionResult {
  labels: VisionLabel[];
  error?: string;
}

export async function analyzeImage(imageBuffer: Buffer): Promise<VisionResult> {
  try {
    const client = new ImageAnnotatorClient({
      keyFilename: undefined, // 環境変数からAPIキーを使用
      credentials: {
        client_email: "dummy@example.com", // ダミー値
        private_key: "dummy-key", // ダミー値
      },
    });

    // APIキーを直接設定
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_API_KEY environment variable is not set");
    }

    // 画像をbase64エンコード
    const imageBase64 = imageBuffer.toString("base64");

    // Vision APIリクエスト
    const request = {
      image: {
        content: imageBase64,
      },
      features: [
        {
          type: "LABEL_DETECTION" as const,
          maxResults: 10,
        },
      ],
    };

    const [result] = await client.annotateImage(request);

    const labels: VisionLabel[] =
      result.labelAnnotations?.map((label) => ({
        description: label.description || "",
        score: label.score || 0,
      })) || [];

    return { labels };
  } catch (error) {
    console.error("Vision API error:", error);
    return {
      labels: [],
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// 代替実装: fetchを使用したAPI呼び出し
export async function analyzeImageWithFetch(
  imageBuffer: Buffer
): Promise<VisionResult> {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_API_KEY environment variable is not set");
    }

    const imageBase64 = imageBuffer.toString("base64");

    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: imageBase64,
              },
              features: [
                {
                  type: "LABEL_DETECTION",
                  maxResults: 10,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const labels: VisionLabel[] =
      data.responses[0]?.labelAnnotations?.map((label: any) => ({
        description: label.description || "",
        score: label.score || 0,
      })) || [];

    return { labels };
  } catch (error) {
    console.error("Vision API error:", error);
    return {
      labels: [],
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
