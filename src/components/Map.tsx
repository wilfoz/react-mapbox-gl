import { useEffect, useRef } from 'react'
import mapboxgl, { Map as MapPros, LngLatLike} from 'mapbox-gl'

import "../../node_modules/mapbox-gl/dist/mapbox-gl.css"
import { useState } from 'react';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN!

type MapProps = {
    center: LngLatLike
    basemap: string
    zoom: number,
}
export const Map = ({
    center = [0, 0],
    basemap = 'mapbox://styles/mapbox/streets-v11',
    zoom = 12,
}: MapProps) => {
    const mapContainer = useRef<HTMLDivElement>(null)

    const [ map, setMap ] = useState<MapPros>()

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainer.current as any,
            style: basemap,
            center,
            zoom,
        })

        map.on('load', () => {
            setMap(map)
        })

        return () => map.remove()

    }, [])

    useEffect(() => {
        map?.setCenter(center)
    }, [map, center])

    useEffect(() => {
        map?.setZoom(zoom)
    }, [map, zoom])

    return (
        <div ref={mapContainer} style={{ width: "100%", height: "100vh" }}></div>
    )
}