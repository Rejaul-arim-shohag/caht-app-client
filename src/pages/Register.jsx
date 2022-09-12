import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/index.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../utils/APIRoutes";
import { BiShow, BiHide } from "react-icons/bi";
export default function Register() {

  const [passwordShown, setPasswordShown] = useState(false);
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const navigate = useNavigate();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, []);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error(
        "Password and confirm password should be same.",
        toastOptions
      );
      return false;
    } else if (username.length < 3) {
      toast.error(
        "Username should be greater than 3 characters.",
        toastOptions
      );
      return false;
    } else if (password.length < 8) {
      toast.error(
        "Password should be equal or greater than 8 characters.",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { email, username, password } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      });

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );

        navigate("/");
      }
    }
  };

  return (
    <>
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-12 col-md-6 mt-3">
            <div className="brand text-center">
              <img style={{ width: "200px" }} src={Logo} alt="logo" />
              <h5 className="mt-3">Sign up</h5>
              <p className="mt-2 mb-3">Get your Chatvia account now.</p>
            </div>

            <div style={{ backgroundColor: "#fffefc" }} className="card w-100 px-5 border-0">
              <div className="card-body">
                <form action="" onSubmit={(event) => handleSubmit(event)}>
                  <div className="row">
                    <div className="col-12 mt-3">
                      <label>Name</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Enter Username"
                        name="username"
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                    <div className="col-12 mt-3">
                      <label>Email</label>
                      <input
                        className="form-control"
                        type="email"
                        placeholder="Email"
                        name="email"
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                    <div className="col-12 mt-3 position-relative">
                      <label>Password</label>
                      <input
                        className="form-control"
                        type={passwordShown ? "text" : "password"}
                        placeholder="Password"
                        name="password"
                        onChange={(e) => handleChange(e)}
                      />
                      <span onClick={togglePassword} style={{ marginTop: "-33px", right: "20px" }} className="position-absolute">
                        {
                          passwordShown?<BiShow style={{fontSize:"22px"}}/>:<BiHide style={{fontSize:"22px"}}/>
                        }
                      </span >
                    </div>
                    <div className="col-12 mt-3 ">
                      <label>Confirm Password</label>
                      <input
                        className="form-control"
                        type={passwordShown ? "text" : "password"}
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        onChange={(e) => handleChange(e)}
                      />

                    </div>
                    <div className="col-12 mt-3">
                      <button className="btn btn-primary w-100" type="submit">Sign up</button>
                    </div>
                    <div className="col-12 mt-3">
                      <span>
                        Already have an account ? <Link to="/login">Login.</Link>
                      </span>
                    </div>
                  </div>
                </form>
              </div>
            </div>


          </div>
        </div>

      </div>
      <ToastContainer />
    </>
  );
}

