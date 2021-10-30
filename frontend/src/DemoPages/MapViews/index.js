import React, { Fragment } from "react";
import { Route } from "react-router-dom";

// Map View

import MapView from "../../containers/map_container/map_container";

// Layout

import AppHeader from "../../Layout/AppHeader/";
import AppSidebar from "../../Layout/AppSidebar/";
import AppFooter from "../../Layout/AppFooter/";

const MapViews = ({ match }) => (
  <Fragment>
    <AppHeader />
    <div className="app-main">
      <AppSidebar />
      <div className="app-main__outer">
        <div className="app-main__inner">
          <Route path={`${match.url}`} component={MapView} />
        </div>
        <AppFooter />
      </div>
    </div>
  </Fragment>
);

export default MapViews;
