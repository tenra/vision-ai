"use client";

import { useState, useCallback, useRef } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import StaticMapGenerator from "./StaticMapGenerator";

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
  const [currentZoom, setCurrentZoom] = useState<number>(18);
  const mapRef = useRef<google.maps.Map | null>(null);

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

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onZoomChanged = useCallback(() => {
    if (mapRef.current) {
      setCurrentZoom(mapRef.current.getZoom() || 18);
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
              onLoad={onLoad}
              onZoomChanged={onZoomChanged}
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
          <div className="mt-6">
            <StaticMapGenerator
              currentLocation={currentLocation}
              currentZoom={currentZoom}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
