import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Root, {
  loader as rootLoader,
} from "./routes/root.jsx";
import ErrorPage from "./error-page";
import Contact, {
  loader as contactLoader,
} from "./routes/contact";
import Index from "./routes/index";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    children: [
      {
        errorElement: <ErrorPage />,
        children : [{
          index: true, element: <Index /> },
        {
          path: ":contactId",
          element: <Contact />,
          loader: contactLoader,
        },
      ],
    }]
  },
], {
  basename: "/contact"
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />,
)
