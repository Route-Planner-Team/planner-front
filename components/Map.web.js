import React, { useEffect, useRef } from "react";

const DEFAULT_CENTER = { lat: 52.46672421135597, lng: 16.927230713146788 };
const DEFAULT_ZOOM = 7;

export const Map = () => {
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) {
            new window.google.maps.Map(ref.current, {
                center: DEFAULT_CENTER,
                zoom: DEFAULT_ZOOM,
                disableDefaultUI: true
            });
        }
    }, [ref]);

    return (
        <div
            ref={ref}
            style={{ width: "100vw", height: "100vh" }}
        />
    );
};
