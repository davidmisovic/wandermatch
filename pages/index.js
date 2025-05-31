import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="max-w-[420px] w-full">
        {/* Nadpis a podnadpis */}
        <h1 className="text-3xl font-bold text-center text-[#1F1F1F] leading-tight mb-2">
          Find your perfect <br /> travel match
        </h1>
        <p className="text-center text-[#555] mb-6">
          Connect with like-minded travelers <br /> and explore the world together.
        </p>

        {/* Ilustračný obrázok */}
        <div className="flex justify-center mb-6">
          <Image
            src="/images/travelers_image_optimized.png"
            alt="Travelers"
            width={300}
            height={200}
            className="object-contain"
          />
        </div>

        {/* Google Button */}
        <div className="flex justify-center mb-3">
          <button className="flex items-center justify-center gap-3 px-6 h-[50px] w-[280px] rounded-xl shadow-md bg-gradient-to-r from-[#7B61FF] to-[#5D9FFF] text-white font-semibold text-[17px]">
            <Image
              src="/images/google-icon.svg"
              alt="Google"
              width={24}
              height={24}
            />
            Sign in with Google
          </button>
        </div>

        {/* Apple Button */}
        <div className="flex justify-center mb-6">
          <button className="flex items-center justify-center gap-3 px-6 h-[50px] w-[280px] rounded-xl border border-gray-300 text-black font-semibold text-[17px] bg-white">
            <Image
              src="/images/Apple_logo_black.svg"
              alt="Apple"
              width={24}
              height={24}
            />
            Sign in with Apple
          </button>
        </div>

        {/* OR separator */}
        <div className="flex items-center justify-center mb-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-400 font-medium">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Email & Password inputs */}
        <div className="flex flex-col gap-3 mb-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full h-[48px] px-4 rounded-md border border-gray-300 text-sm"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full h-[48px] px-4 rounded-md border border-gray-300 text-sm"
          />
        </div>

        {/* Sign in Button */}
        <div className="flex justify-center">
          <button className="w-[280px] h-[50px] rounded-xl bg-gradient-to-r from-[#7B61FF] to-[#5D9FFF] text-white font-semibold text-[17px] shadow-md">
            Sign in
          </button>
        </div>
      </div>
    </main>
  );
}
