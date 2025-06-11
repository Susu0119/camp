import React, { useState, useEffect } from 'react';
import ProfileInput from './MP_Profile_Input';
import Button from '../../Common/Button';
import MPProfile from './MP_Profile';
import Swal from 'sweetalert2'; // SweetAlert2 임포트

const ProfileForm = ({ currentNickname = '', providerCode, providerUserId }) => {
  const [nickname, setNickname] = useState(currentNickname);
  const [isNicknameValid, setIsNicknameValid] = useState(null); // null: 확인 전, true: 유효함, false: 유효하지 않음
  const [profileImage, setProfileImage] = useState(
    'https://cdn.builder.io/api/v1/image/assets/TEMP/a9ad187750c7c54a7e3c820456d11d7044d0723b'
  );
  const [uploading, setUploading] = useState(false);
  const [nicknameMessage, setNicknameMessage] = useState('');

  // 기존 modalMessage와 modalVisible 상태는 SweetAlert2로 대체되므로 제거합니다.
  // const [modalMessage, setModalMessage] = useState('');
  // const [modalVisible, setModalVisible] = useState(false);

  // currentNickname이 변경될 때마다 nickname 상태와 유효성 상태 초기화
  useEffect(() => {
    setNickname(currentNickname);
    setIsNicknameValid(null); // 닉네임이 바뀌면 유효성 검사 상태를 '확인 전'으로 초기화
    setNicknameMessage(''); // 메시지도 초기화
  }, [currentNickname]);

  // SweetAlert2로 알림을 띄우는 함수로 변경합니다.
  const showAlert = (title, text, icon = 'info') => {
    Swal.fire({
      title: title,
      text: text,
      icon: icon, // 'success', 'error', 'warning', 'info', 'question' 중 하나
      confirmButtonText: '확인',
      confirmButtonColor: '#8C06AD', // 버튼 색상 변경
    });
  };

  // 기존 openModal, closeModal 함수는 더 이상 사용하지 않습니다.

  // 프로필 이미지 업데이트 처리 함수
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
      showAlert('알림', '프로필 이미지가 성공적으로 업로드되고 저장되었습니다.', 'success'); // SweetAlert2 호출
    } catch (error) {
      console.error('프로필 이미지 저장 중 오류 발생:', error);
      showAlert('오류', '프로필 이미지 저장 중 오류가 발생했습니다.', 'error'); // SweetAlert2 호출
    }
  };

  // 닉네임 중복 확인 처리 함수
  const handleNicknameCheck = async () => {
    const trimmedNickname = nickname.trim();
    if (trimmedNickname === currentNickname) {
      setIsNicknameValid(false);
      setNicknameMessage('현재 사용중인 닉네임 입니다.');
      showAlert('알림', '현재 사용중인 닉네임 입니다.', 'warning'); // SweetAlert2 추가
      return;
    }
    if (trimmedNickname.length < 2) {
      setIsNicknameValid(false);
      setNicknameMessage('닉네임은 최소 2글자 이상이어야 합니다.');
      showAlert('경고', '닉네임은 최소 2글자 이상이어야 합니다.', 'warning'); // SweetAlert2 추가
      return;
    }
    try {
      const response = await fetch(`/web/api/user/mypage/nickname/check?nickname=${encodeURIComponent(trimmedNickname)}`);
      if (!response.ok) throw new Error('네트워크 오류');
      const data = await response.json();
      if (data.isDuplicate) {
        setIsNicknameValid(false);
        setNicknameMessage('중복된 닉네임입니다.');
        showAlert('알림', '중복된 닉네임입니다.', 'warning'); // SweetAlert2 추가
      } else {
        setIsNicknameValid(true);
        setNicknameMessage('사용 가능한 닉네임입니다.');
        showAlert('알림', '사용 가능한 닉네임입니다.', 'success'); // SweetAlert2 추가
      }
    } catch (error) {
      console.error(error);
      showAlert('오류', '닉네임 중복 확인 중 오류가 발생했습니다.', 'error'); // SweetAlert2 추가
    }
  };

  // 변경사항 저장 처리 함수
  const handleSaveChanges = async () => {
    console.log('handleSaveChanges 호출됨');
    console.log('현재 nickname:', nickname);
    console.log('현재 currentNickname:', currentNickname);
    console.log('현재 isNicknameValid:', isNicknameValid); 

    if (isNicknameValid === null) {
      console.log('모달 조건: isNicknameValid === null');
      showAlert('알림', '닉네임 중복 확인이 필요합니다.', 'warning'); // SweetAlert2 호출
      return;
    }
    
    if (!isNicknameValid) {
      console.log('모달 조건: !isNicknameValid');
      showAlert('알림', '중복 확인 후 닉네임을 변경할 수 있습니다.', 'warning'); // SweetAlert2 호출
      return;
    }

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
      showAlert('성공', '변경사항이 성공적으로 저장되었습니다.', 'success'); // SweetAlert2 호출
    } catch (err) {
      console.error(err);
      showAlert('오류', '변경 저장 중 오류가 발생했습니다.', 'error'); // SweetAlert2 호출
    }
  };

  // 취소 버튼 처리 함수
  const handleCancel = () => {
    setNickname(currentNickname);
    setIsNicknameValid(null);
    setNicknameMessage('');
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
                    : 'black',
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
                disabled={uploading}
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

      {/* SweetAlert2를 사용하므로 이 모달 컴포넌트는 제거합니다. */}
      {/* {modalVisible && (
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
      )} */}
    </section>
  );
};

export default ProfileForm;