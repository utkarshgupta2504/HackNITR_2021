
import React, { PureComponent, useState, useEffect } from "react";
import ReactMapGL, { Marker, FlyToInterpolator } from "react-map-gl";
import { useHistory } from "react-router-dom";

import "react-notifications/lib/notifications.css";
// import auth from "utils/auth";
import auth from "utils/auth";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import swal from "sweetalert"
import Geocoder from "react-mapbox-gl-geocoder";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Modal,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  FormFeedback,
  Container,
  Row,
  // Label,
  Col,
  // CardTitle,
  Alert,
} from "reactstrap";
import { easeCubic } from "d3-ease";
import Axios from "axios";

import "./map_container.css";
import Header from "components/Headers/Header";
var axios = require("axios");
var qs = require("qs");

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
  <NotificationContainer />;
  let [viewport, setViewPort] = useState({
    latitude: 20.5937,
    longitude: 78.9629,
    zoom: 4,
  });
  let [modal_visibile, setModal] = useState(false);
  let [c02, setC02] = useState(0);
  let [trees, setTrees] = useState(0);
  let [treesAnnual, setTreesAnnual] = useState(0);

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
      NotificationManager.error(
        "Need the start and destination cooridnates both",
        "Error!",
        5000,
        () => {}
      );
      console.log("e");
      return;
    }

    try {
      let response = await Axios.get(
        `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${sourceMarker.longitude},${sourceMarker.latitude};${destinationMarker.longitude},${destinationMarker.latitude}?access_token=${mapboxApiKey}&annotations=distance,duration&sources=0&destinations=1`
      );

      if (response.status == 200) {
        console.log(response.data);

        setDistance(response.data.distances[0][0]);
        setModal(true);
        var data = qs.stringify({
          distance: { distance },
        });
        var config = {
          method: "post",
          url: "https://vast-bastion-90714.herokuapp.com/api/carbon-calculator/calculate",
          headers: {
            "x-access-token": auth.getToken(),
            //   'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjE3ZDVkMzI2ZDJmZTU2MWVkOWEyYzkxIiwiZW1haWwiOiJzYW1hcnRoYXJvcmExNzZAZ21haWwuY29tIiwiaWF0IjoxNjM1NjA2MjQ1LCJleHAiOjE2MzU2MTM0NDV9.jTB5E7CEIKByFo_SLvEJ6H-vwUlSVg1nf7btJ1YYPJ0',
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data: data,
        };

        axios(config)
          .then(function (response) {
            console.log(response.data);
            // console.log()
            setC02(response.data["emmision-value"]);
            setTrees(response.data["baby-trees-saved"]);
            setTreesAnnual(response.data["annual-trees-saved"]);
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        console.log("Map Box Api Fetch error: " + response.data);
      }
    } catch (err) {
      console.log("Map box distance api error" + err);
    }
  };
  const history = useHistory()
  useEffect(() => {
    getCurrentLocation();
  }, []);
  const addTrees = ()=>{
    //   axios
     setModal(!modal_visibile);
     var data = qs.stringify({
        'qty': trees,
        'id': auth.getUserInfo()._id,
        'email': auth.getUserInfo().email,
        'token': auth.getToken() 
      });
      var config = {
        method: 'post',
        url: 'https://vast-bastion-90714.herokuapp.com/user/add-trees',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
      };
      
      axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        swal(
            "Hurray!!",
            "Saved Trees Added to your name",
            "success"
          ).then((value) => {
            history.push("/admin");
          });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

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
    <>
      <Container fluid={true}>
        <Row>
          <Col>
            <h2 style={{ color: "white" }}>.</h2>
          </Col>
        </Row>

        <Row className="py-4" style={{ zIndex: "999" }}>
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
              alt=""
              src="https://img.icons8.com/external-those-icons-fill-those-icons/24/000000/external-gps-maps-and-locations-those-icons-fill-those-icons.png"
              onClick={() => {
                getCurrentLocation(true);
              }}
            />
          </Col>
          <Col>
            <Button
              color="success"
              onClick={() => {
                add(true);
              }}
            >
              Set Source
            </Button>
          </Col>
          <Col>
            <Button
              color="success"
              onClick={() => {
                add(false);
              }}
            >
              Set Destination
            </Button>
          </Col>

          <Col>
            <Button color="success" onClick={getDistance}>
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
      </Container>
      <Modal className="modal-dialog-centered" isOpen={modal_visibile}>
        <div className="modal-header">
          <h5 className="modal-title" id="ModalLabel">
            Trip Stats
          </h5>
          <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={() => setModal(!modal_visibile)}
          >
            <span aria-hidden={true}>×</span>
          </button>
        </div>
        <div className="modal-body">
          <h4>Total Distance to Destination: {distance}</h4>
          <h4 className="h4 text-danger" color="danger">
            Tonnes of CO2 emmision: {c02}
          </h4>
          <h4 className="h4 text-success" color="danger">
            Number of baby trees saved if you take the metro: {trees.toFixed(4)}
          </h4>
          <h4 className="h4 text-success" color="danger">
            Number of baby trees saved annually if you make it a habit:{" "}
            {treesAnnual.toFixed(4)}
          </h4>
        </div>
        <div className="modal-footer">
          <Button
            color="success"
            type="button"
            onClick={() => setModal(!modal_visibile)}
          >
            I'll save the Trees
          </Button>
          <Button
            color="danger"
            type="button"
            onClick={() => setModal(!modal_visibile)}
          >
            No, I'll drive
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default MapView;
