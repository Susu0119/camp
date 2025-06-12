"use client";
import BackgroundContainer from '../../components/Login/UI/BackgroundContainer';
import LoginLogo from '../../components/Login/UI/LoginLogo';
import SignupForm from '../../components/Login/UI/SignupForm';

export default function LogincheckAccountInfoPage() {
  return (
    <BackgroundContainer>
      <div className="min-h-screen flex flex-col justify-center items-center w-full px-10">
        <div className="mb-8">
          <LoginLogo />
        </div>

        <div className="w-full">
          <SignupForm />
        </div>
      </div>
    </BackgroundContainer>
  );
}
