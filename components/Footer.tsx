export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 会社情報 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Topaz株式会社</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>〒578-0942</p>
              <p>大阪府東大阪市若江本町1-4-28</p>
            </div>
          </div>

          {/* 連絡先情報 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">お問い合わせ</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>
                <span className="font-medium">URL:</span>{" "}
                <a
                  href="https://topaz-inc.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-300 hover:text-blue-200 underline"
                >
                  https://topaz-inc.dev/
                </a>
              </p>
              <p>
                <span className="font-medium">EMAIL:</span>{" "}
                <a
                  href="mailto:info@topaz-inc.dev"
                  className="text-blue-300 hover:text-blue-200 underline"
                >
                  info@topaz-inc.dev
                </a>
              </p>
            </div>
          </div>

          {/* アプリケーション情報 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Vision AI デモ</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>Google Cloud Vision APIを使用した</p>
              <p>画像認識アプリケーション</p>
            </div>
          </div>
        </div>

        {/* コピーライト */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Topaz Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
