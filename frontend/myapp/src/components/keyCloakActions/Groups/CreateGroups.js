import axios from "axios";
import React, { useState } from "react";
import Loading from "../../../logo/Loading/Loading";

function CreateGroups({ onClose }) {
  const [name, setGroupname] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const handleGroupSubmit = (event) => {
    setIsLoading(true);
    event.preventDefault();
    axios
      .post(
        `${process.env.REACT_APP_GOCLOAK_URL}${process.env.REACT_APP_GOCLOAK_CREATEGROUP_PATH}${process.env.REACT_APP_GOCLOAK_REALM}`,
        { name },{withCredentials:true}
      )
      .then((response) => {
        setIsLoading(false);
        onClose();
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  
  return (
    <div class="w-full justify-center bg-gray-100 rounded-lg border-black md:mt-0 sm:max-w-md xl:p-0 dark:bg-simnovous-dark-teal dark:border-gray-700 shadow-2xl">
      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
        <form class="space-y-4" onSubmit={handleGroupSubmit}>
          <input
            type="text"
            value={name}
            onChange={(event) => {
              setGroupname(event.target.value);
            }}
            class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Group Name"
            required=""
          />

          <button
            type="submit"
            disabled={isLoading || !name}
            class="flex justify-center items-center w-full disabled:bg-orange-300 text-white bg-simnovous-orange hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            {isLoading ? <Loading /> : "Create Group"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateGroups;
