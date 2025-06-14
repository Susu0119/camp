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
  const [nicknameMessage, setNicknameMessage] = useState(''); // 닉네임 유효성 메시지 상태 유지

  // SweetAlert2로 알림을 띄우는 함수 (콜백 기능 추가)
  const showAlert = (title, text, icon = 'info', callback) => {
    Swal.fire({
      title: title,
      text: text,
      icon: icon, // 'success', 'error', 'warning', 'info', 'question' 중 하나
      confirmButtonText: '확인',
      confirmButtonColor: '#8C06AD', // 버튼 색상 변경
    }).then((result) => {
      if (result.isConfirmed && callback) {
        callback(); // 확인 버튼을 눌렀을 때 실행할 콜백 함수
      }
    });
  };

  // currentNickname이 변경될 때마다 nickname 상태와 유효성 상태 초기화
  useEffect(() => {
    setNickname(currentNickname);
    setIsNicknameValid(null); // 닉네임이 바뀌면 유효성 검사 상태를 '확인 전'으로 초기화
    setNicknameMessage(''); // 메시지도 초기화
  }, [currentNickname]);

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
      showAlert('알림', '프로필 이미지가 성공적으로 업로드되고 저장되었습니다.', 'success'); // SweetAlert2
    } catch (error) {
      console.error('프로필 이미지 저장 중 오류 발생:', error);
      showAlert('오류', '프로필 이미지 저장 중 오류가 발생했습니다.', 'error'); // SweetAlert2
    }
  };

  // 닉네임 중복 확인 처리 함수
  const handleNicknameCheck = async () => {
    const trimmedNickname = nickname.trim();

    // 닉네임 필드에 내용이 비어있거나 현재 닉네임과 동일한 경우는 여기서 처리하지 않고 handleSaveChanges에서 SweetAlert2로 안내
    if (trimmedNickname.length < 2) {
      setIsNicknameValid(false);
      setNicknameMessage('닉네임은 최소 2글자 이상이어야 합니다.'); // 텍스트 메시지 표시
      return;
    }
    if (trimmedNickname === currentNickname) {
      setIsNicknameValid(false);
      setNicknameMessage('현재 사용중인 닉네임 입니다.'); // 텍스트 메시지 표시
      return;
    }
    
    try {
      const response = await fetch(`/web/api/user/mypage/nickname/check?nickname=${encodeURIComponent(trimmedNickname)}`);
      if (!response.ok) throw new Error('네트워크 오류');
      const data = await response.json();
      if (data.isDuplicate) {
        setIsNicknameValid(false);
        setNicknameMessage('중복된 닉네임입니다.'); // 텍스트 메시지 표시
      } else {
        setIsNicknameValid(true);
        setNicknameMessage('사용 가능한 닉네임입니다.'); // 텍스트 메시지 표시
      }
    } catch (error) {
      console.error(error);
      showAlert('오류', '닉네임 중복 확인 중 오류가 발생했습니다.', 'error'); // SweetAlert2 유지
    }
  };

  // 변경사항 저장 처리 함수 - **이 부분이 수정되었습니다.**
  const handleSaveChanges = async () => {
    console.log('handleSaveChanges 호출됨');
    console.log('현재 nickname:', nickname);
    console.log('현재 currentNickname:', currentNickname);
    console.log('현재 isNicknameValid:', isNicknameValid); 

    const trimmedNickname = nickname.trim(); // 닉네임 양쪽 공백 제거

    // 1. 닉네임 필드가 비어있는 경우
    if (!trimmedNickname) {
        showAlert('경고', '닉네임을 입력해주세요.', 'warning');
        return;
    }
    
    // 2. 현재 사용중인 닉네임과 동일한데, 중복 확인을 거치지 않은 경우
    // isNicknameValid가 null인 상태에서 currentNickname과 nickname이 같으면
    // '현재 사용중인 닉네임 입니다.' SweetAlert2 메시지 출력
    if (trimmedNickname === currentNickname && isNicknameValid === null) {
        showAlert('알림', '현재 사용중인 닉네임 입니다.', 'warning');
        setIsNicknameValid(false); // 저장 방지를 위해 상태를 false로 설정
        return;
    }

    // 3. 닉네임이 최소 글자 수 미만인 경우 (닉네임 필드가 비어있지 않고 2글자 미만)
    if (trimmedNickname.length < 2) {
        showAlert('경고', '닉네임은 최소 2글자 이상이어야 합니다.', 'warning');
        setIsNicknameValid(false); // 저장 방지를 위해 상태를 false로 설정
        return;
    }

    // 4. 닉네임 중복 확인을 아예 하지 않았거나 (isNicknameValid === null),
    //    중복 확인 결과 닉네임이 유효하지 않은 경우 (!isNicknameValid)
    //    단, 닉네임 필드가 currentNickname과 같지 않아야 함 (위에서 이미 처리했으므로 중복 체크를 위한 조건)
    if (isNicknameValid === null) {
      console.log('모달 조건: isNicknameValid === null (최종)');
      showAlert('알림', '닉네임 중복 확인이 필요합니다.', 'warning'); 
      return;
    }
    
    if (!isNicknameValid) { // 중복 확인 버튼을 눌렀는데 유효하지 않은 경우 (중복되거나 조건 미충족)
      console.log('모달 조건: !isNicknameValid (최종)');
      showAlert('알림', '중복 확인 후 닉네임을 변경할 수 있습니다.', 'warning'); 
      return;
    }

    // 모든 유효성 검사를 통과했으면 저장 로직 진행
    try {
      const res = await fetch('/web/api/user/mypage/nickname/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: trimmedNickname, profileImage }), // trimmedNickname 사용
        credentials: 'include',
      });
      if (!res.ok) throw new Error('닉네임 변경 요청 실패');
      await res.json();
      setIsNicknameValid(null); // 저장 성공 후 유효성 상태 초기화
      setNicknameMessage('변경사항이 저장되었습니다.'); // 텍스트 메시지 표시
      showAlert('성공', '변경사항이 성공적으로 저장되었습니다.', 'success'); // SweetAlert2
    } catch (err) {
      console.error(err);
      showAlert('오류', '변경 저장 중 오류가 발생했습니다.', 'error'); // SweetAlert2
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

          {/* 닉네임 유효성 메시지 표시 - 이 부분이 기존처럼 텍스트로 표시됩니다. */}
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

      {/* SweetAlert2를 사용하므로 기존 모달 컴포넌트는 제거했습니다. */}
    </section>
  );
};

export default ProfileForm;