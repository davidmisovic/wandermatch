import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-10 items-center">
        {/* LEFT SIDE – Login content */}
        <div className="w-full max-w-md mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find your perfect <br /> travel match
          </h1>
          <p className="text-gray-600 mb-8">
            Connect with like-minded travelers and explore the world together.
          </p>

          {/* Google login */}
          <button className="flex items-center justify-center gap-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium py-3 px-6 rounded-xl w-full shadow-md">
            <Image src="/images/google-icon.svg" alt="Google" width={20} height={20} />
            Sign in with Google
          </button>

          {/* Apple login */}
          <button className="flex items-center justify-center gap-3 border border-gray-300 text-black font-medium py-3 px-6 rounded-xl w-full mt-4 shadow-sm">
            <Image src="/images/apple-icon.svg" alt="Apple" width={20} height={20} />
            Sign in with Apple
          </button>

          {/* Divider */}
          <div className="flex items-center my-6 text-gray-400 text-sm">
            <hr className="flex-grow border-gray-300" />
            <span className="px-3">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Email/password */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="email"
              placeholder="Email"
              className="border border-gray-300 rounded-lg px-4 py-3 text-sm w-full"
            />
            <input
              type="password"
              placeholder="Password"
              className="border border-gray-300 rounded-lg px-4 py-3 text-sm w-full"
            />
          </div>

          <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium py-3 px-6 rounded-xl w-full mt-4 shadow-md">
            Sign in
          </button>
        </div>

        {/* RIGHT SIDE – Image */}
        <div className="hidden md:block">
          <Image
            src="/images/travelers_image_optimized.png"
            alt="Travelers illustration"
            width={500}
            height={500}
            priority
          />
        </div>
      </div>
    </main>
  );
}
