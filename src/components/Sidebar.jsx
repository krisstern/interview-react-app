import '../Sidebar.css'
import {NavLink} from "react-router-dom";

function Sidebar() {

  return (
    <>
      <div id="sidebar2">
        <NavLink
          to={"/"}
          style={{ textDecoration: 'none' }}
        >
          <h1><strong>Rick and Morty</strong></h1>
        </NavLink>
        <h2>Contacts</h2>
      </div>
    </>
  )
}

export default Sidebar;
