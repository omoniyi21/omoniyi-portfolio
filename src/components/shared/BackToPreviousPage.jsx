import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

  return <a href="/work" onClick={returnToPreviousPage}><ArrowLeft size={16} /> Back to previous page</a>;
}
