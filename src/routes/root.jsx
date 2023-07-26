import {
  Outlet,
  NavLink,
  useLoaderData,
  Form,
  useNavigation,
  useSubmit
} from "react-router-dom";
import { getContacts } from "../contacts";
import Sidebar from "../components/Sidebar.jsx";
import {
  useEffect,
} from "react";

export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  console.log("q", q);
  return { contacts, q };
}

export default function Root() {
  const { contacts, q } = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();

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
          </div>
          <nav>
            {contacts.length ? (
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
