import React, { useState } from 'react';
import { apiCore } from '../../../utils/Auth';

export default function ReportModal({ isOpen, onClose, reviewId, author }) {
    const [selectedReason, setSelectedReason] = useState('');
    const [submissionStatus, setSubmissionStatus] = useState('idle'); // idle, submitting, success, error
    const [errorMessage, setErrorMessage] = useState('');
    const [validationMessage, setValidationMessage] = useState('');

    const reportReasons = [
        "욕설 및 비방",
        "광고성 리뷰",
        "부적절한 이미지 포함",
        "도배 및 의미없는 내용"
    ];

    const handleSubmit = async () => {
        if (!selectedReason) {
            setValidationMessage('신고 사유를 선택해주세요.');
            return;
        }
        setValidationMessage('');
        setSubmissionStatus('submitting');

        try {
            await apiCore.post('/api/reviews/report', {
                reviewId: reviewId,
                reportReason: selectedReason
            });
            setSubmissionStatus('success');
        } catch (error) {
            let msg = '신고 처리 중 오류가 발생했습니다.';
            if (error.response) {
                if (error.response.status === 401) {
                    msg = '신고를 하려면 로그인이 필요합니다.';
                } else if (error.response.status === 409) {
                    msg = '이미 신고한 리뷰입니다.';
                } else if (error.response.data && typeof error.response.data === 'string') {
                    msg = error.response.data;
                }
            }
            setErrorMessage(msg);
            setSubmissionStatus('error');
        }
    };

    const handleClose = () => {
        setSelectedReason('');
        setSubmissionStatus('idle');
        setErrorMessage('');
        setValidationMessage('');
        onClose();
    };

    if (!isOpen) return null;

    const renderContent = () => {
        switch (submissionStatus) {
            case 'submitting':
                return (
                    <div className="p-10 text-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cpurple mx-auto mb-4"></div>
                        <p className="text-lg font-semibold text-gray-700">신고를 접수하고 있습니다...</p>
                    </div>
                );
            case 'success':
                return (
                    <>
                        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-center rounded-t-2xl">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">신고 완료</h2>
                            <p className="text-green-100">신고가 성공적으로 접수되었습니다.</p>
                        </div>
                        <div className="p-6">
                            <p className="text-center text-gray-600 mb-6">소중한 의견 감사합니다. 검토 후 신속하게 처리하겠습니다.</p>
                            <button
                                onClick={handleClose}
                                className="w-full bg-cpurple text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                            >
                                닫기
                            </button>
                        </div>
                    </>
                );
            case 'error':
                return (
                    <>
                        <div className="bg-cpurple p-6 text-center rounded-t-2xl">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl select-none font-bold text-white mb-2">오류 발생</h2>
                            <p className="text-white select-none">신고 접수에 실패했습니다.</p>
                        </div>
                        <div className="p-6 text-center">
                            <p className="text-gray-700 select-none mb-6">{errorMessage}</p>
                            <div className="space-y-3">
                                <button
                                    onClick={() => setSubmissionStatus('idle')}
                                    className="w-full bg-cpurple text-white py-3 px-4 rounded-lg font-semibold bg-opacity-90 transition-colors"
                                >
                                    다시 시도
                                </button>
                                <button
                                    onClick={handleClose}
                                    className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                                >
                                    닫기
                                </button>
                            </div>
                        </div>
                    </>
                );
            default:
                return (
                    <>
                        <div className="bg-cpurple p-6 text-center rounded-t-2xl">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 9v2m0 4h.01"></path>
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                </svg>
                            </div>
                            <h2 className="text-2xl select-none font-bold text-white mb-2">리뷰 신고</h2>
                            <p className="select-none text-white">{author} 님의 리뷰를 신고합니다.</p>
                        </div>
                        <div className="p-6">
                            <h3 className="font-semibold select-none text-gray-900 mb-3 text-center">신고 사유를 선택해주세요</h3>
                            <div className="bg-gray-50 select-none rounded-lg p-4 space-y-3">
                                {reportReasons.map((reason, index) => (
                                    <label key={index} htmlFor={`reason-${index}`} className={`block p-3 rounded-lg cursor-pointer transition-all ${selectedReason === reason ? 'bg-cpurple text-white shadow-md' : 'bg-white hover:bg-gray-100'}`}>
                                        <input
                                            type="radio"
                                            id={`reason-${index}`}
                                            name="reportReason"
                                            value={reason}
                                            checked={selectedReason === reason}
                                            onChange={(e) => setSelectedReason(e.target.value)}
                                            className="hidden"
                                        />
                                        <span className="font-medium">{reason}</span>
                                    </label>
                                ))}
                            </div>
                            {validationMessage && <p className="text-red-500 text-sm text-center mt-2">{validationMessage}</p>}
                        </div>
                        <div className="p-6 pt-0 space-y-3">
                            <button
                                onClick={handleSubmit}
                                className="w-full select-none bg-cpurple text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-colors disabled:opacity-50"
                            >
                                신고하기
                            </button>
                            <button
                                onClick={handleClose}
                                className="w-full select-none bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                            >
                                취소
                            </button>
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                {renderContent()}
            </div>
        </div>
    );
};