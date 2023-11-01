import React, {useEffect, useImperativeHandle, useRef, useState} from "react";

const DEFAULT_CENTER = {lat: 52.46672421135597, lng: 16.927230713146788};
const DEFAULT_ZOOM = 7;

export const Map = React.forwardRef((props, ref) => {
    const mapRef = useRef(null);
    let mapInstanceRef = useRef(null);
    let [focusMarker, setFocusMarker] = useState(null);
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
                focusMarker?.setMap(null);

                setFocusMarker(new window.google.maps.Marker({
                    map: mapInstanceRef.current,
                    position: coordinates
                }));

                mapInstanceRef.current.panTo(coordinates);
            }
        },
    }));

    return (
        <div
            ref={mapRef}
            style={{width: "100vw", height: "100vh"}}
        />
    );
});
