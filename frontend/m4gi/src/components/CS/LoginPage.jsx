"use client";
import React, { useEffect } from "react";
import Logo from "../UI/Logo";
import { CS_LoginForm } from "../UI/CS_LoginForm";
import LoginLogo from "../UI/LoginLogo";

export function LoginPage() {
    useEffect(() => {
    console.log("✅ REST KEY:", import.meta.env.VITE_KAKAO_REST_KEY);
    console.log("✅ REDIRECT URI:", import.meta.env.VITE_KAKAO_REDIRECT_URI);
  }, []);


  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://cdn.builder.io/api/v1/image/assets/TEMP/d2558eccd1c0619d0df8f987aad2ecb12cc3d386?placeholderIfAbsent=true&apiKey=e63d00b6fe174365bf8642989b3e5edd')",
      }}
    >
      <div className="mb-8">
        <LoginLogo />
      </div>
      <CS_LoginForm />
    </main>
  );
}
