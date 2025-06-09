import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PaymentCompletionModal({ isOpen, onClose, paymentData }) {
    const navigate = useNavigate();

    if (!isOpen || !paymentData) return null;

    const handleGoHome = () => {
        onClose();
        navigate('/main', { replace: true });
    };

    const handleGoToReservations = () => {
        onClose();
        navigate('/mypage/reservations', { replace: true });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                {/* 헤더 */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-center rounded-t-2xl">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">결제 완료!</h2>
                    <p className="text-green-100">예약이 성공적으로 완료되었습니다</p>
                </div>

                {/* 예약 정보 */}
                <div className="p-6 space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <h3 className="font-semibold text-gray-900 mb-3">예약 정보</h3>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <p className="text-gray-500">예약자</p>
                                <p className="font-medium text-gray-900">{paymentData.userName}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">연락처</p>
                                <p className="font-medium text-gray-900">{paymentData.phone}</p>
                            </div>
                        </div>

                        <div className="border-t pt-3">
                            <p className="text-gray-500 text-sm">캠핑장</p>
                            <p className="font-semibold text-gray-900">{paymentData.campgroundName}</p>
                            <p className="text-gray-600 text-sm">{paymentData.siteName}</p>
                        </div>

                        <div className="border-t pt-3">
                            <p className="text-gray-500 text-sm">이용 기간</p>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="font-medium text-gray-900">{paymentData.startDate}</span>
                                <span className="text-gray-400">~</span>
                                <span className="font-medium text-gray-900">{paymentData.endDate}</span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                                <span>체크인: {paymentData.checkinTime?.split('T')[1]?.slice(0, 5) || '16:00'}</span>
                                <span>체크아웃: {paymentData.checkoutTime?.split('T')[1]?.slice(0, 5) || '11:00'}</span>
                            </div>
                        </div>

                        <div className="border-t pt-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-sm">결제 금액</span>
                                <span className="text-xl font-bold text-cpurple">
                                    {(paymentData.totalPrice || paymentData.price)?.toLocaleString()}원
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 안내 메시지 */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="text-sm text-blue-800">
                                <p className="font-medium mb-1">예약 안내</p>
                                <ul className="space-y-1 text-blue-700 text-xs">

                                    <li>• 체크인 시 신분증을 지참해 주세요</li>
                                    <li>• 예약 변경은 마이페이지에서 가능합니다</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 버튼 */}
                <div className="p-6 pt-0 space-y-3">
                    <button
                        onClick={handleGoToReservations}
                        className="w-full bg-cpurple text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                        예약 내역 확인하기
                    </button>
                    <button
                        onClick={handleGoHome}
                        className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    >
                        홈으로 돌아가기
                    </button>
                </div>
            </div>
        </div>
    );
};