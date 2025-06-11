// src/FileUploader.jsx
import { useImperativeHandle, forwardRef } from 'react';
import { apiCore } from '../../utils/Auth.jsx';

const DEFAULT_API_ENDPOINT = '/api/upload'; // 기본 API 엔드포인트

export default forwardRef(function FileUploader(
    { // Props: 콜백 함수들
        onUploadStart,
        onUploadSuccess,
        onUploadError,
        onUploadProgress
    },
    ref // 부모로부터 전달된 ref
) {

    // 핵심 업로드 로직 함수
    const performUploadLogic = async (fileToUpload, options = {}, uploadId = null) => {
        const { type, providerCode, providerUserId, folder } = options;
        
        if (!fileToUpload) {
            const errorMsg = '업로드할 파일이 선택되지 않았습니다.';
            onUploadError?.({ message: errorMsg, code: 'NO_FILE_SELECTED', type }, uploadId);
            return null;
        }

        onUploadStart?.(fileToUpload, type, uploadId); // 어떤 타입의 업로드가 시작되는지 알릴 수 있음

        let apiEndpoint = DEFAULT_API_ENDPOINT; // 기본값으로 설정

        // 'type'에 따라 API 엔드포인트 결정
        if (type === 'profile') {
            if (providerCode === undefined || providerUserId === undefined) {
                const errorMsg = '프로필 타입 업로드 시 providerCode와 providerUserId가 필요합니다.';
                onUploadError?.({ message: errorMsg, code: 'MISSING_PROFILE_PARAMS', type }, uploadId);
                return null;
            }
            // 프로필 업로드용 엔드포인트 구성
            apiEndpoint = `/api/user/mypage/${providerCode}/${providerUserId}/profile`;
        }
        // 다른 타입이 있다면 여기에 else if (type === 'otherType') { ... } 추가

        const formData = new FormData();
        formData.append('file', fileToUpload);

        if (folder) {
            formData.append('folder', folder);
        }

        try {
            console.log(`[FileUploader] Uploading to: ${apiEndpoint} (type: ${type || 'default'}, uploadId: ${uploadId})`);
            const response = await apiCore.post(apiEndpoint, formData, {
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.lengthComputable && progressEvent.total) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        onUploadProgress?.(percentCompleted, type, uploadId);
                    }
                },
            });

            const responseData = response.data;
            // 성공 콜백 시, 어떤 타입의 업로드였는지와 함께 데이터 전달
            onUploadSuccess?.(responseData, type, uploadId);
            return responseData;

        } catch (error) {
            let specificMessage = `업로드 오류 발생: ${error.message}`;
            let errorCode = 'GENERIC_ERROR';

            if (error.response) {
                const serverErrorData = error.response.data;
                specificMessage = `업로드 실패: ${serverErrorData && serverErrorData.message
                    ? serverErrorData.message
                    : error.response.statusText || '서버 오류'
                    }`;
                errorCode = String(error.response.status);
            } else if (error.request) {
                specificMessage = '업로드 실패: 서버로부터 응답이 없습니다.';
                errorCode = 'NETWORK_ERROR';
            }
            // 에러 콜백 시에도 타입 정보 전달
            onUploadError?.({ message: specificMessage, code: errorCode, originalError: error, type }, uploadId);
            return null;
        }
    };

    useImperativeHandle(ref, () => ({
        /**
         * 파일을 업로드합니다.
         * @param {File} file - 업로드할 파일 객체
         * @param {object} [options={}] - 업로드 옵션.
         * @param {string} [options.type] - 업로드 타입 (예: 'profile'). 없으면 기본 업로드.
         * @param {number|string} [options.providerCode] - 'profile' 타입일 때 필요한 providerCode.
         * @param {string} [options.providerUserId] - 'profile' 타입일 때 필요한 providerUserId.
         * @param {string|number|null} [uploadId=null] - 업로드 호출을 식별하기 위한 ID. 콜백으로 전달됨.
         * @returns {Promise<object|null>} 업로드 결과 Promise (성공 시 서버 데이터, 실패 시 null)
         */
        triggerUpload: async (file, options = {}, uploadId = null) => {
            return await performUploadLogic(file, options, uploadId);
        }
    }));

    return null;
});