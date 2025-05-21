"use client";
import BackgroundContainer from './UI/BackgroundContainer';
import LoginLogo from './UI/LoginLogo';
import SignupForm from './UI/SignupForm';

export default function checkAccountInfoPage() {
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

<<<<<<<< HEAD:frontend/m4gi/src/pages/Login/Login_CheckAccountInfoPage.jsx

========
export default SignupPage;
>>>>>>>> 1d6e07a16280e5cc24bbeb7e0972c9e57c3f219c:frontend/m4gi/src/components/Login/SignupPage.jsx
