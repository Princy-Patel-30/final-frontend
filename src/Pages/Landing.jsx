import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="font-sans text-gray-800">
      {/* Hero Section */}
      <section className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-pink-500 to-rose-500 px-6 text-center text-white">
        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
          Welcome to SocioFeed
        </h1>
        <p className="mb-8 max-w-2xl text-lg font-light md:text-xl">
          Connect, share, and engage in meaningful conversations on a modern
          social platform.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/register')}
            className="rounded-lg bg-white px-6 py-3 font-medium text-pink-500 shadow-md transition duration-300 hover:bg-pink-100 hover:text-pink-600"
          >
            Create Profile
          </button>
          <button
            onClick={() => navigate('/login')}
            className="rounded-lg border-2 border-white bg-transparent px-6 py-3 font-medium text-white transition duration-300 hover:bg-white hover:text-pink-600"
          >
            Login
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16 text-center">
        <h2 className="mb-10 text-3xl font-semibold text-pink-500">
          Why Choose SocioFeed?
        </h2>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <h3 className="mb-2 text-xl font-semibold text-pink-500">
              Real-Time Updates
            </h3>
            <p className="text-gray-600">
              Stay connected with instant posts and updates from your network.
            </p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <h3 className="mb-2 text-xl font-semibold text-pink-500">
              Express Freely
            </h3>
            <p className="text-gray-600">
              Share your stories, images, and ideas in a vibrant community.
            </p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <h3 className="mb-2 text-xl font-semibold text-pink-500">
              Custom Profiles
            </h3>
            <p className="text-gray-600">
              Showcase your unique personality with a personalized profile.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-pink-500 px-6 py-16 text-center text-white">
        <h2 className="mb-4 text-3xl font-semibold">Join the Community</h2>
        <p className="mb-8 text-lg font-light">
          Start sharing your moments and building connections today.
        </p>
        <button
          onClick={() => navigate('/register')}
          className="rounded-lg bg-white px-6 py-3 font-medium text-pink-500 shadow-md transition duration-300 hover:bg-pink-100 hover:text-pink-600"
        >
          Get Started
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-rose-500 py-6 text-center text-white">
        <p className="text-sm">© 2025 SocioFeed. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
