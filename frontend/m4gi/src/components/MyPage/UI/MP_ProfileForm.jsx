import React, { useState } from 'react';
import ProfileInput from './MP_Profile_Input';
import Button from '../../Common/Button';
import MPProfile from './MP_Profile';

const ProfileForm = ({ currentNickname = '', providerCode, providerUserId }) => {
  const [nickname, setNickname] = useState(currentNickname);
  const [isNicknameValid, setIsNicknameValid] = useState(null);
  const [profileImage, setProfileImage] = useState(
    'https://cdn.builder.io/api/v1/image/assets/TEMP/a9ad187750c7c54a7e3c820456d11d7044d0723b'
  );
  const [uploading, setUploading] = useState(false);
  const [nicknameMessage, setNicknameMessage] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = (message) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalMessage('');
  };

const handleProfileImageUpdate = async (newImageUrl) => {
  console.log('handleProfileImageUpdate 호출, 인자:', newImageUrl);

  let profileUrl = '';

  if (typeof newImageUrl === 'string') {
    profileUrl = newImageUrl;
    setProfileImage(newImageUrl);
  } else if (newImageUrl && newImageUrl.profile_url) {
    profileUrl = newImageUrl.profile_url;
    setProfileImage(profileUrl);
  } else {
    console.warn('프로필 이미지 URL 형식이 예상과 다릅니다.', newImageUrl);
    return;
  }

  // 프로필 이미지 URL을 서버에 저장하는 API 호출
  try {
    const response = await fetch('/web/api/user/mypage/profile-image/update', {
      method: 'PUT', // 혹은 POST, API 명세에 따라
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 로그인 상태 유지용 쿠키 전달
      body: JSON.stringify({ profileImage: profileUrl }),
    });

    if (!response.ok) {
      throw new Error('프로필 이미지 저장 요청 실패');
    }

    const result = await response.json();
    console.log('서버에 프로필 이미지 저장 성공:', result);
    openModal('프로필 이미지가 성공적으로 업로드되고 저장되었습니다.');
  } catch (error) {
    console.error('프로필 이미지 저장 중 오류 발생:', error);
    openModal('프로필 이미지 저장 중 오류가 발생했습니다.');
  }
};


  const handleNicknameCheck = async () => {
    if (nickname === currentNickname) {
      setIsNicknameValid(true);
      setNicknameMessage('현재 닉네임과 동일합니다.');
      return;
    }

    if (nickname.trim().length < 2) {
      setIsNicknameValid(false);
      setNicknameMessage('닉네임은 최소 2글자 이상이어야 합니다.');
      return;
    }

    try {
      const response = await fetch(`/web/api/user/mypage/nickname/check?nickname=${encodeURIComponent(nickname)}`);
      if (!response.ok) throw new Error('네트워크 오류');

      const data = await response.json();

      if (data.isDuplicate) {
        setIsNicknameValid(false);
        setNicknameMessage('중복된 닉네임입니다.');
      } else {
        setIsNicknameValid(true);
        setNicknameMessage('사용 가능한 닉네임입니다.');
      }
    } catch (error) {
      console.error(error);
      openModal('닉네임 중복 확인 중 오류가 발생했습니다.');
    }
  };

  const handleSaveChanges = async () => {
    if (!isNicknameValid) return;

    try {
      const res = await fetch('/web/api/user/mypage/nickname/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, profileImage }),
        credentials: 'include',
      });

      if (!res.ok) throw new Error('닉네임 변경 요청 실패');
      await res.json();

      setIsNicknameValid(null);
      setNicknameMessage('변경사항이 저장되었습니다.');
      openModal('변경사항이 성공적으로 저장되었습니다.');
    } catch (err) {
      console.error(err);
      openModal('변경 저장 중 오류가 발생했습니다.');
    }
  };

  const handleCancel = () => {
    setNickname(currentNickname);
    setIsNicknameValid(null);
    setNicknameMessage('');
  };

  return (
    <section className="p-8 mx-auto max-w-[900px] w-full bg-white rounded-md" style={{ marginTop: '40px' }}>
      <h1 className="mb-6 text-3xl font-bold">정보 수정하기</h1>

      {/* 프로필 변경 */}
      <div className="border border-gray-300 rounded-md p-6 mb-10 bg-white">
        <h2 className="mb-5 font-semibold text-lg text-gray-700">프로필 변경하기</h2>
        <div className="relative flex justify-center items-center">
          <div className="p-2.5 h-[200px] w-[200px]">
            <MPProfile
              providerCode={providerCode}
              providerUserId={providerUserId}
              onUploadStart={() => setUploading(true)}
              onUploadEnd={() => setUploading(false)}
              onUploadSuccess={handleProfileImageUpdate}
              disabled={uploading}
            />
          </div>
        </div>
      </div>

      {/* 닉네임 변경 */}
      <div className="border border-gray-300 rounded-md p-6 mb-8 bg-white">
        <h2 className="mb-5 font-semibold text-lg text-gray-700">닉네임 변경하기</h2>
        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <div className="flex gap-3 items-center">
            <ProfileInput
              type="text"
              placeholder="닉네임을 입력해주세요."
              className="flex-[4]"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setIsNicknameValid(null);
                setNicknameMessage('');
              }}
              disabled={uploading}
            />
            <Button
              onClick={handleNicknameCheck}
              style={{ backgroundColor: '#8C06AD', color: 'white' }}
              className="flex-[1]"
              disabled={uploading}
            >
              중복 확인
            </Button>
          </div>

          {nicknameMessage && (
            <div
              className="text-xs mt-[-6px]"
              style={{
                color:
                  nicknameMessage === '사용 가능한 닉네임입니다.'
                    ? 'green'
                    : nicknameMessage === '중복된 닉네임입니다.'
                    ? 'red'
                    : 'black',
              }}
            >
              {nicknameMessage}
            </div>
          )}

          <div className="flex gap-4 mt-8">
            <Button
              onClick={handleSaveChanges}
              className="w-full"
              style={{ backgroundColor: '#8C06AD', color: 'white' }}
              disabled={!isNicknameValid || uploading}
              title={!isNicknameValid ? '닉네임 중복 확인 후 저장 가능합니다.' : ''}
            >
              변경사항 저장
            </Button>
            <Button onClick={handleCancel} className="w-full" disabled={uploading}>
              취소
            </Button>
          </div>
        </form>
      </div>

      {/* 모달 */}
      {modalVisible && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="bg-white rounded-md p-6 max-w-xs w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="modal-title" className="text-lg font-semibold mb-4">알림</h3>
            <p className="mb-6">{modalMessage}</p>
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              autoFocus
            >
              확인
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProfileForm;
