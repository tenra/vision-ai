import { ImageAnnotatorClient } from "@google-cloud/vision";

export interface VisionLabel {
  description: string;
  score: number;
}

export interface VisionObject {
  name: string;
  score: number;
  boundingPoly: {
    vertices: Array<{ x: number; y: number }>;
  };
}

export interface VisionText {
  text: string;
  confidence: number;
  boundingBox: {
    vertices: Array<{ x: number; y: number }>;
  };
}

export interface VisionResult {
  labels: VisionLabel[];
  objects: VisionObject[];
  texts: VisionText[];
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
        {
          type: "OBJECT_LOCALIZATION" as const,
          maxResults: 10,
        },
        {
          type: "DOCUMENT_TEXT_DETECTION" as const,
        },
      ],
    };

    const [result] = await client.annotateImage(request);

    const labels: VisionLabel[] =
      result.labelAnnotations?.map((label) => ({
        description: label.description || "",
        score: label.score || 0,
      })) || [];

    const objects: VisionObject[] =
      result.localizedObjectAnnotations?.map((obj) => ({
        name: obj.name || "",
        score: obj.score || 0,
        boundingPoly: {
          vertices:
            obj.boundingPoly?.normalizedVertices?.map((vertex) => ({
              x: vertex.x || 0,
              y: vertex.y || 0,
            })) || [],
        },
      })) || [];

    const texts: VisionText[] = [];
    if (result.fullTextAnnotation?.pages) {
      result.fullTextAnnotation.pages.forEach((page) => {
        page.blocks?.forEach((block) => {
          block.paragraphs?.forEach((paragraph) => {
            paragraph.words?.forEach((word) => {
              const text =
                word.symbols?.map((symbol) => symbol.text).join("") || "";
              if (text.trim()) {
                const boundingBox =
                  word.boundingBox?.vertices?.map((vertex) => ({
                    x: vertex.x || 0,
                    y: vertex.y || 0,
                  })) || [];
                texts.push({
                  text,
                  confidence: word.confidence || 0,
                  boundingBox: { vertices: boundingBox },
                });
              }
            });
          });
        });
      });
    }

    return { labels, objects, texts };
  } catch (error) {
    console.error("Vision API error:", error);
    return {
      labels: [],
      objects: [],
      texts: [],
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
                  maxResults: 30,
                },
                {
                  maxResults: 30,
                  type: "OBJECT_LOCALIZATION",
                },
                {
                  maxResults: 30,
                  type: "DOCUMENT_TEXT_DETECTION",
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
      data.responses[0]?.labelAnnotations?.map(
        (label: { description?: string; score?: number }) => ({
          description: label.description || "",
          score: label.score || 0,
        })
      ) || [];

    const objects: VisionObject[] =
      data.responses[0]?.localizedObjectAnnotations?.map(
        (obj: {
          name?: string;
          score?: number;
          boundingPoly?: {
            normalizedVertices?: Array<{ x?: number; y?: number }>;
          };
        }) => ({
          name: obj.name || "",
          score: obj.score || 0,
          boundingPoly: {
            vertices:
              obj.boundingPoly?.normalizedVertices?.map((vertex) => ({
                x: vertex.x || 0,
                y: vertex.y || 0,
              })) || [],
          },
        })
      ) || [];

    const texts: VisionText[] = [];
    if (data.responses[0]?.fullTextAnnotation?.pages) {
      data.responses[0].fullTextAnnotation.pages.forEach(
        (page: {
          blocks?: Array<{
            paragraphs?: Array<{
              words?: Array<{
                symbols?: Array<{ text?: string }>;
                confidence?: number;
                boundingBox?: { vertices?: Array<{ x?: number; y?: number }> };
              }>;
            }>;
          }>;
        }) => {
          page.blocks?.forEach((block) => {
            block.paragraphs?.forEach((paragraph) => {
              paragraph.words?.forEach((word) => {
                const text =
                  word.symbols?.map((symbol) => symbol.text).join("") || "";
                if (text.trim()) {
                  const boundingBox =
                    word.boundingBox?.vertices?.map((vertex) => ({
                      x: vertex.x || 0,
                      y: vertex.y || 0,
                    })) || [];
                  texts.push({
                    text,
                    confidence: word.confidence || 0,
                    boundingBox: { vertices: boundingBox },
                  });
                }
              });
            });
          });
        }
      );
    }

    return { labels, objects, texts };
  } catch (error) {
    console.error("Vision API error:", error);
    return {
      labels: [],
      objects: [],
      texts: [],
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
