import React, { useEffect, useState } from "react";
import CreateUsers from "./CreateUsers";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast, Toaster } from "react-hot-toast";

function ViewUsers() {
  const [users, setUsers] = useState([]);
  const [addingUser, setAddingUser] = useState(false);
  const [deletingUser, setDeletingUser] = useState(false);

  const fetchData = () => {
    axios
      .get(
        `${process.env.REACT_APP_GOCLOAK_URL}${process.env.REACT_APP_GOCLOAK_GET_USERS}${process.env.REACT_APP_GOCLOAK_REALM}`,
        { withCredentials: true }
      )
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const userDeleteHandler = (userid, username) => {
    setDeletingUser(true)
    if (window.confirm(`Are you sure want to delete ${username}?`)) {
      axios
        .delete(
          `${process.env.REACT_APP_GOCLOAK_URL}${process.env.REACT_APP_GOCLOAK_DELETE_USERS}${process.env.REACT_APP_GOCLOAK_REALM}/${userid}/`,{withCredentials:true}
        )
        .then((response) => {
          setDeletingUser(false);
          toast("User deleted successfully!", { icon: "🗑️" });
        })
        .catch((error) => {
          toast.error("error while deleting try again!");
        });
    }
  };

  useEffect(() => {
    fetchData();
  }, [addingUser, deletingUser]);

  const handleAddUser = () => {
    setAddingUser(!addingUser);
  };

  const HandleCloseAddUser = () => {
    setAddingUser(false);
    toast.success("User added successfully!", { duration: 3000 });
  };

  return (
    <div class="flex space-y-4 p-4 md:space-y-6 justify-center overflow-hidden">
      <div class="w-screen space-y-4 md:space-y-6 ">
        <h2 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          Users List
        </h2>
        <button
          onClick={handleAddUser}
          type="button"
          class=" text-white bg-simnovous-orange hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          Add User
        </button>
        {addingUser && <CreateUsers onClose={HandleCloseAddUser} />}
        <div class="relative overflow-x-hidden">
          <Toaster />

          <table class=" text-sm text-left text-black dark:text-white w-full">
            <thead class="text-xs text-black dark:text-white uppercase bg-gray-200 dark:bg-simnovous-dark-teal">
              <tr class="bg- border-b dark:bg-simnovous-dark-teal dark:border-gray-700">
                <th scope="col" class="px-6 py-3">
                  Username
                </th>
                <th scope="col" class="px-6 py-3">
                  Email
                </th>
                <th scope="col" class="px-6 py-3">
                  First name
                </th>
                <th scope="col" class="px-6 py-3">
                  Last name
                </th>
                <th scope="col" class="px-6 py-3"></th>
              </tr>
            </thead>
            {users.map((user) => (
              <tbody key={user.id}>
                <tr class="bg-white border-b dark:bg-simnovous-teal dark:border-gray-700">
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {user.username}
                  </th>
                  <td class="px-6 py-4">{user.firstName}</td>
                  <td class="px-6 py-4">{user.lastName}</td>
                  <td class="px-6 py-4">{user.email}</td>
                  <td>
                    <button
                      onClick={() => {
                        userDeleteHandler(user.id, user.username);
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

export default ViewUsers;
