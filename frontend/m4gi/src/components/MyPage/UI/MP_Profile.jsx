import React, { useState, useEffect, useRef } from 'react'; // useRef 추가
import { useAuth } from '../../../utils/Auth.jsx';
import FileUploader from "../../Common/FileUploader";

export default function MPProfile({providerCode,providerUserId}) {
    const { user, isAuthenticated } = useAuth(); // useAuth 훅 사용
    const [profileImageUrl, setProfileImageUrl] = useState('');
    
    const fileUploaderRef = useRef(null); // FileUploader에 대한 ref
    const fileInputRef = useRef(null);  // 숨겨진 file input에 대한 ref

    useEffect(() => {
        // 🔧 useAuth에서 사용자 정보를 가져와서 프로필 이미지 설정
        if (isAuthenticated && user && user.profileImage) {
            console.log('useAuth에서 프로필 이미지 설정:', user.profileImage);
            setProfileImageUrl(user.profileImage);
        } else if (isAuthenticated && user && !user.profileImage) {
            console.log('사용자는 로그인되어 있지만 프로필 이미지가 없음');
            setProfileImageUrl('');
        } else {
            console.log('사용자가 로그인되지 않음 또는 사용자 정보 없음');
            setProfileImageUrl('');
        }
    }, [user, isAuthenticated]); // user와 isAuthenticated 상태가 변경될 때마다 실행

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
                    console.log('프로필 업로드 성공:', data);
                    
                    if (type === 'profile' && data && data.profile_url) {
                        setProfileImageUrl(data.profile_url);
                        
                        // ProfileButton에게 프로필 이미지가 변경되었음을 알리는 커스텀 이벤트 발생
                        const profileUpdateEvent = new CustomEvent('profileImageUpdated', {
                            detail: { newImageUrl: data.profile_url }
                        });
                        window.dispatchEvent(profileUpdateEvent);
                        console.log('프로필 이미지 업데이트 이벤트 발생');
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