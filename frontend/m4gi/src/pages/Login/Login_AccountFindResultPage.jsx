"use client";
import AccountStatusForm from '../UI/AccountStatusForm';
import BackgroundContainer from '../UI/BackgroundContainer';
import LoginLogo from '../UI/LoginLogo';

export default function AccountFindResultPage() {
  return (
    <BackgroundContainer>
      <div className="flex flex-col items-center w-full px-10">
        <div className="mb-8">
          <LoginLogo />
        </div>

        <div className="w-full">
          <AccountStatusForm />
        </div>
      </div>

    </BackgroundContainer>
  );
};