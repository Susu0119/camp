import React from "react";

const BackgroundContainer = ({ children }) => {
  return (
    <main className="flex justify-center items-center h-screen relative px-4">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/d2558eccd1c0619d0df8f987aad2ecb12cc3d386?placeholderIfAbsent=true&apiKey=e63d00b6fe174365bf8642989b3e5edd"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />
      {children}
    </main>
  );
};

export default BackgroundContainer;
