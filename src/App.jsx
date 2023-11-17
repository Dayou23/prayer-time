import { useState } from "react";

import "./App.css";
import PrayPage from "./Components/PrayPage";
import { Container } from "@mui/material";

function App() {
  return (
    <div
      style={{
        width: "100vw",
        // background: "red",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="xl">
        <PrayPage />
      </Container>
    </div>
  );
}

export default App;
