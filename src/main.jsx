import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Root, {
  loader as rootLoader,
  action as rootAction
} from "./routes/root.jsx";
import ErrorPage from "./error-page";
import Contact, {
  loader as contactLoader,
  action as contactAction
} from "./routes/contact";
import EditContact, {
  action as editAction
} from "./routes/edit";
import { action as destroyAction } from "./routes/destroy";
import Index from "./routes/index";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
      {
        errorElement: <ErrorPage />,
        children : [{
          index: true, element: <Index /> },
        {
          path: ":contactId",
          element: <Contact />,
          loader: contactLoader,
          action: contactAction,
        },
        {
          path: ":contactId/edit",
          element: <EditContact/>,
          loader: contactLoader,
          action: editAction
        },
        {
          path: ":contactId/destroy",
          action: destroyAction,
        },
      ],
    }]
  },
], {
  basename: "/contact"
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
