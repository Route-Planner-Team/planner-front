import React, {useEffect, useImperativeHandle, useRef, useState} from "react";
import {useTheme} from "react-native-paper";

const DEFAULT_CENTER = {lat: 52.46672421135597, lng: 16.927230713146788};
const DEFAULT_ZOOM = 7;

export const Map = React.forwardRef((props, ref) => {
    const mapRef = useRef(null);
    let mapInstanceRef = useRef(null);
    const [previousFocusMarker, setPreviousFocusMarker] = useState(null);
    const [previousPolyline, setPreviousPolyline] = useState(null);
    const [previousDestinationMarkers, setPreviousDestinationMarkers] = useState([]);
    const {colors} = useTheme();
    let markers = []

    useEffect(() => {
        if (mapRef.current) {
            mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
                center: DEFAULT_CENTER,
                zoom: DEFAULT_ZOOM,
                disableDefaultUI: true
            });
        }
    }, [mapRef]);

    useImperativeHandle(ref, () => ({
        setFocus: (coordinates) => {
            if (mapInstanceRef.current) {

                // remove focus marker if exists
                previousFocusMarker?.setMap(null);

                setPreviousFocusMarker(new window.google.maps.Marker({
                    map: mapInstanceRef.current,
                    position: coordinates,
                }));

                mapInstanceRef.current.panTo(coordinates);
            }
        },
        drawPolyline: (polylinePath) => {
            if (mapInstanceRef.current)
            {
                // remove polyline if exists
                previousPolyline?.setMap(null);

                const polyline = new window.google.maps.Polyline({
                    path: polylinePath,
                    geodesic: true,
                    strokeColor: colors.primary,
                    strokeOpacity: 1.0,
                    strokeWeight: 4,
                });

                setPreviousPolyline(polyline);

                polyline.setMap(mapInstanceRef.current);
            }
        },
        drawDestinationMarkers: (coords) => {
            previousDestinationMarkers.map(x => x.setMap(null));

            var markers = coords.map((x, idx) => {return new window.google.maps.Marker({
                map: mapInstanceRef.current,
                position: x,
                icon: `https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=${idx}|6750A4|000000`
            })});

            setPreviousDestinationMarkers(markers);
        },
        panTo: (coordinates) => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.panTo(coordinates);
            }
        }
    }));

    return (
        <div
            ref={mapRef}
            style={{width: "100vw", height: "100vh"}}
        />
    );
});
