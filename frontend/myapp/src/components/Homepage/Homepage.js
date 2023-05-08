import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Sidebar, Menu, MenuItem, useProSidebar } from "react-pro-sidebar";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from "@mui/icons-material/Groups";
import EngineeringIcon from "@mui/icons-material/Engineering";
import "./Homepage.css";

function Homepage() {
  const { collapseSidebar, toggleSidebar } = useProSidebar();

  return (
    <div class="h-screen flex bg-white dark:bg-simnovous-teal shadow-md">
      <Sidebar className=" bg-white dark:bg-simnovous-teal">
        <Menu class="h-screen bg-white dark:bg-simnovous-teal">
          <MenuItem
            icon={
              <MenuOutlinedIcon className="rounded hover:bg-simnovous-orange bg-white dark:bg-simnovous-teal text-black hover:text-black dark:text-simnovous-orange" />
            }
            onClick={() => {
              collapseSidebar();
            }}
            className="dark:text-white"
          >
            {" "}
            <h2>Admin</h2>
          </MenuItem>

          <MenuItem
            component={<Link to="/Homepage/Graphs" />}
            icon={
              <QueryStatsIcon className="rounded bg-white dark:bg-simnovous-teal text-black dark:text-simnovous-orange" />
            }
            className="dark:text-white"
          >
            Graph
          </MenuItem>
          <MenuItem
            component={<Link to="/Homepage/Users" />}
            icon={
              <PersonIcon className="rounded bg-white dark:bg-simnovous-teal text-black dark:text-simnovous-orange" />
            }
            className="dark:text-white"
          >
            Users
          </MenuItem>
          <MenuItem
            component={<Link to="/Homepage/Groups" />}
            icon={
              <GroupsIcon className="rounded bg-white dark:bg-simnovous-teal text-black dark:text-simnovous-orange" />
            }
            className="dark:text-white"
          >
            Groups
          </MenuItem>
          <MenuItem
            component={<Link to="/Homepage/Roles" />}
            icon={
              <EngineeringIcon className="rounded bg-white dark:bg-simnovous-teal text-black dark:text-simnovous-orange" />
            }
            className="dark:text-white"
          >
            Roles
          </MenuItem>

       
        </Menu>
      </Sidebar>
      <main> </main>

      <Outlet />
    </div>
  );
}
export default Homepage;
