import axios from "axios";
import React, { useState } from "react";
import Loading from "../../../logo/Loading/Loading";

function CreateUsers({ onClose }) {
  const [isLoading, setIsLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const enabled = true;

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_GOCLOAK_URL}${process.env.REACT_APP_GOCLOAK_CREATEUSER_PATH}${process.env.REACT_APP_GOCLOAK_REALM}`,
        {
          user: {
            username,
            firstName,
            lastName,
            email,
            enabled,
          },
          password,
        },{withCredentials:true}
      )
      .then((response) => {
        console.log("User created successfully");
        onClose();

        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  return (
    <div class="w-full justify-center bg-gray-100 rounded-lg border-black md:mt-0 sm:max-w-md xl:p-0 dark:bg-simnovous-dark-teal dark:border-gray-700 shadow-2xl">
      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
        <form class="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
            }}
            class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Username"
            required=""
          />
          <input
            value={firstName}
            onChange={(event) => {
              setFirstname(event.target.value);
            }}
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="First Name"
            required=""
          />
          <input
            value={lastName}
            onChange={(event) => {
              setLastname(event.target.value);
            }}
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Last Name"
            required=""
          />
          <input
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
            type="email"
            class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Email"
            required=""
          />
          <input
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Password"
            required=""
          />

          <button
            type="submit"
            disabled={
              !username || !firstName || !lastName || !email || isLoading
            }
            class="flex justify-center items-center w-full disabled:bg-orange-300 text-white bg-simnovous-orange hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            {isLoading ? <Loading /> : "Create User"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateUsers;
