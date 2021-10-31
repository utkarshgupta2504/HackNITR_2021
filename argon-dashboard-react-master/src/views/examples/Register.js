/*!

=========================================================
* Argon Dashboard React - v1.2.1
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// reactstrap components
import React, { useState, useEffect, useRef } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import qs from "querystring";
import { useHistory } from "react-router-dom";
import swal from "sweetalert";

import auth from "../../utils/auth";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";
import "react-notifications/lib/notifications.css";

import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

const Register = () => {
  const danger = {
    color: "#ff0000",
  };
  const main = useRef(0);
  useEffect(() => {
    if (auth.getToken() && auth.getUserInfo()) {
      history.push("/admin");
    }
  }, []);
  const [userCredentials, setUserCredentials] = useState({
    first_name: "",

    last_name: "",
    email: "",
    password: "",
    password2: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserCredentials({ ...userCredentials, [name]: value });
  };
  const history = useHistory();
  const onSubmit = async (e) => {
    const {
      first_name,
      last_name,

      password,
      password2,
      email,
    } = userCredentials;

    e.preventDefault();
    if (password !== password2) {
      NotificationManager.error(
        "Passwords Do not Match",
        "Error!",
        5000,
        () => {}
      );
      return;
    }
    try {
      console.log(userCredentials);
      var config = {
        method: "post",
        url: "https://vast-bastion-90714.herokuapp.com/api/user/register",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: qs.stringify(userCredentials),
      };
      await axios(config)
        .then((res) => {
          if (res.status >= 200 && res.status < 300) {
            auth.setToken(res.data.token, true);
            const { email, first_name, last_name } = res.data;
            const id = res.data._id;
            let password = userCredentials.password;
            auth.setUserInfo(
              { email, id, first_name, last_name, password },
              true
            );
            console.log(`[Register]`);
            console.log(res);
            console.log(auth.getUserInfo());
            swal(
              `Hi, ${first_name}!`,
              "Welcome to your first step towards saving the planet.",
              "success"
            ).then((value) => {
              history.push("/admin");
            });
          } else {
            // NotificationManager.error(res.data, "Error!", 5000, () => {});
            console.log(res.data, res.status);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      NotificationManager.error(
        "Error creating new user",
        "Error!",
        5000,
        () => {}
      );

      return;
    }
  };

  return (
    <>
      <NotificationContainer />
      <Col lg="6" md="8">
        <Card className="bg-secondary shadow border-0">
          <CardHeader>
            <div className="text-muted text-center ">
              <h1 className="display-3">Sign Up </h1>
            </div>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            <Form role="form" onSubmit={onSubmit}>
              <FormGroup>
                <small>
                  First Name<span style={danger}>*</span>
                </small>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-hat-3" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="First Name"
                    type="text"
                    name="first_name"
                    onChange={(e) => handleChange(e)}
                    required
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <small>
                  Last Name<span style={danger}>*</span>
                </small>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-hat-3" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Last Name"
                    type="text"
                    name="last_name"
                    onChange={(e) => handleChange(e)}
                    required
                  />
                </InputGroup>
              </FormGroup>

              <FormGroup>
                <small>
                  Email<span style={danger}>*</span>
                </small>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    type="email"
                    autoComplete="email"
                    name="email"
                    onChange={(e) => handleChange(e)}
                    required
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Row>
                  <Col lg="6">
                    <small>
                      Password<span style={danger}>*</span>
                    </small>
                    <InputGroup className="input-group-alternative mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-lock-circle-open" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="password"
                        required
                        name="password"
                        id="password"
                        placeholder="Password"
                        onChange={(e) => handleChange(e)}
                      />
                    </InputGroup>
                  </Col>
                  <Col lg="6">
                    <small>
                      Confirm Password<span style={danger}>*</span>
                    </small>
                    <InputGroup className="input-group-alternative mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-lock-circle-open" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="password"
                        name="password2"
                        id="password2"
                        required
                        placeholder="Confirm Password"
                        onChange={(e) => handleChange(e)}
                      />
                    </InputGroup>
                  </Col>
                </Row>
              </FormGroup>

              <div className="text-center">
                <Button className="mt-4" color="primary" type="submit">
                  Create account
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default Register;
