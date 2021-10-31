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
import { useEffect, useState } from "react";
import auth from "../../utils/auth";
import { useHistory } from "react-router";
import React from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import qs from "querystring";
import "react-notifications/lib/notifications.css";

import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

const Login = () => {
  const history = useHistory();
  const [state, setState] = useState({
    email: "",
    password: "",
    buttonDisable: false,
  });

  useEffect(() => {
    if (auth.getToken() && auth.getUserInfo()) {
      history.push("/admin");
    }
  }, []);
  const handleChange = ({ target }) => {
    // console.log(`[Login] ${target.name}: ${target.value}`);
    setState({
      ...state,
      [target.name]: target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setState({
      ...state,
      buttonDisable: true,
    });
    var config = {
      method: "post",
      url: "https://vast-bastion-90714.herokuapp.com/user/login",
      data: qs.stringify(state),
    };
    console.log(config.data);
    axios(config)
      .then((response) => {
        auth.setToken(response.data.token, true);
        const { email, first_name, last_name } = response.data;
        let password = state.password;
        const id = response.data._id;
        auth.setUserInfo({ email, id, first_name, last_name, password }, true);
        console.log(`[Login]`);
        console.log(response);
        console.log(auth.getUserInfo());
        history.push("/admin");
      })
      .catch((err) => {
        console.log(err);
        setState({
          state,
          buttonDisable: false,
        });
        NotificationManager.error(
          "Username/Password do not match.",
          "Error!",
          5000,
          () => {}
        );
        console.log(err);
      });
    // axios
    //   .post("https://vast-bastion-90714.herokuapp.com/user/login", qs.stringify(state))

    //   .then((response) => {
    //     auth.setToken(response.data.jwt, true);
    //     const { email } = response.data;
    //     const id = response.data._id;
    //     auth.setUserInfo({ email, id }, true);
    //     console.log(`[Login]`);
    //     console.log(response);
    //     console.log(auth.getUserInfo());
    //     history.push("/student-dashboard");
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     setState({
    //       state,
    //       buttonDisable: false,
    //     });
    //     NotificationManager.error(
    //       "Username/Password do not match.",
    //       "Error!",
    //       5000,
    //       () => {}
    //     );
    //     console.log(err);
    //   });
  };
  return (
    <>
      <NotificationContainer />
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Sign in with your credentials</small>
            </div>
            <Form role="form" onSubmit={handleSubmit}>
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    type="email"
                    autoComplete="new-email"
                    name="email"
                    value={state.email}
                    onChange={handleChange}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Password"
                    type="password"
                    autoComplete="new-password"
                    name="password"
                    value={state.password}
                    onChange={handleChange}
                  />
                </InputGroup>
              </FormGroup>

              <div className="text-center">
                <Button
                  className="my-4"
                  color="primary"
                  type="submit"
                  disabled={state.buttonDisable}
                >
                  Sign in
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col xs="6"></Col>
          <Col className="text-right" xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <small>Create new account</small>
            </a>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Login;
