export default function Home() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Find your perfect travel match
        </h1>
        <p className="text-gray-600">
          Connect with like-minded travelers and explore the world together.
        </p>

        <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-semibold">
          Sign in with Google
        </button>

        <button className="w-full bg-white border border-gray-300 text-black py-3 rounded-lg font-semibold">
          Sign in with Apple
        </button>

        <div className="flex items-center gap-2 text-gray-400">
          <hr className="flex-1 border-gray-300" />
          <span>or</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 p-3 rounded-lg"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border border-gray-300 p-3 rounded-lg"
        />

        <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-semibold">
          Sign in
        </button>

        <div className="flex justify-between pt-4 text-center text-sm">
          <div>
            <div className="text-2xl">🔁</div>
            <h3 className="font-semibold">Real-time matching</h3>
            <p className="text-gray-500 text-xs">
              Get instantly paired with compatible travelers.
            </p>
          </div>
          <div>
            <div className="text-2xl">✅</div>
            <h3 className="font-semibold">Verified profiles</h3>
            <p className="text-gray-500 text-xs">
              We ensure all members are verified for safety.
            </p>
          </div>
          <div>
            <div className="text-2xl">🗓️</div>
            <h3 className="font-semibold">Plan trips together</h3>
            <p className="text-gray-500 text-xs">
              Collaborate on itineraries and travel plans.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
