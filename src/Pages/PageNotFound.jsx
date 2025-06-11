import { useNavigate } from 'react-router-dom';

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100 px-4 text-center text-pink-700">
      <h1 className="text-9xl font-extrabold">404</h1>
      <p className="mt-4 text-2xl">Oops! Page not found.</p>
      <p className="mt-2 text-pink-700">
        The page you are looking for is not available at the moment!
      </p>
      <button
        onClick={() => navigate('/')}
        className="mt-6 rounded-lg bg-pink-600 px-6 py-3 text-white shadow-md transition hover:bg-pink-600"
      >
        back to feed !
      </button>
    </div>
  );
};

export default PageNotFound;
