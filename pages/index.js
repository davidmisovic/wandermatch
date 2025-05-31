import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="max-w-4xl w-full flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* LEFT SECTION */}
        <div className="flex flex-col items-start justify-center text-left gap-6 w-full max-w-md">
          <h1 className="text-4xl font-extrabold text-[#1f1f1f] leading-tight">
            Find your perfect <br /> travel match
          </h1>
          <p className="text-[#4b4b4b] text-lg">
            Connect with like-minded travelers <br />
            and explore the world together.
          </p>

          {/* Google Button */}
          <button className="flex items-center justify-center gap-3 w-full h-[50px] rounded-[12px] shadow-[0_2px_6px_rgba(0,0,0,0.15)] bg-gradient-to-r from-[#7B61FF] to-[#5D9FFF] text-white font-semibold text-[16px] leading-none">
            <Image
              src="/images/google-icon.svg"
              alt="Google"
              width={20}
              height={20}
            />
            Sign in with Google
          </button>

          {/* Apple Button */}
          <button className="flex items-center justify-center gap-3 w-full h-[50px] rounded-[12px] shadow-sm border border-gray-300 text-black font-semibold text-[16px] leading-none mt-2">
            <Image
              src="/images/apple-icon.svg"
              alt="Apple"
              width={20}
              height={20}
            />
            Sign in with Apple
          </button>

          {/* OR Divider */}
          <div className="flex items-center gap-4 w-full my-3">
            <hr className="flex-grow border-gray-300" />
            <span className="text-gray-500 text-sm">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Email / Password Fields */}
          <div className="flex gap-3 w-full">
            <input
              type="email"
              placeholder="Email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-[10px] text-sm outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-[10px] text-sm outline-none"
            />
          </div>

          {/* Sign In Button */}
          <button className="mt-4 w-full h-[50px] rounded-[12px] shadow-md bg-gradient-to-r from-[#7B61FF] to-[#5D9FFF] text-white font-semibold text-[16px]">
            Sign in
          </button>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative w-full max-w-md">
          <Image
            src="/images/travelers_image_optimized.png"
            alt="Travel Match Illustration"
            width={500}
            height={500}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>
    </main>
  );
}
