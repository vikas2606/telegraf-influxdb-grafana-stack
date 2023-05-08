import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateRoles from "./CreateRoles";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

function ViewRoles() {
  const [addingRole, setAddingRole] = useState(false);
  const [rolesList, setRoleslist] = useState([]);
  const [deleteRole, setDeleteRole] = useState(false);

  const fetchData = () => {
    axios
      .get(
        `${process.env.REACT_APP_GOCLOAK_URL}${process.env.REACT_APP_GOCLOAK_GET_ROLES}${process.env.REACT_APP_GOCLOAK_REALM}`,
        { withCredentials: true }
      )
      .then((response) => {
        setRoleslist(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, [addingRole,deleteRole]);

  function handleAddRole() {
    setAddingRole(!addingRole);
  }

  function HandleCloseAddRole() {
    setAddingRole(false);
    toast.success("Role added successfully!", { duration: 3000 });
  }

  const roleDeleteHandler = (roleid, rolename) => {
    setDeleteRole(true)
    if (window.confirm(`Are you sure want to delete ${rolename}?`)) {
      axios
        .delete(
          `${process.env.REACT_APP_GOCLOAK_URL}${process.env.REACT_APP_GOCLOAK_DELETE_ROLE}${process.env.REACT_APP_GOCLOAK_REALM}/${rolename}/`,{withCredentials:true}
        )
        .then((response) => {
          console.log(response.data);
          setDeleteRole(false);
          toast("Role deleted successfully!", { icon: "🗑️" });
        })
        .catch((error) => {
          console.error(error);
          toast.error("error while deleting try again!");
        });
    }
  };

  return (
    <div class="flex space-y-4 p-4 md:space-y-6 justify-center overflow-hidden ">
      <div class="w-screen space-y-4 md:space-y-6 ">
        <h2 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          Roles list
        </h2>
        <button
          type="button"
          onClick={handleAddRole}
          class=" text-white bg-simnovous-orange hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          Add Role
        </button>
        {addingRole && <CreateRoles onClose={HandleCloseAddRole} />}
        <div class="relative overflow-x-hidden">
          <Toaster />
          <table class=" text-sm text-left text-black dark:text-white w-full">
            <thead class="text-xs text-black dark:text-white uppercase bg-gray-200 dark:bg-simnovous-dark-teal">
              <tr class="bg- border-b dark:bg-simnovous-dark-teal dark:border-gray-700">
                <th scope="col" class="px-6 py-3">
                  Role name
                </th>
                <th scope="col" class="px-6 py-3">
                  Description
                </th>
                <th></th>
              </tr>
            </thead>
            {rolesList.map((role) => (
              <tbody key={role.id}>
                <tr class="bg-white border-b dark:bg-simnovous-teal dark:border-gray-700">
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {role.name}
                  </th>
                  <td class="px-6 py-4">{role.description}</td>
                  <td>
                    <button
                      onClick={() => {
                        roleDeleteHandler(role.id, role.name);
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

export default ViewRoles;
