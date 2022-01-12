import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { Map as MapPros } from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";
// eslint-disable-next-line import/no-unresolved
import { Filter } from "components/Filter";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN!;

type Layer = {
  id: string;
  type: string;
  source: string;
  paint: any;
  filter?: any;
};

type Source = {
  id?: string;
  type: string;
  data: string;
};

export type MapProps = {
  center: [number, number];
  controls: any[];
  basemap: string;
  zoom: number;
  sources: Source[];
  layers: Layer[];
  filters: any[];
};

export function Map({
  center = [0, 0],
  controls = [],
  filters = [],
  sources = [],
  layers = [],
  basemap = "mapbox://styles/mapbox/outdoors-v11",
  zoom = 12,
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<MapPros>();

  useEffect(() => {
    const mapgl = new mapboxgl.Map({
      container: mapContainer.current as any,
      style: basemap,
      center,
      zoom,
    });

    const navEnabled =
      controls.filter(({ type }) => type === "navigation").length > 0;

    if (navEnabled) {
      const nav = new mapboxgl.NavigationControl();
      mapgl.addControl(nav, "top-right");
    }

    mapgl.on("load", () => {
      setMap(mapgl);
    });

    return () => mapgl.remove();
  }, []);

  useEffect(() => {
    map?.setCenter(center);
  }, [map, center]);

  useEffect(() => {
    map?.setZoom(zoom);
  }, [map, zoom]);

  useEffect(() => {
    const mapReady = map?.isStyleLoaded();
    const dataReady = sources?.length > 0 && layers.length > 0;

    if (mapReady && dataReady) {
      sources.forEach((source) => {
        if (map?.getSource(source.id as string)) return;
        const cleanSource = { ...source };
        if (source.type === "geojson") {
          delete cleanSource.id; // weird hack necessary when working with the geojson source type
        }
        map?.addSource(source.id as string, cleanSource as any);
      });
      layers.forEach((layer) => {
        if (map?.getLayer(layer.id)) {
          map.setFilter(layer.id, layer.filter ? layer.filter : null);
        } else {
          map?.addLayer(layer as any);
        }
      });
    }
  }, [map, sources, layers]);

  return (
    <div ref={mapContainer} style={{ width: "100%", height: "100vh" }}>
      {filters.map(({ layer, options, value, title, onChange }, index) => (
        <Filter
          key={layer}
          id={layer}
          options={options}
          value={value}
          title={title}
          onChange={onChange}
          style={{ left: 15 + 290 * index }}
        />
      ))}
    </div>
  );
}
