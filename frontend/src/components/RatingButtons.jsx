import api from '../utils/api';
import toast from 'react-hot-toast';

function RatingButtons({ storeId, onRate }) {
  const submitRating = async (rating) => {
    try {
   
      await api.post(`/stores/${storeId}/rate`, { rating });
      toast.success(`Rated ${rating} star${rating > 1 ? 's' : ''}!`);
      if (onRate) onRate();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Error submitting rating');
    }
  };

  return (
    <div className="mt-2 flex justify-center gap-2">
      {[1, 2, 3, 4, 5].map((r) => (
        <button
          key={r}
          onClick={() => submitRating(r)}
          className="w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700
                     text-white rounded-full text-sm font-semibold shadow-md transition-all"
        >
          {r}
        </button>
      ))}
    </div>
  );
}

export default RatingButtons;
