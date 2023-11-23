import React from "react";
import {Wrapper} from "@googlemaps/react-wrapper";
import config from "../config";

export const GoogleMapsWrapper = ({children}) => {
    const apiKey = config.googleAPIKey;

    if (!apiKey) {
        return <div>Cannot display the map: google maps api key missing</div>;
    }

    return <Wrapper apiKey={apiKey}>{children}</Wrapper>;
};
