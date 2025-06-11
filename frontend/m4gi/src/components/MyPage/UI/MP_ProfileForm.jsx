import React, { useState, useEffect } from 'react';
import ProfileInput from './MP_Profile_Input';
import Button from '../../Common/Button';
import MPProfile from './MP_Profile';

const ProfileForm = ({ currentNickname = '', providerCode, providerUserId }) => {
  const [nickname, setNickname] = useState(currentNickname);
  const [isNicknameValid, setIsNicknameValid] = useState(null); // null: 확인 전, true: 유효함, false: 유효하지 않음
  const [profileImage, setProfileImage] = useState(
    'https://cdn.builder.io/api/v1/image/assets/TEMP/a9ad187750c7c54a7e3c820456d11d7044d0723b'
  );
  const [uploading, setUploading] = useState(false);
  const [nicknameMessage, setNicknameMessage] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  // currentNickname이 변경될 때마다 nickname 상태와 유효성 상태 초기화
  useEffect(() => {
    setNickname(currentNickname);
    setIsNicknameValid(null); // 닉네임이 바뀌면 유효성 검사 상태를 '확인 전'으로 초기화
    setNicknameMessage(''); // 메시지도 초기화
  }, [currentNickname]);

  // 모달을 열기 위한 함수
  const openModal = (message) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  // 모달을 닫기 위한 함수
  const closeModal = () => {
    setModalVisible(false);
    setModalMessage('');
  };

  // 프로필 이미지 업데이트 처리 함수 (기존 로직 유지)
  const handleProfileImageUpdate = async (newImageUrl) => {
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
    try {
      const response = await fetch('/web/api/user/mypage/profile-image/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ profileImage: profileUrl }),
      });
      if (!response.ok) throw new Error('프로필 이미지 저장 요청 실패');
      const result = await response.json();
      openModal('프로필 이미지가 성공적으로 업로드되고 저장되었습니다.');
    } catch (error) {
      console.error('프로필 이미지 저장 중 오류 발생:', error);
      openModal('프로필 이미지 저장 중 오류가 발생했습니다.');
    }
  };

  // 닉네임 중복 확인 처리 함수 (기존 로직 유지)
  const handleNicknameCheck = async () => {
    const trimmedNickname = nickname.trim();
    if (trimmedNickname === currentNickname) {
      setIsNicknameValid(false); // 현재 닉네임과 같으면 유효하지 않음
      setNicknameMessage('현재 사용중인 닉네임 입니다.');
      return;
    }
    if (trimmedNickname.length < 2) {
      setIsNicknameValid(false); // 2글자 미만이면 유효하지 않음
      setNicknameMessage('닉네임은 최소 2글자 이상이어야 합니다.');
      return;
    }
    try {
      // API 호출
      const response = await fetch(`/web/api/user/mypage/nickname/check?nickname=${encodeURIComponent(trimmedNickname)}`);
      if (!response.ok) throw new Error('네트워크 오류');
      const data = await response.json();
      if (data.isDuplicate) {
        setIsNicknameValid(false); // 중복이면 유효하지 않음
        setNicknameMessage('중복된 닉네임입니다.');
      } else {
        setIsNicknameValid(true); // 사용 가능하면 유효함
        setNicknameMessage('사용 가능한 닉네임입니다.');
      }
    } catch (error) {
      console.error(error);
      openModal('닉네임 중복 확인 중 오류가 발생했습니다.');
    }
  };

  // 변경사항 저장 처리 함수 - **이 부분이 수정되었습니다.**
  const handleSaveChanges = async () => {
    console.log('handleSaveChanges 호출됨');
    console.log('현재 nickname:', nickname);
    console.log('현재 currentNickname:', currentNickname);
    console.log('현재 isNicknameValid:', isNicknameValid); 

    // CASE 1: 닉네임 중복 확인을 한 번도 하지 않았을 경우 (isNicknameValid가 초기값 null인 상태)
    // 또는, 닉네임 필드를 수정하여 isNicknameValid가 null로 초기화된 경우
    if (isNicknameValid === null) {
      console.log('모달 조건: isNicknameValid === null');
      openModal('닉네임 중복 확인이 필요합니다.');
      return; // 함수 실행 중단
    }
    
    // CASE 2: 닉네임 중복 확인을 했지만, 유효하지 않은 닉네임인 경우 (isNicknameValid가 false인 상태)
    if (!isNicknameValid) {
      console.log('모달 조건: !isNicknameValid');
      openModal('중복 확인 후 닉네임을 변경할 수 있습니다.');
      return; // 함수 실행 중단
    }

    // 위에 두 조건에 해당하지 않으면, 닉네임이 유효하다고 판단하고 저장 로직 진행
    try {
      const res = await fetch('/web/api/user/mypage/nickname/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, profileImage }),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('닉네임 변경 요청 실패');
      await res.json();
      // 저장 성공 후 상태 초기화 및 메시지 설정
      setIsNicknameValid(null); 
      setNicknameMessage('변경사항이 저장되었습니다.');
      openModal('변경사항이 성공적으로 저장되었습니다.');
    } catch (err) {
      console.error(err);
      openModal('변경 저장 중 오류가 발생했습니다.');
    }
  };

  // 취소 버튼 처리 함수
  const handleCancel = () => {
    setNickname(currentNickname); // 원래 닉네임으로 되돌림
    setIsNicknameValid(null); // 유효성 상태 초기화
    setNicknameMessage(''); // 메시지 초기화
  };

  return (
    <section className="p-8 mx-auto max-w-[900px] w-full bg-white rounded-md" style={{ marginTop: '40px' }}>
      <h1 className="mb-6 text-3xl font-bold">정보 수정하기</h1>

      {/* 프로필 이미지 변경 섹션 */}
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

      {/* 닉네임 변경 섹션 */}
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
                setIsNicknameValid(null); // 닉네임이 변경되면 유효성 상태를 다시 '확인 전'으로 설정
                setNicknameMessage(''); // 메시지 초기화
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

          {/* 닉네임 유효성 메시지 표시 */}
          {nicknameMessage && (
            <div
              className="text-xs mt-[-6px]"
              style={{
                color:
                  nicknameMessage === '사용 가능한 닉네임입니다.'
                    ? 'green'
                    : nicknameMessage.includes('중복') || nicknameMessage.includes('최소') || nicknameMessage.includes('현재 사용중인')
                    ? 'red'
                    : 'black', // 그 외 메시지는 검은색
              }}
            >
              {nicknameMessage}
            </div>
          )}

          {/* 변경사항 저장 및 취소 버튼 */}
          <div className="flex gap-4 mt-8">
            <div className="w-full">
              <Button
                onClick={handleSaveChanges}
                className="w-full text-white"
                style={{ backgroundColor: '#8C06AD' }}
                // disabled={!isNicknameValid || uploading} // <-- 이전 코드
                disabled={uploading} // **이 부분이 수정되었습니다.**
              >
                변경사항 저장
              </Button>
            </div>
            
            <Button
              onClick={handleCancel}
              className="w-full border border-[#8C06AD] text-[#8C06AD] hover:bg-[#8C06AD]/10"
              disabled={uploading}
            >
              취소
            </Button>
          </div>
        </form>
      </div>

      {/* 모달 컴포넌트 */}
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
            onClick={(e) => e.stopPropagation()} // 모달 배경 클릭 시 닫히는 것을 방지
          >
            <h3 id="modal-title" className="text-lg font-semibold mb-4">알림</h3>
            <p className="mb-6">{modalMessage}</p>
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              autoFocus // 모달 열릴 때 자동으로 포커스
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