import '../Sidebar.css'
import {NavLink} from "react-router-dom";

function Sidebar() {

  return (
    <>
      <div id="sidebar2">
        <h1><strong>Rick and Morty</strong></h1>
        <NavLink
          to={"/"}
          style={{ textDecoration: 'none' }}
        >
          <h2>Contacts</h2>
        </NavLink>
      </div>
    </>
  )
}

export default Sidebar;
