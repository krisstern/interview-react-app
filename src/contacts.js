import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";
import axios from "axios";

export async function getContacts(query, status, gender) {
  let contacts = await localforage.getItem("contacts");
  await axios.get("https://rickandmortyapi.com/api/character")
    .then((response) => {
      contacts = response.data.results;
    });
  if (!contacts) contacts = [];
  if (query) {
    contacts = matchSorter(contacts, query, {
      keys: [{threshold: matchSorter.rankings.CONTAINS, key: "name"}]
    });
  }
  if (status) {
    contacts = matchSorter(contacts, status, {
      keys: [{threshold: matchSorter.rankings.EQUAL, key: "status"}]
    });
  }
  if (gender) {
    contacts = matchSorter(contacts, gender, {
      keys: [{threshold: matchSorter.rankings.EQUAL, key: "gender"}]
    });
  }
  await set(contacts);
  return contacts.sort(sortBy("id"));
}

export async function getContact(contactId) {
  let contacts = await localforage.getItem("contacts");
  let contact = contacts.find((contact) => contact.id === parseInt(contactId));
  return contact ?? null;
}

function set(contacts) {
  return localforage.setItem("contacts", contacts);
}
