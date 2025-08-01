"use client";

import { useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

interface MapLocation {
  lat: number;
  lng: number;
  name: string;
}

const containerStyle = {
  width: "100%",
  height: "400px",
};

// 東京の中心座標
const tokyoCenter = { lat: 35.6762, lng: 139.6503 };

// デフォルトのピンを追加（東京タワー）
const defaultLocation: MapLocation = {
  lat: 35.6586,
  lng: 139.7454,
  name: "東京タワー",
};

export default function MapsStatic() {
  const [currentLocation, setCurrentLocation] = useState<MapLocation>({
    lat: 35.6586,
    lng: 139.7454,
    name: "東京タワー",
  });

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "",
  });

  const onMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const location: MapLocation = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        name: "クリックした位置",
      };
      setCurrentLocation(location);
    }
  }, []);

  const handleLocationClick = (location: MapLocation) => {
    setCurrentLocation(location);
  };

  const predefinedLocations: MapLocation[] = [
    { lat: 35.6586, lng: 139.7454, name: "東京タワー" },
    { lat: 35.6586, lng: 139.7016, name: "東京スカイツリー" },
    { lat: 35.6762, lng: 139.6503, name: "新宿駅" },
    { lat: 35.6812, lng: 139.7671, name: "東京駅" },
    { lat: 35.6586, lng: 139.7454, name: "渋谷駅" },
  ];

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              静的マップ作成デモ
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Google Maps JavaScript APIを使用した動的マップ表示
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-center h-96">
              <div className="text-gray-500">地図を読み込み中...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            静的マップ作成デモ
          </h1>
        </div>

        {/* メインコンテンツ */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* マップ表示エリア */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={{ lat: currentLocation.lat, lng: currentLocation.lng }}
              zoom={18}
              onClick={onMapClick}
            >
              {/* 現在のピン */}
              <Marker
                position={{
                  lat: currentLocation.lat,
                  lng: currentLocation.lng,
                }}
                title={currentLocation.name}
                animation={google.maps.Animation.DROP}
              />
            </GoogleMap>
          </div>

          {/* 座標情報 */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 選択された位置 */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-blue-800 font-medium mb-2">選択された位置</h3>
              <div className="text-sm text-blue-700">
                <p>
                  <strong>緯度:</strong> {currentLocation.lat.toFixed(6)}
                </p>
                <p>
                  <strong>経度:</strong> {currentLocation.lng.toFixed(6)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
