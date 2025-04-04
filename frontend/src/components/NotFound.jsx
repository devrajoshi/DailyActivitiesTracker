const NotFound = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white text-gray-800">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-xl">Page Not Found</p>
      <a
        href="/"
        className="mt-6 font-bold text-indigo-600 hover:scale-105 hover:underline"
      >
        Go back to Home
      </a>
    </div>
  );
};

export default NotFound;
