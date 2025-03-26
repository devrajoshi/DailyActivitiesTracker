const Home = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-4">
          Routine Tracker
        </h1>
        <p className="text-lg sm:text-xl text-center text-gray-600">
          Track and manage your daily routines effortlessly.
        </p>
      </div>
    </div>
  );
};

export default Home;
