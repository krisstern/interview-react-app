import {
  useLoaderData,
  useFetcher
} from "react-router-dom";
import PropTypes from 'prop-types';
import { getContact } from "../contacts";

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
    </div>
    </>
  );
}
