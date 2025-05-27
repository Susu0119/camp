import React, { useState, useEffect, useRef } from 'react'; // useRef 추가
import axios from "axios";
import FileUploader from "./FileUploader"; // 기존 FileUploader (수정 X)

export default function UserTest() {
    const [profileImageUrl, setProfileImageUrl] = useState('');
    // 로딩 및 에러 상태는 간결함을 위해 기본적인 console.error 처리만 남기고 UI에서는 생략합니다.
    // 필요하다면 이전 답변처럼 isLoading, error 상태를 추가하여 UI에 표시할 수 있습니다.

    const fileUploaderRef = useRef(null); // FileUploader에 대한 ref
    const fileInputRef = useRef(null);  // 숨겨진 file input에 대한 ref

    // providerCode와 providerUserId는 고정값으로 가정
    const providerCode = 3;
    const providerUserId = 'puid_0030';

    useEffect(() => {
        const UserProfile = async () => {
            try {
                // DB에 저장된 실제 프로필 이미지 URL을 가져옵니다.
                const response = await axios.get(`/web/api/user/mypage/${providerCode}/${providerUserId}`);
                // UserDTO의 필드명이 'profileImage'라고 가정합니다.
                if (response.data && response.data.profileImage) {
                    setProfileImageUrl(response.data.profileImage);
                } else {
                    setProfileImageUrl(''); // DB에 프로필 이미지가 없는 경우
                }
            } catch (err) {
                console.error("DB에서 사용자 프로필 정보 로딩 실패:", err);
                setProfileImageUrl('');
            }
        };
        UserProfile();
    }, []); // 컴포넌트 마운트 시 1회만 실행

    // 'No Image' div 클릭 시 숨겨진 파일 입력창을 엽니다.
    const handleClick = () => {
        fileInputRef.current?.click();
    };

    // 파일이 선택되면 FileUploader를 통해 업로드를 시도합니다.
    const handleUpload = (event) => {
        const file = event.target.files[0];
        if (file && fileUploaderRef.current) {
            // FileUploader.jsx의 triggerUpload는 file만 인자로 받습니다.
            // 내부적으로 '/web/api/upload'로 요청합니다.
            const uploadOptions = {
                type: 'profile',
                providerCode: providerCode,
                providerUserId: providerUserId
            };
            fileUploaderRef.current.triggerUpload(file, uploadOptions);
        }
        // 동일 파일 재선택을 위해 input 값 초기화
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <>
            {profileImageUrl ? (
                <img
                    src={profileImageUrl}
                    alt="User Profile"
                    onClick={handleClick}
                    className="w-[150px] h-[150px] rounded-full object-fill border-2 border-gray-300 cursor-pointer"
                />
            ) : (
                // profileImageUrl이 없을 때 이 div가 표시되고, 클릭 시 업로드 시도
                <div
                    className='no-image flex items-center justify-center w-[150px] h-[150px] rounded-full bg-gray-100 border-2 border-dashed border-gray-300 text-gray-400 cursor-pointer'
                    onClick={handleClick}
                    title="클릭하여 이미지 업로드"
                >
                    No Image
                </div>
            )}

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleUpload}
                style={{ display: 'none' }}
                accept="image/*"
            />

            <FileUploader
                ref={fileUploaderRef}
                onUploadStart={() => {
                    console.log('업로드 시작 (to /web/api/upload)');
                }}
                onUploadSuccess={(data, type) => { // /web/api/upload 응답은 { "FileURL": "..." } 형태
                    console.log('업로드 성공 (from /web/api/upload):', data);
                    if (type === 'profile' && data && data.profile_url) {
                        setProfileImageUrl(data.profile_url)
                    }
                }}
                onUploadError={(error) => {
                    console.error('업로드 실패 (to /web/api/upload):', error);
                    alert(`이미지 업로드 실패: ${error.message || '알 수 없는 오류'}`);
                }}
            />
        </>
    );
}