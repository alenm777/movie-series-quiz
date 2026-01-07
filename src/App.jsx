import { Container, Typography, Button } from "@mui/material";
import { useState } from "react";
import Quiz from "./pages/Quiz";

function App() {
  const [start, setStart] = useState(false);

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 8 }}>
      {!start ? (
        <>
          <Typography variant="h4" gutterBottom>
            🎬 Movie & Series Quiz
          </Typography>
          <Typography sx={{ mb: 3 }}>
            ¿Cuánto sabés de películas y series?
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => setStart(true)}
          >
            Comenzar
          </Button>
        </>
      ) : (
        <Quiz />
      )}
    </Container>
  );
}

export default App;