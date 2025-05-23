export default function LoginLogo() {
  return (
    <header
      className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 flex justify-center items-center px-4"
      style={{ width: "360px" }} // Tailwind max-w-* 없이 고정 너비
    >
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/ad4d10228d0c6f1b0e8c1d8439f170e2c8151c78?placeholderIfAbsent=true&apiKey=e63d00b6fe174365bf8642989b3e5edd"
        alt="Campia Logo"
        className="w-24 aspect-[1.09] object-contain"
      />
      <h1 className="text-white text-6xl font-bold leading-none font-['GapyeongWave'] ml-2">
        Campia
      </h1>
    </header>
  );
}
