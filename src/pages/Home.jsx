import { Button, Typography, Box, Card, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  function startGame(type) {
    navigate(`/quiz?type=${type}`);
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
      <Card sx={{ p: 4, maxWidth: 420, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          🎬 Movie & Series Quiz
        </Typography>

        <Typography sx={{ mb: 3 }}>
          Elegí una categoría y poné a prueba tu conocimiento.
        </Typography>

        <Stack spacing={2}>
          <Button
            variant="contained"
            size="large"
            onClick={() => startGame("movie")}
          >
            🎥 Películas
          </Button>

          <Button
            variant="outlined"
            size="large"
            onClick={() => startGame("tv")}
          >
            📺 Series
          </Button>
        </Stack>
      </Card>
    </Box>
  );
}

export default Home;