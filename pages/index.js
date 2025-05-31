import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-white">
      <div className="flex flex-col-reverse md:flex-row items-center gap-10 max-w-6xl w-full">
        {/* Textová sekcia */}
        <div className="flex-1 w-full max-w-lg">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 leading-tight">
            Find your perfect <br /> travel match
          </h1>
          <p className="text-gray-600 mb-6 text-lg">
            Connect with like-minded travelers and explore the world together.
          </p>

          <div className="space-y-3">
            {/* Google Login */}
            <button className="flex items-center gap-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg w-full shadow-md">
              <Image src="/images/google-icon.svg" alt="Google" width={24} height={24} />
              Sign in with Google
            </button>

            {/* Apple Login */}
            <button className="flex items-center gap-3 border border-gray-300 px-6 py-3 rounded-lg w-full shadow-sm">
              <Image src="/images/apple-icon.svg" alt="Apple" width={24} height={24} />
              Sign in with Apple
            </button>

            {/* OR Divider */}
            <div className="flex items-center justify-center text-gray-400 text-sm py-2">or</div>

            {/* Email & Password */}
            <div className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Email"
                className="border px-4 py-2 rounded-md w-full"
              />
              <input
                type="password"
                placeholder="Password"
                className="border px-4 py-2 rounded-md w-full"
              />
              <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-md w-full shadow-md">
                Sign in
              </button>
            </div>
          </div>
        </div>

        {/* Obrázková sekcia */}
        <div className="flex-1 hidden md:flex justify-center">
          <Image
            src="/images/travelers.png"
            alt="Travelers Illustration"
            width={400}
            height={400}
            priority
          />
        </div>
      </div>

      {/* Features sekcia */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl text-center">
        <div>
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full mx-auto flex items-center justify-center text-xl mb-2">
            🔄
          </div>
          <h3 className="font-semibold text-lg">Real-time matching</h3>
          <p className="text-gray-500 text-sm">Get instantly paired with compatible travelers.</p>
        </div>
        <div>
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full mx-auto flex items-center justify-center text-xl mb-2">
            ✅
          </div>
          <h3 className="font-semibold text-lg">Verified profiles</h3>
          <p className="text-gray-500 text-sm">We ensure all members are verified for safety.</p>
        </div>
        <div>
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full mx-auto flex items-center justify-center text-xl mb-2">
            📅
          </div>
          <h3 className="font-semibold text-lg">Plan trips together</h3>
          <p className="text-gray-500 text-sm">Collaborate on itineraries and travel plans.</p>
        </div>
      </div>
    </main>
  );
}
