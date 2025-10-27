import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import Parse from "parse";

Parse.initialize(
  "P1geGtat27e7J1SV94oa9qXQgbx56S35jpqWBqgb",
  "rfsKtjebIp4Y2gztykFzI8mpwSMGSPRnuXqWZkZ7"
);

Parse.serverURL = "https://parseapi.back4app.com";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
