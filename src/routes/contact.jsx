import {
  useLoaderData,
} from "react-router-dom";
import { getContact } from "../contacts";
import dayjs from "dayjs";
import axios from "axios";
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import {useEffect, useState} from "react";

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
  const {contact} = useLoaderData();

  const [episodes, setEpisodes] = useState(null);

  useEffect(() => {
    let episodeArray = [];
    contact.episode.map(async (episodeUrl) => {
      // console.log(episodeUrl);
      await axios.get(episodeUrl)
        .then((response) => {
          // console.log(response?.data);
          episodeArray.push(response?.data);
        });
      setEpisodes(episodeArray);
    });
  }, [contact]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      editable: true,
    },
    {
      field: 'air_date',
      headerName: 'Air Date',
      width: 140,
      editable: true,
      valueGetter: (params) =>
        `${dayjs(params.row.air_date).format("MMM DD, YYYY")}`,
    },
    {
      field: 'episode',
      headerName: 'Episode',
      type: 'number',
      width: 100,
      editable: true,
    },
    {
      field: 'created',
      headerName: 'Created Date',
      sortable: true,
      width: 140,
      valueGetter: (params) =>
        `${dayjs(params.row.created).format("MMM DD, YYYY")}`,
    },
  ];

  return (
    <>
      <div id="contact">
      <span>
        <img
          key={contact.image}
          src={contact.image || null}
          alt="Contact image"
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
      <hr/>
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
            <strong>Created
              Date:</strong> {contact.created ? (<>{dayjs(contact.created).format("MMM DD, YYYY")}</>) : (<>No Created
            Date</>)}
          </p>
        </div>
        <br />
        {episodes && <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={episodes}
            columns={columns}
            autoHeight={true}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
              sorting: {
                sortModel: [{ field: 'id', sort: 'asc' }],
              },
            }}
            pageSizeOptions={[5]}
            checkboxSelection={false}
            disableRowSelectionOnClick
          />
        </Box>
        }
      </div>
    </>
  );
}
