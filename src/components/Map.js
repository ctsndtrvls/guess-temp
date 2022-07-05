import { Loader } from "@googlemaps/js-api-loader";
import React, { useEffect, useRef } from "react";

const googleKey = "AIzaSyDlNDdvaxU7q4ASnvXZCgfhlJ7CO7TOEFA";

export const Map = (props) => {
  const lat = props.lat;
  const lng = props.lng;
  console.log("lat: ", lng);
  const googlemap = useRef(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: googleKey,
      version: "weekly"
    });
    let map;
    loader.load().then(() => {
      // @ts-ignore
      const google = window.google;
      map = new google.maps.Map(googlemap.current, {
        center: { lat: lat, lng: lng },
        zoom: 5,
        fullscreenControl: false, // remove the top-right button
        mapTypeControl: false, // remove the top-left buttons
        streetViewControl: false, // remove the pegman
        zoomControl: false
      });
      console.log(googlemap);
      const marker = new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map
      });
    });
  }, [lat, lng]);

  return <div ref={googlemap} style={{ width: "100%", height: "300px" }} />;
};
