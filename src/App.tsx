// eslint-disable-next-line import/no-unresolved
import { Map } from "components/Map";
import React, { useState, useEffect } from "react";

const mapDefaults = {
  basemap: "mapbox://styles/mapbox/outdoors-v11",
  center: [-111.65, 40.581],
  controls: [{ id: "nav", type: "navigation" }],
  zoom: 12,
};

const Sources = [
  {
    id: "avalanche-paths",
    type: "geojson",
    data: "https://opendata.arcgis.com/datasets/0df199cef1704e5287ae675ee3dbd3bd_0.geojson",
  },
  {
    id: "ski-lifts",
    type: "geojson",
    data: "https://opendata.arcgis.com/datasets/51d8a963411d4356ab3fa7a24146d203_0.geojson",
  },
];

const Layers = [
  {
    id: "avalanche-paths-fill",
    type: "fill",
    source: "avalanche-paths",
    paint: {
      "fill-opacity": 0.5,
      "fill-color": "#f05c5c",
    },
  },
  {
    id: "ski-lifts-line",
    type: "line",
    source: "ski-lifts",
    paint: {
      "line-color": "#403965",
      "line-width": 2.5,
    },
  },
];

type Filter = {
  layer: string;
  field: string;
  title: string;
  options: [
    {
      value: string;
      label: string;
    },
    { value: string; label: string },
    {
      value: string;
      label: string;
    },
    { value: string; label: string }
  ];
  value: any[];
  onChange: (layer: string, val: string | number) => void;
};

const updateFilterValues = (
  existingFilters: any[],
  layerId: string,
  value: string | number
) =>
  existingFilters.map((filter) => {
    if (filter.layer === layerId) {
      const newValues = [...filter.value];
      if (newValues.includes(value)) {
        const index = newValues.indexOf(value);
        newValues.splice(index, 1);
      } else {
        newValues.push(value);
      }
      return {
        ...filter,
        value: newValues,
      };
    }
    return filter;
  });

function App() {
  const [sources] = useState(Sources);
  const [layers, setLayers] = useState(Layers);
  const [filters, setFilters] = useState<Filter[]>([
    {
      layer: "ski-lifts-line",
      field: "RESORT",
      title: "Ski Resort",
      options: [
        {
          value: "Snowbird Ski and Summer Resort",
          label: "Snowbird Ski and Summer Resort",
        },
        { value: "Alta Ski Area", label: "Alta Ski Area" },
        {
          value: "Solitude Mountain Resort",
          label: "Solitude Mountain Resort",
        },
        { value: "Brighton Ski Resort", label: "Brighton Ski Resort" },
      ],
      value: [],
      onChange: (layer: string, val: string | number) => {
        setFilters((updatedFilters) =>
          updateFilterValues(updatedFilters, layer, val)
        );
      },
    },
    {
      layer: "avalanche-paths-fill",
      field: "RETURN_INTERVAL",
      title: "Avalanche Frequency",
      options: [
        { value: "INFREQUENT", label: "Infrequent" },
        { value: "OCCASIONAL", label: "Occasional" },
        { value: "OCCASIONAL TO FREQUENT", label: "Occasional to Frequent" },
        { value: "FREQUENT", label: "Frequent" },
      ],
      value: [],
      onChange: (layer, val) => {
        setFilters((updatedFilters) =>
          updateFilterValues(updatedFilters, layer, val)
        );
      },
    },
  ]);

  useEffect(() => {
    setLayers((s) =>
      s.map((layer) => {
        const updatedLayer = { ...layer };
        const filter = filters.find(
          (updatedFilters) => updatedFilters.layer === layer.id
        );
        if (!filter) return updatedLayer;
        const { field, value } = filter;
        if (value.length > 0) {
          (updatedLayer as any).filter = [
            "all",
            ["match", ["get", field], [...value], true, false],
          ];
        } else {
          delete (updatedLayer as any).filter;
        }
        return updatedLayer;
      })
    );
  }, [filters]);

  return (
    <Map
      basemap={mapDefaults.basemap}
      center={mapDefaults.center as [number, number]}
      controls={mapDefaults.controls}
      filters={filters}
      layers={layers}
      sources={sources}
      zoom={mapDefaults.zoom}
    />
  );
}

export default App;
