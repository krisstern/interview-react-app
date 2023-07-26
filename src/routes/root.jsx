import {
  Outlet,
  NavLink,
  useLoaderData,
  Form,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import { getContacts } from "../contacts";
import Sidebar from "../components/Sidebar.jsx";
import {
  useEffect, useState
} from "react";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import PropTypes from 'prop-types';

export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const status = url.searchParams.get("status");
  const gender = url.searchParams.get("gender");
  const contacts = await getContacts(q, status, gender);
  return { contacts, q };
}

export default function Root() {
  const { contacts, q } = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();

  const [status, setStatus] = useState("");
  const [gender, setGender] = useState("");

  // Whether there is a query string in the search field
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has(
"q"
    );

  // Update search string for replacement
  useEffect(() => {
    document.getElementById("q").value = q;
  }, [q]);

  return (
    <>
      <div className="container">
        <Sidebar />
        <div id="sidebar">
          <h1>Contacts</h1>
          <div>
            <Form id="search-form" role="search">
              <input
                id="q"
                className={searching ? "loading" : ""}
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
                defaultValue={q}
                onChange={(event) => {
                  const isFirstSearch = q == null;
                  submit(event.currentTarget.form, {
                    replace: !isFirstSearch,
                  });
                }}
              />
              <div
                id="search-spinner"
                aria-hidden
                hidden={!searching}
              />
              <div
                className="sr-only"
                aria-live="polite"
              ></div>
            </Form>
            <span>
              <button className="clear-filter-btn">
                <NavLink to="/" className="button" style={{ textDecoration: 'none' }}>Clear</NavLink>
              </button>
            </span>
          </div>
          <div>
            <Box sx={{ width: "50%" }}>
              <FormControl fullWidth>
                <InputLabel id="status-select-label">Status</InputLabel>
                <Select
                  labelId="status-select-label"
                  id="status"
                  value={status}
                  label="Status"
                  onChange={(event) => {
                    setStatus(event.target.value);
                    document.location.search = "status=" + event.target.value;
                  }}
                  defaultValue={status}
                >
                  <MenuItem value={""}><em>None</em></MenuItem>
                  <MenuItem value={"alive"}>Alive</MenuItem>
                  <MenuItem value={"dead"}>Dead</MenuItem>
                  <MenuItem value={"unknown"}>Unknown</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ width: "50%" }}>
              <FormControl fullWidth>
                <InputLabel id="gender-select-label">Gender</InputLabel>
                <Select
                  labelId="gender-select-label"
                  id="gender"
                  value={gender}
                  label="Gender"
                  onChange={(event) => {
                    setGender(event.target.value);
                    document.location.search = "gender=" + event.target.value;
                  }}
                  defaultValue={gender}
                >
                  <MenuItem value={""}><em>None</em></MenuItem>
                  <MenuItem value={"female"}>Female</MenuItem>
                  <MenuItem value={"male"}>Male</MenuItem>
                  <MenuItem value={"genderless"}>Genderless</MenuItem>
                  <MenuItem value={"unknown"}>Unknown</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </div>
          <nav>
            {contacts.length > 0 ? (
              <ul>
                {contacts.map((contact) => (
                  <li key={contact.id}>
                    <NavLink
                      to={`/${contact.id}`}
                      className={({ isActive, isPending }) =>
                        isActive
                          ? "active"
                          : isPending
                            ? "pending"
                            : ""
                      }
                    >
                      <span className={"center-items"}>
                        <img
                          key={contact.image}
                          src={contact.image || null}
                          width={42}
                          height={42}
                          style={{borderRadius: "50%"}}
                          alt={"Contact image"}
                        />
                      </span>
                      {contact.name ? (
                        <>
                          {contact.name}
                        </>
                      ) : (
                        <i>No Name</i>
                      )}
                      <br />
                      {contact.species ? (
                        <>
                          {contact.species}
                        </>
                      ) : (
                        <i>No Species</i>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                <i>No contacts</i>
              </p>
            )}
          </nav>
        </div>
        <div
          id="detail"
          className={
            navigation.state === "loading" ? "loading" : ""
          }
        >
          <Outlet />
        </div>
      </div>
    </>
  );
}

Root.propTypes = {
  url: PropTypes.any,
  request: PropTypes.any
}