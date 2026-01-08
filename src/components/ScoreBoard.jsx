import { Typography, LinearProgress, Box } from "@mui/material";

function ScoreBoard({ current, total, score }) {
  const progress = ((current + 1) / total) * 100;

  return (
    <Box sx={{ mb: 2 }}>
      <LinearProgress variant="determinate" value={progress} />
      <Typography sx={{ mt: 1, textAlign: "center" }}>
        Pregunta {current + 1} / {total} — Puntaje: {score}
      </Typography>
    </Box>
  );
}

export default ScoreBoard;