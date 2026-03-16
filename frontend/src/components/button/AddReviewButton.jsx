import { useNavigate } from "react-router-dom";

const AddReviewButton = ({ userId }) => {
    const navigate = useNavigate();

    return (
        <button
            className="btn btn-outline btn-primary btn-sm"
            onClick={() => navigate(`/review/${userId}`)}
        >
            Add Review
        </button>
    );
};

export default AddReviewButton;
