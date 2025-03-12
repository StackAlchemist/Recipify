import { useNavigate } from "react-router";

const BackButton = () => {
    const navigate = useNavigate();

    return (
        <button 
            onClick={() => navigate(-1)} 
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition ml-4 mt-4"
        >
            ← Back
        </button>
    );
};

export default BackButton;
