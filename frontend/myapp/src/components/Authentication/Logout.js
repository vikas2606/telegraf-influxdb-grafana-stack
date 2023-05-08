import axios from "axios";
import React from "react";
import { componentActions } from "../store/store";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const LogOutHandler = () => {
    axios
      .post(
        `${process.env.REACT_APP_GOCLOAK_URL}${process.env.REACT_APP_GOCLOAK_LOGOUT_ADMIN_PATH}${process.env.REACT_APP_GOCLOAK_REALM}`,
        { withCredentials: true }
      )
      .then((event) => {
        dispatch(componentActions.setlogin(false));
        navigate("/");
      });
  };
  return (
    <div class="h-8 items-end">
      <button
        type="button"
        onClick={LogOutHandler}
        class="text-white bg-simnovous-orange hover:bg-orange-700 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 "
      >
        Logout
      </button>
    </div>
  );
}

export default Logout;
