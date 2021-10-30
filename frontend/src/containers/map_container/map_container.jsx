import React, { PureComponent, useState, useEffect } from "react";
import ReactMapGL, { Marker, FlyToInterpolator } from "react-map-gl";
import Geocoder from "react-mapbox-gl-geocoder";
import { Container, Col, Row, Button } from "reactstrap";
import { easeCubic } from "d3-ease";
import Axios from "axios";

import "./map_container.css";

const mapStyle = {
  width: "100%",
  height: 600,
};

const mapboxApiKey = process.env.REACT_APP_MAPBOX_TOKEN;

const params = {
  country: "ca",
};

const CustomMarker = ({ isSource, marker }) => {
  return (
    <Marker longitude={marker.longitude} latitude={marker.latitude}>
      <div className="marker">
        <span>
          <b>{isSource ? "S" : "D"}</b>
        </span>
      </div>
    </Marker>
  );
};

const MapView = (props) => {
  let [viewport, setViewPort] = useState({
    latitude: 20.5937,
    longitude: 78.9629,
    zoom: 4,
  });

  let [tempMarker, setTempMarker] = useState(null);
  let [markers, setMarkers] = useState([]);
  let [sourceMarker, setSourceMarker] = useState(null);
  let [destinationMarker, setDestinationMarker] = useState(null);

  let [locationAvailable, setLocationAvailable] = useState(false);

  let [totalCarbonFootprint, setTotalCarbonFootprint] = useState(0);
  let [distance, setDistance] = useState(0);

  const getCurrentLocation = (butttonClick = false) => {
    if ("geolocation" in navigator) {
      setLocationAvailable(true);
      navigator.geolocation.getCurrentPosition(
        (postion) => {
          if (butttonClick) {
            setTempMarker({
              name: "Current Location",
              latitude: postion.coords.latitude,
              longitude: postion.coords.longitude,
            });
          }
          setViewPort({
            longitude: postion.coords.longitude,
            latitude: postion.coords.latitude,
            zoom: 15,
            transitionDuration: butttonClick ? 1000 : 5000,
            transitionInterpolator: new FlyToInterpolator(),
            transitionEasing: easeCubic,
          });
        },
        (err) => {
          console.log(`Location Fetch Error: ${err.message}`);
        },
        { enableHighAccuracy: true }
      );
    } else {
      console.log("Location not available!");
    }
  };

  const getDistance = async () => {
    if (sourceMarker == null || destinationMarker == null) {
      console.log("Need 2 cooridnates");
      return;
    }

    try {
      let response = await Axios.get(
        `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${sourceMarker.longitude},${sourceMarker.latitude};${destinationMarker.longitude},${destinationMarker.latitude}?access_token=${mapboxApiKey}&annotations=distance,duration&sources=0&destinations=1`
      );

      if (response.status == 200) {
        console.log(response.data);

        setDistance(response.data.distances[0][0]);
      } else {
        console.log("Map Box Api Fetch error: " + response.data);
      }
    } catch (err) {
      console.log("Map box distance api error" + err);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const onSelected = (viewport, item) => {
    setTempMarker({
      name: item.place_name,
      longitude: item.center[0],
      latitude: item.center[1],
    });
    setViewPort({
      ...viewport,
      transitionDuration: 5000,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: easeCubic,
    });
  };

  const add = (isSource) => {
    if (isSource) {
      setSourceMarker(tempMarker);
    } else {
      setDestinationMarker(tempMarker);
    }
    setTempMarker(null);
  };

  const changeViewPort = (viewport) => {
    setViewPort(viewport);
  };

  return (
    <Container fluid={true}>
      <Row>
        <Col>
          <h2>Mapbox Tutorial</h2>
        </Col>
      </Row>
      <Row className="py-4">
        <Col xs={2}>
          <Geocoder
            mapboxApiAccessToken={mapboxApiKey}
            onSelected={onSelected}
            viewport={viewport}
            hideOnSelect={true}
            value=""
            // queryParams={params}
          />
        </Col>
        <Col>
          <img
            src="https://img.icons8.com/external-those-icons-fill-those-icons/24/000000/external-gps-maps-and-locations-those-icons-fill-those-icons.png"
            onClick={() => {
              getCurrentLocation(true);
            }}
          />
        </Col>
        <Col>
          <Button
            color="primary"
            onClick={() => {
              add(true);
            }}
          >
            Set Source
          </Button>
        </Col>
        <Col>
          <Button
            color="primary"
            onClick={() => {
              add(false);
            }}
          >
            Set Destination
          </Button>
        </Col>

        <Col>
          <Button color="primary" onClick={getDistance}>
            Get Distance
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <ReactMapGL
            mapboxApiAccessToken={mapboxApiKey}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            {...viewport}
            {...mapStyle}
            onViewportChange={changeViewPort}
          >
            {tempMarker && (
              <Marker
                longitude={tempMarker.longitude}
                latitude={tempMarker.latitude}
              >
                <div className="marker temporary-marker">
                  <span></span>
                </div>
              </Marker>
            )}
            {sourceMarker && (
              <CustomMarker
                key={`marker-source`}
                isSource={true}
                marker={sourceMarker}
              />
            )}
            {destinationMarker && (
              <CustomMarker
                key={`marker-destination`}
                isSource={false}
                marker={destinationMarker}
              />
            )}
          </ReactMapGL>
        </Col>
      </Row>
      <Row>
        <Col>Total Distance: {distance}</Col>
      </Row>
    </Container>
  );
};

export default MapView;
