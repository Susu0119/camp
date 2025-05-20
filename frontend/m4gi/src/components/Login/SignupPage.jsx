"use client";
import BackgroundContainer from './UI/BackgroundContainer';
import LoginLogo from './UI/LoginLogo';
import SignupForm from './UI/SignupForm';

const SignupPage = () => {
  return (
    <BackgroundContainer>
      <div className="flex flex-col items-center w-full px-10">
        <div className="mb-8">
            <LoginLogo />
        </div>

        <div className="w-full">
            <SignupForm />
        </div>
    </div>

    </BackgroundContainer>
  );
};

export default SignupPage;
