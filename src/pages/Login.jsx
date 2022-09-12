import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/index.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";
import { BiShow, BiHide } from "react-icons/bi";

export default function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", password: "" });
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, []);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const { username, password } = values;
    if (username === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    } else if (password === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, {
        username,
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

  const [passwordShown, setPasswordShown] = useState(false);
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };
  return (
    <>
      <div className="container mt-5">
        <div className="row d-flex justify-content-center">
          <div className="col-12 col-md-6">
            <div className="card px-4 py-5 border-0">
              <div className="card-body ">
                <div className="text-center">
                  <img style={{ width: "200px" }} src={Logo} alt="logo" />
                  <h5 className="mt-3">Sign in</h5>
                  <p className="mt-2 mb-3">Sign in to continue to Chatvia.</p>
                </div>
                <form action="" onSubmit={(event) => handleSubmit(event)}>
                  <div className="row">
                    <div className="col-12 mt-3">
                      <label className="mb-1" htmlFor="">User Name</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Username"
                        name="username"
                        onChange={(e) => handleChange(e)}
                        min="3"
                      />
                    </div>

                    <div className="col-12 mt-3">
                      <label className="mb-1" htmlFor="">Password</label>
                      <input
                        className="form-control "
                        type={passwordShown ? "text" : "password"}
                        placeholder="Password"
                        name="password"
                        onChange={(e) => handleChange(e)}
                      />
                      <span onClick={togglePassword} style={{ marginTop: "-33px", right: "50px" }} className="position-absolute">
                        {
                          passwordShown ? <BiShow style={{ fontSize: "22px" }} /> : <BiHide style={{ fontSize: "22px" }} />
                        }
                      </span >
                    </div>

                    <div className="col-12 mt-3">
                      <button className="btn btn-primary w-100 mb-4" type="submit">Log In</button>
                      <div className="d-flex justify-content-between">
                        <span>
                          Don't have an account ? <Link to="/register">Create One.</Link>
                        </span>
                        <span>
                          <Link to="/register">Forget Password</Link>
                        </span>
                      </div>
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

