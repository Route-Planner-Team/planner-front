import React, {useEffect, useImperativeHandle, useRef} from "react";

const DEFAULT_CENTER = { lat: 52.46672421135597, lng: 16.927230713146788 };
const DEFAULT_ZOOM = 7;

export const Map = React.forwardRef((props, ref) => {
    const mapRef = useRef(null);
    let mapInstanceRef = useRef(null);

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
            mapInstanceRef.current?.panTo(coordinates);
        }
    }));

    return (
        <div
            ref={mapRef}
            style={{ width: "100vw", height: "100vh" }}
        />
    );
});
