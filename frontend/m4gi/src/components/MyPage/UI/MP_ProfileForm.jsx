import React, { useRef, useState } from 'react';
import ProfileInput from './MP_Profile_Input';
import Button from '../../Common/Button';

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
  const fileInputRef = useRef(null);

  // 모달 열기 함수
  const openModal = (message) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setModalVisible(false);
    setModalMessage('');
  };

  const handleNicknameCheck = () => {
    // 현재 닉네임과 동일할 경우 중복 검사 없이 메시지 출력
    if (nickname === currentNickname) {
      setIsNicknameValid(true);  // 유효함으로 처리
      setNicknameMessage('현재 닉네임과 동일합니다.');
      return;
    }

    if (nickname.length < 2) {
      setIsNicknameValid(false);
      setNicknameMessage('닉네임은 최소 2글자 이상이어야 합니다.');
      return;
    }

    fetch(`/web/api/user/mypage/nickname/check?nickname=${encodeURIComponent(nickname)}`)
      .then(res => {
        if (!res.ok) throw new Error('네트워크 응답이 좋지 않습니다.');
        return res.json();
      })
      .then(data => {
        if (data.isDuplicate) {
          setIsNicknameValid(false);
          setNicknameMessage('중복된 닉네임입니다.');
        } else {
          setIsNicknameValid(true);
          setNicknameMessage('사용 가능한 닉네임입니다.');
        }
      })
      .catch(err => {
        console.error(err);
        openModal('닉네임 중복 확인 중 오류가 발생했습니다.');
      });
  };

  const handleSaveChanges = () => {
    if (!isNicknameValid) return;

    fetch('/web/api/user/mypage/nickname/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickname }),
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) throw new Error('닉네임 변경 요청 실패');
        return res.json();
      })
      .then(() => {
        setIsNicknameValid(null);
        setNicknameMessage('변경사항이 저장되었습니다.');
      })
      .catch(err => {
        console.error(err);
        openModal('변경 저장 중 오류가 발생했습니다.');
      });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !providerCode || !providerUserId) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('providerCode', providerCode);
    formData.append('providerUserId', providerUserId);
    formData.append('type', 'profile');

    setUploading(true);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!res.ok) throw new Error('이미지 업로드 실패');

      const data = await res.json();
      if (data?.data?.imageUrl) {
        setProfileImage(data.data.imageUrl);
      } else {
        throw new Error('이미지 URL이 없습니다.');
      }
    } catch (err) {
      console.error('[업로드 오류]', err.message || '알 수 없는 오류');
      openModal(`[업로드 오류] ${err.message || '알 수 없는 오류'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSettingsClick = () => {
    fileInputRef.current?.click();
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
            <img src={profileImage} alt="Avatar" className="h-[180px] w-[180px] object-cover rounded-full" />
          </div>

          <button
            type="button"
            onClick={handleSettingsClick}
            className="absolute bottom-3 right-[calc(50%-90px)] cursor-pointer rounded-full"
            aria-label="프로필 이미지 변경"
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#EDDDF4',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            disabled={uploading}
            title={uploading ? '이미지 업로드 중...' : ''}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#8C06AD"
              strokeWidth={2}
              style={{ width: '24px', height: '24px' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h2l2-3h6l2 3h2a2 2 0 012 2v7a2 2 0 01-2 2H3a2 2 0 01-2-2V9a2 2 0 012-2z" />
              <circle cx="12" cy="13" r="3" stroke="#8C06AD" strokeWidth={2} />
            </svg>
          </button>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
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

          {/* 메시지 표시 */}
          {nicknameMessage && (
            <div
              className="text-xs mt-[-6px]"
              style={{
                color:
                  nicknameMessage === '현재 닉네임과 동일합니다.' ||
                  nicknameMessage === '닉네임은 최소 2글자 이상이어야 합니다.'
                    ? 'black'
                    : isNicknameValid
                    ? 'green'
                    : 'red',
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
