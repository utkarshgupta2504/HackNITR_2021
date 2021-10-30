import React, { PureComponent, useState, useEffect } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import Geocoder from "react-mapbox-gl-geocoder";
import { Container, Col, Row, Button } from "reactstrap";

import "./map_container.css";

const mapStyle = {
  width: "100%",
  height: 600,
};

const mapboxApiKey = process.env.REACT_APP_MAPBOX_TOKEN;

const params = {
  country: "ca",
};

const CustomMarker = ({ index, marker }) => {
  return (
    <Marker longitude={marker.longitude} latitude={marker.latitude}>
      <div className="marker">
        <span>
          <b>{index + 1}</b>
        </span>
      </div>
    </Marker>
  );
};

const MapView = (props) => {
  let [viewport, setViewPort] = useState({
    latitude: 45.50884,
    longitude: -73.58781,
    zoom: 15,
  });

  let [tempMarker, setTempMarker] = useState(null);
  let [markers, setMarkers] = useState([]);

  useEffect(() => {}, []);

  const onSelected = (viewport, item) => {
    setViewPort(viewport);
    setTempMarker({
      name: item.place_name,
      longitude: item.center[0],
      latitude: item.center[1],
    });
  };

  const add = () => {
    setMarkers((prevState) => {
      return [...prevState, tempMarker];
    });
    setTempMarker(null);
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
          <Button color="primary" onClick={add}>
            Add
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
            onViewportChange={(viewport) => setViewPort(viewport)}
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
            {markers.map((marker, index) => {
              return (
                <CustomMarker
                  key={`marker-${index}`}
                  index={index}
                  marker={marker}
                />
              );
            })}
          </ReactMapGL>
        </Col>
      </Row>
    </Container>
  );
};

export default MapView;
