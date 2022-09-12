import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Buffer } from "buffer";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setAvatarRoute } from "../utils/APIRoutes";

export default function SetAvatar() {
  const api = `https://api.multiavatar.com/4645646`;
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  console.log("selectedAvatar", selectedAvatar)
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };



  useEffect(async () => {
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))
      navigate("/login");
  }, []);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      const user = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );

      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });

      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(user)
        );
        navigate("/");
      } else {
        toast.error("Error setting avatar. Please try again.", toastOptions);
      }
    }
  };

  useEffect(async () => {
    const data = [];
    for (let i = 0; i < 4; i++) {
      const image = await axios.get(
        `${api}/${Math.round(Math.random() * 1000)}`
      );
      const buffer = new Buffer(image.data);
      data.push(buffer.toString("base64"));
    }
    setAvatars(data);
    setIsLoading(false);
  }, []);
  return (
    <>
      {isLoading ? (
        <div style={{marginTop:"20%"}} className="container d-flex justify-content-center height-100">
          <div className="d-flex align-items-center">
            <img src={loader} alt="loader" style={{ maxInlineSize: "100%" }} className="loader" />
          </div>
        </div>
      ) : (
        <div className="container py-5">
          <div className="row d-flex justify-content-center">
            <div className="title-container col-12 col-md-6">
              <h3 className="text-dark text-center mt-5">Pick an Avatar as your profile picture</h3>
            </div>
          </div>
          <div className="row d-flex justify-content-center mt-5">
            <div className="col-12 col-md-5">
              <div className="avatars d-flex justify-content-between">
                {avatars.map((avatar, index) => {
                  return (
                    <div
                      style={{ width: "100px" }}
                      className={`avatar ${selectedAvatar === index ? "selected" : ""
                        }`}
                    >
                      <img
                        src={`data:image/svg+xml;base64,${avatar}`}
                        alt="avatar"
                        key={avatar}
                        onClick={() => setSelectedAvatar(index)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="row d-flex justify-content-center mt-5">
            <div className=" col-12 col-md-4">
              <button onClick={setProfilePicture} className="btn btn-primary w-100 submit-btn">
                Set as Profile Picture
              </button>
              <ToastContainer />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
