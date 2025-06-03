import React, { useRef, useState } from 'react';
import ProfileInput from './MP_Profile_Input';
import Button from '../../Common/Button';

const ProfileForm = () => {
  const [nickname, setNickname] = useState('');
  const [isNicknameValid, setIsNicknameValid] = useState(null);
  const [profileImage, setProfileImage] = useState(
    'https://cdn.builder.io/api/v1/image/assets/TEMP/a9ad187750c7c54a7e3c820456d11d7044d0723b'
  );

  const fileInputRef = useRef(null);

  const handleNicknameCheck = () => {
    setIsNicknameValid(nickname.length >= 2);
  };

  const handleCancel = () => {
    setNickname('');
    setIsNicknameValid(null);
  };

  const handleSaveChanges = () => {
    if (!isNicknameValid) {
      alert('닉네임 중복 확인을 해주세요.');
      return;
    }
    alert('변경사항이 저장되었습니다.');
  };

  const handleSettingsClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfileImage(imageURL);
    }
  };

  return (
    <section
    className="p-8 mx-auto max-w-[900px] w-full bg-white rounded-md"
    style={{ marginTop: '40px' }} 
    >

      <h1 className="mb-6 text-3xl font-bold">정보 수정하기</h1>

      {/* 프로필 변경 영역 */}
      <div
        className="border border-gray-300 rounded-md p-6 mb-10"
        style={{ backgroundColor: '#ffffff' }}
      >
        <h2 className="mb-5 font-semibold text-lg text-gray-700">프로필 변경하기</h2>

        <div className="relative flex justify-center items-center">
          <div className="p-2.5 h-[200px] w-[200px]">
            <img
              src={profileImage}
              alt="Avatar"
              className="h-[180px] w-[180px] object-cover rounded-full"
            />
          </div>

         <button
        type="button"
        onClick={handleSettingsClick}
        className="absolute bottom-3 right-[calc(50%-90px)] cursor-pointer rounded-full"
        aria-label="프로필 이미지 변경"
        style={{ width: '40px', height: '40px', backgroundColor: '#EDDDF4', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
        <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="#8C06AD"
        strokeWidth={2}
        style={{ width: '24px', height: '24px' }}
        >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 7h2l2-3h6l2 3h2a2 2 0 012 2v7a2 2 0 01-2 2H3a2 2 0 01-2-2V9a2 2 0 012-2z"
        />
        <circle cx="12" cy="13" r="3" stroke="#8C06AD" strokeWidth={2} />
        </svg>




        </button>




          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {/* 닉네임 변경 영역 */}
      <div
        className="border border-gray-300 rounded-md p-6 mb-8"
        style={{ backgroundColor: '#ffffff' }}
      >
        <h2 className="mb-5 font-semibold text-lg text-gray-700">닉네임 변경하기</h2>

        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <div className="flex gap-3 items-center">
            <ProfileInput
              type="text"
              placeholder="닉네임을 입력해주세요."
              className="flex-[4]"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <Button
              onClick={handleNicknameCheck}
              style={{ backgroundColor: '#8C06AD', color: 'white' }}
              className="flex-[1]"
            >
              중복 확인
            </Button>
          </div>

          {isNicknameValid !== null && (
            <div className={`text-xs mt-[-6px] ${isNicknameValid ? 'text-green-500' : 'text-red-500'}`}>
              {isNicknameValid ? '사용 가능한 닉네임입니다.' : '사용 불가한 닉네임입니다.'}
            </div>
          )}

          <div className="flex gap-4 mt-8">
            <Button
              onClick={handleSaveChanges}
              className="w-full"
              style={{ backgroundColor: '#8C06AD', color: 'white' }}
            >
              변경사항 저장
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ProfileForm;
