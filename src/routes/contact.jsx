import {
  useLoaderData,
} from "react-router-dom";
import { getContact } from "../contacts";
import dayjs from "dayjs";

export async function loader({ params }) {
  const contact = await getContact(params.contactId);
  console.log("contact", contact);
  if (!contact) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }
  return { contact };
}

export default function Contact() {
  const { contact } = useLoaderData();

  return (
    <>
    <div id="contact">
      <span>
        <img
          key={contact.image}
          src={contact.image || null}
        />
      </span>
      <span className={"center-items"}>
        <h1>
            {contact.name ? (
            <>
              {contact.name}
            </>
          ) : (
            <i>No Name</i>
          )}
        </h1>
      </span>
    </div>
      <hr />
    <div>
      <h2>Personal Info</h2>
      <div className={"personal-info"}>
        <p>
          <strong>Status:</strong> {contact.status ? (<>{contact.status}</>) : (<i>No Species</i>)}
        </p>
        <p>
          <strong>Gender:</strong> {contact.gender ? (<>{contact.gender}</>) : (<i>No Species</i>)}
        </p>
        <p>
          <strong>Species:</strong> {contact.species ? (<>{contact.species}</>) : (<i>No Species</i>)}
        </p>
        <p>
          <strong>Location:</strong> {contact.location.name ? (<>{contact.location.name}</>) : (<>No Location</>)}
        </p>
        <p>
          <strong>Origin:</strong> {contact.origin.name ? (<>{contact.origin.name}</>) : (<>No Origin</>)}
        </p>
        <p>
          <strong>Created Date:</strong> {contact.created ? (<>{dayjs(contact.created).format("MMM DD, YYYY")}</>) : (<>No Created Date</>)}
        </p>
      </div>
    </div>
    </>
  );
}
