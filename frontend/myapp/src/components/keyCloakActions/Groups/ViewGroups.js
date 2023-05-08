import { useEffect, useState } from "react";
import React from "react";
import CreateGroups from "./CreateGroups";
import "../../styles/KeyClock.css";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast, Toaster } from "react-hot-toast";

function ViewGroups() {
  const [groupsList, setGroupslist] = useState([]);
  const [addingGroup, setAddingGroup] = useState(false);
  const [deletingGroup, setDeletingGroup] = useState(false);

  const fetchData = () => {
    axios
      .get(
        `${process.env.REACT_APP_GOCLOAK_URL}${process.env.REACT_APP_GOCLOAK_GET_GROUPS}${process.env.REACT_APP_GOCLOAK_REALM}`,
        { withCredentials: true }
      )
      .then((response) => {
        setGroupslist(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, [addingGroup, deletingGroup]);

  const groupDeleteHandler = (id, name) => {
    setDeletingGroup(true)
    if (window.confirm(`Are you sure want to delete ${name}?`)) {
      axios
        .delete(
          `${process.env.REACT_APP_GOCLOAK_URL}${process.env.REACT_APP_GOCLOAK_DELETE_GROUP}${process.env.REACT_APP_GOCLOAK_REALM}/${id}/`,{withCredentials:true}
        )
        .then((response) => {
          setDeletingGroup(false);
          toast("Group deleted successfully!", { icon: "🗑️" });
        })
        .catch((error) => {
          toast.error("error while deleting try again!");
        });
    }
  };

  function handleAddGroup() {
    setAddingGroup(!addingGroup);
  }

  function HandleCloseAddGroup() {
    setAddingGroup(false);
    toast.success("Group added successfully!", { duration: 3000 });
  }
  return (
    <div class="flex space-y-4 p-4 md:space-y-6 justify-center overflow-hidden">
      <div class="w-screen space-y-4 md:space-y-6 ">
        <h2 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          Groups list
        </h2>
        <button
          type="button"
          onClick={handleAddGroup}
          class=" text-white bg-simnovous-orange hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          Add Group
        </button>
        {addingGroup && <CreateGroups onClose={HandleCloseAddGroup} />}
        <div class="relative overflow-x-hidden">
          <Toaster />
          <table class=" text-sm text-left text-black dark:text-white w-full">
            <thead class="text-xs text-black dark:text-white uppercase bg-gray-200 dark:bg-simnovous-dark-teal">
              <tr class="bg- border-b dark:bg-simnovous-dark-teal dark:border-gray-700">
                <th scope="col" class="px-6 py-3">
                  Group Name
                </th>

                <th scope="col" class="px-6 py-3"></th>
              </tr>
            </thead>
            {groupsList.map((group) => (
              <tbody key={group.id}>
                <tr class="bg-white border-b dark:bg-simnovous-teal dark:border-gray-700">
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {group.name}
                  </th>

                  <td>
                    <button
                      onClick={() => {
                        groupDeleteHandler(group.id, group.name);
                      }}
                    >
                      <DeleteIcon />
                    </button>
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>
      </div>
    </div>
  );
}

export default ViewGroups;
