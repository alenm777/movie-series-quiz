import { Card, CardMedia, CardContent, Typography } from "@mui/material";

function QuizCard({ movie, question }) {
  return (
    <Card>
      <CardMedia
        component="img"
        height="400"
        image={
          movie.backdrop_path
            ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
            : `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        }
        alt="Movie"
      />

      <CardContent>
        <Typography variant="h6">{question}</Typography>
      </CardContent>
    </Card>
  );
}

export default QuizCard;