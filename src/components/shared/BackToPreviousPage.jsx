import { useNavigate } from "react-router-dom";
import PenLink from "./paper/PenLink";

export default function BackToPreviousPage() {
  const navigate = useNavigate();

  const returnToPreviousPage = (event) => {
    event.preventDefault();

    if (window.history.state?.idx > 0) {
      navigate(-1);
      return;
    }

    navigate("/work");
  };

  return <PenLink back className="study-back" href="/work" onClick={returnToPreviousPage}>Back to previous page</PenLink>;
}
