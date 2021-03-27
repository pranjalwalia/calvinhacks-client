import React, { useState, useEffect } from "react";
import MapGL, { GeolocateControl, Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import marker from "./../assets/marker.png";
import axios from "axios";
import {
  Dropdown,
  InputGroup,
  FormControl,
  DropdownButton,
} from "react-bootstrap";
import { routes } from "../utils/Mapper";

import VerticleModal from "./VerticleModal";

const TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const geolocateStyle = {
  float: "left",
  margin: "50px",
  padding: "10px",
};

//++++++++++++++++++++++++++++++++++++
const university = [
  {
    name: "Arts & Science College",
    covidRating: "3.2",
  },
  {
    name: "Training and Placement",
    covidRating: "1.5",
  },
  {
    name: "Jawahar Navodaya Vidyalaya",
    covidRating: "2.5",
  },
  {
    name: "SRR Junior College",
    covidRating: "4",
  },
];

const Food = [
  {
    name: "Cream Stone",
    covidRating: "3",
  },
  {
    name: "Ramesh TeaShop",
    covidRating: "2.5",
  },
  {
    name: "Subway",
    covidRating: "3",
  },
  {
    name: "Mainland for Veggies",
    covidRating: "2.2",
  },
  {
    name: "FoodLand Restaurant",
    covidRating: "4.6",
  },
  {
    name: "Baba Tiffins",
    covidRating: "5",
  },
];

let dataToSend;

export const Map = () => {
  const [viewport, setViewPort] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 0,
    longitude: 0,
    zoom: 2,
  });

  const [foundLocations, setFoundLocations] = useState([]);
  const [fourSquareResponse, SetFourSquareResponse] = useState([]);
  const [currentRoute, setCurrentRoute] = useState();

  useEffect(() => {
    getSights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRoute]);

  useEffect(() => {
    //* idhar dekho bro
    console.log(fourSquareResponse);
    // postApiResponseToDb(fourSquareResponse);
    fetchNearByRatings(fourSquareResponse);
  }, [fourSquareResponse]);

  useEffect(() => {
    console.log(foundLocations);
  }, [foundLocations]);

  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleMapClick = async (e) => {
    const [longitude, latitude] = e.lngLat;
    setViewPort(
      (prevState) => ({
        ...viewport,
        latitude: latitude,
        longitude: longitude,
        zoom: prevState.zoom < 16 ? prevState.zoom + 2 : prevState.zoom,
      }),
      () => {
        getSights();
      }
    );
    // getSights();
    handleShowModal();
    // await this.props.showModal({ latitude, longitude });
  };

  const fetchNearByRatings = async (data) => {
    data.forEach(async (element) => {
      try {
        const fourSquareId = element.id;
        const body = { fourSquareId: fourSquareId };
        const url = "http://localhost:5000/location/" + element.id;
        const res = await axios.get(url);
        console.log(res.date.place);
      } catch (err) {
        console.log(err);
      }
    });
  };

  const postApiResponseToDb = async (data) => {
    data.forEach(async (element) => {
      try {
        const options = {
          body: {
            fourSquareId: element.id,
            latitude: element.location.lat,
            longitude: element.location.lng,
            name: element.name,
          },
        };
        const res = await axios.post("http://localhost:5000/location", options);
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    });
  };

  const getSights = async () => {
    if (viewport.latitude && viewport.longitude && currentRoute) {
      const baseURL = "https://api.foursquare.com/v2/venues/search?";
      const params = {
        client_id: "SUFVHQILGHMPEPHBJIOJOMNXA5ZQUDY4YI1JQZHXWLMH2MDA",
        client_secret: "RG45BFLYYVBAE0TNJHBTJ1513RRSJXZBXJJV01TXF3UUILKL",
        ll: viewport.latitude + "," + viewport.longitude,
        v: "20182507",
        categoryId: currentRoute,
        radius: 10000,
      };
      try {
        const data = await axios.get(baseURL + new URLSearchParams(params));
        console.log(baseURL + new URLSearchParams(params));
        console.log(currentRoute);

        const venues = data.data.response.venues;
        SetFourSquareResponse(venues);
        // handleShowModal();
        // console.log(fourSquareResponse);
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  const _onViewportChange = (viewport) => {
    setViewPort({ ...viewport, transitionDuration: 100 });
  };

  if (currentRoute === "4d4b7105d754a06372d81259") {
    dataToSend = university;
  } else {
    dataToSend = Food;
  }
  return (
    <div style={{ margin: "0 auto" }}>
      <VerticleModal
        content={dataToSend}
        show={showModal}
        onHide={() => handleCloseModal()}
        LocType={currentRoute}
      />
      <InputGroup className="mb-3">
        <DropdownButton
          as={InputGroup.Prepend}
          variant="outline-secondary"
          title={currentRoute}
          id="input-group-dropdown-1"
        >
          {routes.map((curr, idx) => (
            <Dropdown.Item
              href="#"
              key={idx}
              onClick={() => {
                setCurrentRoute(curr.endpoint);
                // getSights();
              }}
            >
              {curr.action}
            </Dropdown.Item>
          ))}
        </DropdownButton>
        <FormControl aria-describedby="basic-addon1" />
      </InputGroup>

      <MapGL
        {...viewport}
        mapboxApiAccessToken={TOKEN}
        mapStyle="mapbox://styles/mapbox/dark-v8"
        onViewportChange={_onViewportChange}
        onClick={handleMapClick}
      >
        <Marker latitude={viewport.latitude} longitude={viewport.longitude}>
          <div>
            <img src={marker} width="50px" />
          </div>
        </Marker>

        <GeolocateControl
          style={geolocateStyle}
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
        />
      </MapGL>
    </div>
  );
};
