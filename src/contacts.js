import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";
import axios from "axios";

export async function getContacts(query) {
  await fakeNetwork(`getContacts:${query}`);
  let contacts = await localforage.getItem("contacts");
  await axios.get("https://rickandmortyapi.com/api/character")
    .then((response) => {
      contacts = response.data.results;
    });
  if (!contacts) contacts = [];
  if (query) {
    contacts = matchSorter(contacts, query, { keys: ["name"] });
  }
  await set(contacts);
  return contacts.sort(sortBy("id", "name"));
}

export async function getContact(contactId) {
  await fakeNetwork(`contact:${contactId}`);
  let contacts = await localforage.getItem("contacts");
  let contact = contacts.find((contact) => contact.id === parseInt(contactId));
  return contact ?? null;
}

function set(contacts) {
  return localforage.setItem("contacts", contacts);
}

// fake a cache, so we don't slow down stuff we've already seen
let fakeCache = {};

async function fakeNetwork(key) {
  if (!key) {
    fakeCache = {};
  }

  if (fakeCache[key]) {
    return;
  }

  fakeCache[key] = true;
  return new Promise(res => {
    setTimeout(res, Math.random() * 800);
  });
}
