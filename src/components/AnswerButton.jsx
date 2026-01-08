import { Button } from "@mui/material";

function AnswerButton({ text, onClick, state }) {
  let color = "primary";

  if (state === "correct") color = "success";
  if (state === "wrong") color = "error";

  return (
    <Button
      variant="outlined"
      color={color}
      onClick={onClick}
      fullWidth
    >
      {text}
    </Button>
  );
}

export default AnswerButton;