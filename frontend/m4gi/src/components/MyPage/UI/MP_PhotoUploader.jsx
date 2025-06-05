import React, { useEffect, useRef, useState } from "react";
import FormField from "./MP_FormField";
import FileUploader from "../../Test/FileUploader";

// 이미지 최대 업로드 개수
const MAX_IMAGES = 3;
// 고유 ID 생성기
const generateLocalId = () => `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

export default function PhotoUploader ({ onUploadComplete }) {
  const fileInputRef = useRef(null);
  const uploaderRef = useRef(null); // FileUploader 참조

  // 각 파일의 로컬 정보 및 서버 업로드 상태/결과 관리
  const [imageInfos, setImageInfos] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  // imageInfos 상태가 변경될 때마다 (특히 serverUrl이 채워질 때)
  // 성공적으로 업로드된 URL 목록을 부모 컴포넌트로 전달
  useEffect(() => {
    const successfullyUploadedUrls = imageInfos
      .filter(info => info.status === 'uploaded' && info.serverUrl)
      .map(info => info.serverUrl);
    console.log('🖼️ PhotoUploader: successfullyUploadedUrls 변경됨, onUploadComplete 호출 예정:', successfullyUploadedUrls);
    if( typeof onUploadComplete === 'function') {
      onUploadComplete?.(successfullyUploadedUrls);
    }
  }, [imageInfos, onUploadComplete]);

  const handleButtonClick = () => {
    if (imageInfos.length >= MAX_IMAGES) {
      setShowAlert(true);
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const newFilesSelected = Array.from(e.target.files);
    if(!newFilesSelected.length) return;

    for (const file of newFilesSelected) {
      if (!(file instanceof File)) {
        console.error("🚨 선택된 항목 중 File 객체가 아닌 것이 있습니다:", file);
        e.target.value = "";
        return;
      }
    }
    console.log("📄 선택된 파일 목록 (newFilesSelected):", newFilesSelected);

    const currentImageCount = imageInfos.length;
    const availableSlots = MAX_IMAGES - currentImageCount;

    if(availableSlots <= 0) {
      setShowAlert(true);
      e.target.value = "";
      return;
    }

    const filesToProcess = newFilesSelected.slice(0, availableSlots);
    if(newFilesSelected.length > filesToProcess.length) {
      setShowAlert(true); // 일부 파일만 추가됨 또는 최대 개수 도달 시 알림
    }
    console.log("🔄 처리할 파일 목록 (filesToProcess):", filesToProcess);

    const newImageEntries = filesToProcess.map(file => {
      const localId = generateLocalId();
      let previewUrl = '';
      try {
        previewUrl = URL.createObjectURL(file);
      } catch (error) {
        console.error(`🚨 URL.createObjectURL 오류 발생: file:`, file, error);
      }
      console.log(`🖼️ 생성된 previewUrl (${file.name}): ${previewUrl}`);
      console.log(`Generating entry for file: ${file.name}, localId: ${localId}`);
      return {
        localId: localId,
        fileObject: file,
        previewUrl: previewUrl, // 미리보기용
        status: 'pending',  // 초기 상태: 업로드 대기
        serverUrl: null,
        error: null,
      };
    });

    // 유효한 previewUrl을 가진 항목만 추가하거나, 오류 처리를 명확히 합니다.
    const validNewEntries = newImageEntries.filter(entry => entry.previewUrl !== '');
    if (validNewEntries.length !== newImageEntries.length) {
        console.warn("⚠️ 일부 파일의 미리보기 URL 생성에 실패했습니다.");
    }

    setImageInfos(prevInfos => [...prevInfos, ...newImageEntries]);
    console.log("ℹ️ 업데이트된 imageInfos:", [...imageInfos, ...newImageEntries]); // ✨ 상태 업데이트 직후 확인

    newImageEntries.forEach(entry => {
      if(uploaderRef.current && entry.fileObject instanceof File) {
        const uploadOptions = {
          type: 'review',  // 서버에서 이 타입으로 GCS 경로 등을 결정
        };
        console.log(`📞 Calling triggerUpload for localId: ${entry.localId}`); // ✨ 로그 추가
        uploaderRef.current.triggerUpload(entry.fileObject, uploadOptions, entry.localId);
      } else if (entry.status === 'failed') {
        console.warn(`🚫 ${entry.localId} 파일은 previewUrl 생성 실패로 업로드하지 않습니다.`);
      }
      else {
        console.error("🚫 uploaderRef가 없거나 유효하지 않은 파일 객체입니다:", entry.fileObject);
      }
    });
    e.target.value = "";
  };

  const handleRemove = (localIdToRemove) => {
    setImageInfos(prevInfos =>
      prevInfos.filter(info => {
        if (info.localId === localIdToRemove) {
          if (info.previewUrl && info.previewUrl.startsWith('blob:')) {
            console.log(`🗑️ Revoking object URL: ${info.previewUrl}`);
            URL.revokeObjectURL(info.previewUrl); // Blob URL 메모리 해제
          }
          // TODO: 만약 info.status === 'uploaded' 였고, 서버에서도 삭제해야 한다면
          // 여기서 서버 삭제 API 호출 (예: axios.delete(`/api/photos/${info.serverIdentifier}`))
          // 현재는 새로 작성하는 리뷰에 대한 것이므로, 서버 삭제는 고려하지 않음.
          return false; // 목록에서 제거
        }
        return true;
      })
    );
  };

  // FileUploader 콜백 함수들
  const handleUploadStart = (file, type, uploadId) => {
    console.log(`🚀 [${uploadId}] 업로드 시작:`, file.name);
    setImageInfos(prevInfos =>
      prevInfos.map(info =>
        info.localId === uploadId ? { ...info, status: 'uploading' } : info
      )
    );
  };

  const handleUploadSuccess = (responseData, uploadType, uploadId) => {
    console.log(`✅ [${uploadId}] 업로드 성공:`, responseData);
    if (responseData && typeof responseData.FileURL === 'string') {
      const gcsUrl = responseData.FileURL;
      setImageInfos(prevInfos =>
        prevInfos.map(info => {
          if (info.localId === uploadId) {
            // ✨ 업로드 성공 후 기존 blob URL 해제 (이미 gcsUrl로 대체됨)
            if (info.previewUrl && info.previewUrl.startsWith('blob:')) {
                console.log(`🗑️ 업로드 성공 후 기존 blob URL 해제: ${info.previewUrl}`);
                URL.revokeObjectURL(info.previewUrl);
            }
            return {
                ...info,
                status: 'uploaded',
                serverUrl: gcsUrl,
                previewUrl: gcsUrl,
                fileObject: null, // 업로드 후 File 객체는 필요 없을 수 있음
                error: null,
            };
          }
          return info;
        })
      );
    } else {
      // 서버 응답 형식이 예상과 다를 경우
      console.error(`❌ [${uploadId}] 업로드 성공했으나 서버 응답 형식 오류:`, responseData);
      handleUploadError({ message: '서버 응답 형식 오류', type: uploadType }, uploadId);
    }
  };

  const handleUploadError = (errorDetails, uploadId) => {
    console.error(`❌ [${uploadId}] 업로드 오류 상세:`, errorDetails);
    setImageInfos(prevInfos =>
      prevInfos.map(info =>
        info.localId === uploadId
          ? { ...info, status: 'failed', error: errorDetails.message }
          : info
      )
    );
    alert(`파일 업로드 실패: ${errorDetails.message}`);
  };

  console.log("🔄 PhotoUploader 렌더링, 현재 imageInfos:", imageInfos); // ✨ 컴포넌트 렌더링 시 imageInfos 상태 확인

  return (
    <FormField label="사진 선택 (최대 3장)" labelClassName="text-left w-full">
      <div className="w-full max-w-[750px] flex flex-col gap-3 relative">
        <button
          type="button"
          onClick={handleButtonClick}
          disabled={imageInfos.length >= MAX_IMAGES}
          className={`flex flex-col gap-2 items-center p-6 rounded-md border-2 border-dashed border-gray-300 w-full cursor-pointer hover:border-fuchsia-700 transition-colors duration-200${imageInfos.length >= MAX_IMAGES ? 'opacity-50 cursor-not-allowed' : '' }`}
        >
          <svg
            width="33"
            height="32"
            viewBox="0 0 33 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="upload-icon"
            style={{ width: "32px", height: "32px" }}
          >
            <path
              d="M28.5 16V25.3333C28.5 26.0406 28.219 26.7189 27.719 27.219C27.2189 27.719 26.5406 28 25.8333 28H7.16667C6.45942 28 5.78115 27.719 5.28105 27.219C4.78095 26.7189 4.5 26.0406 4.5 25.3333V6.66667C4.5 5.95942 4.78095 5.28115 5.28105 4.78105C5.78115 4.28095 6.45942 4 7.16667 4H16.5"
              stroke="#71717A"
              strokeWidth="2.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M21.8333 6.66699H29.8333"
              stroke="#71717A"
              strokeWidth="2.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M25.8333 2.66699V10.667"
              stroke="#71717A"
              strokeWidth="2.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M12.4999 14.6663C13.9727 14.6663 15.1666 13.4724 15.1666 11.9997C15.1666 10.5269 13.9727 9.33301 12.4999 9.33301C11.0272 9.33301 9.83325 10.5269 9.83325 11.9997C9.83325 13.4724 11.0272 14.6663 12.4999 14.6663Z"
              stroke="#71717A"
              strokeWidth="2.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M28.5 19.9999L24.3853 15.8853C23.8853 15.3853 23.2071 15.1045 22.5 15.1045C21.7929 15.1045 21.1147 15.3853 20.6147 15.8853L8.5 27.9999"
              stroke="#71717A"
              strokeWidth="2.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
          <span className="flex flex-col text-xs leading-5 text-center text-zinc-500 max-sm:text-xs">
            <span>클릭하여 사진 업로드</span>
            <span>(최대 {imageInfos.length}/{MAX_IMAGES}장 선택 가능)</span>
          </span>
        </button>

        {/* 썸네일 미리보기 및 삭제 버튼 */}
        {imageInfos.length > 0 && (
          <div className="flex gap-4 mt-3 flex-wrap">
            {imageInfos.map((info, idx) => {
              const objectUrl = URL.createObjectURL(info.fileObject);
              return (
                <div key={idx} className="relative w-20 h-20 rounded-md overflow-hidden border border-gray-300">
                  <img
                    src={objectUrl}
                    alt={`선택된 이미지 ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {(info.status === 'uploading' || info.status === 'failed') && (
                      <div className={`absolute inset-0 flex items-center justify-center text-white text-xs p-1 text-center ${info.status === 'uploading' ? 'bg-black bg-opacity-60' : 'bg-red-500 bg-opacity-80'}`}>
                          {info.status === 'uploading' && '업로드 중...'}
                          {info.status === 'failed' && `실패`}
                      </div>
                  )}
                  {(info.status !== 'uploading') && (
                      <button
                          type="button"
                          onClick={() => handleRemove(info.localId)} // idx -> info.localId
                          className="absolute top-0 right-0 bg-black bg-opacity-50 text-white rounded-bl-md px-1.5 py-0.5 text-xs hover:bg-opacity-75 transition-opacity opacity-0 group-hover:opacity-100"
                          aria-label="사진 삭제"
                      >
                          ×
                      </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 모달 경고 */}
        {showAlert && (
        <div className="absolute ">
          <div className="bg-white rounded-md p-5 max-w-xs w-full text-center shadow-lg border border-gray-300">
            <p className="mb-4 text-gray-700">사진은 최대 {MAX_IMAGES}까지 업로드 가능합니다.</p>
            <button
              onClick={() => setShowAlert(false)}
              className="px-4 py-2 bg-fuchsia-700 text-white rounded hover:bg-fuchsia-800 transition"
            >
              확인
            </button>
          </div>
        </div>
      )}
        <input
          ref={fileInputRef}
          type="file"
          multiple // 여러 파일 선택 허용
          accept="image/*" // 이미지 파일만
          onChange={handleFileChange}
          className="hidden"
        />
        {/* 로직 전용 FileUploader 인스턴스 (UI 없음) */}
        <FileUploader
          ref={uploaderRef}
          onUploadStart={handleUploadStart}
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
        />
      </div>
    </FormField>
  );
};
