import { useSearchParams } from "react-router-dom";
import Quiz from "../components/Quiz";

function QuizPage() {
  const [params] = useSearchParams();
  const type = params.get("type") || "movie";

  return <Quiz type={type} />;
}

export default QuizPage;