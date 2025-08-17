import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-between items-center bg-gray-900 text-white p-6">
      <div className="flex flex-col items-center justify-center flex-1 text-center">
        <h1 className="text-4xl font-bold mb-4">Rate My Store</h1>
        <p className="text-gray-300 mb-6 max-w-xl">
          Discover stores, share your rating, and help others make better choices.
        </p>

        
        <div className="flex gap-4">
            
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg shadow-md"
          >
            Signup
          </button>
        </div>
      </div>

    
      <footer className="text-sm text-gray-400 mb-2">
        Created by Omkar Kulkarni – Internship Assignment for Roxiler Systems
      </footer>
    </div>
  );
}
