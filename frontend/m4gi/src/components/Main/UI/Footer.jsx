export default function Footer() {
    return (
        <footer className="bg-gradient-to-br from-slate-50 to-slate-100 border-t border-slate-200">
            <div className="max-w-7xl mx-auto px-6 py-16">
                {/* 메인 콘텐츠 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12 justify-items-center">
                    {/* 고객센터 */}
                    <div className="space-y-6 w-full max-w-xs text-center">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center justify-center gap-2">
                                <svg className="w-5 h-5 text-cpurple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                고객센터
                            </h3>
                            <div className="space-y-3">
                                <p className="text-3xl font-bold text-cpurple">1588-0000</p>
                                <div className="text-sm text-slate-600 leading-relaxed">
                                    <p>평일 09:00 - 18:00</p>
                                    <p className="text-slate-500">(점심시간 12:00 - 13:00)</p>
                                    <p className="text-slate-500">주말 및 공휴일 휴무</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 justify-center">
                            <button className="px-4 py-2 bg-white text-slate-700 rounded-lg border border-slate-200 hover:border-cpurple hover:text-cpurple transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md">
                                자주 묻는 질문
                            </button>
                            <button className="px-4 py-2 bg-cpurple text-white rounded-lg hover:bg-purple-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md">
                                1:1 문의
                            </button>
                        </div>
                    </div>

                    {/* 기업 정보 */}
                    <div className="space-y-6 w-full max-w-xs text-center">
                        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center justify-center gap-2">
                            <svg className="w-5 h-5 text-cpurple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            기업 정보
                        </h3>
                        <div className="space-y-3 text-sm text-slate-600">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">상호명</span>
                                <span className="font-medium">(주)캠피아</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">대표</span>
                                <span>홍길동</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">사업자</span>
                                <span>123-45-67890</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">주소</span>
                                <span>서울특별시 강남구 테헤란로 123</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">이메일</span>
                                <a href="mailto:info@campia.com" className="text-cpurple hover:underline">
                                    info@campia.com
                                </a>
                            </div>
                        </div>
                        {/* 기업 정보 섹션 높이 맞추기 위한 여백 */}
                        <div className="h-16"></div>
                    </div>

                    {/* 소셜 미디어 */}
                    <div className="space-y-6 w-full max-w-xs text-center">
                        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center justify-center gap-2">
                            <svg className="w-5 h-5 text-cpurple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                            </svg>
                            소셜 미디어
                        </h3>

                        <div className="flex gap-4 justify-center">
                            <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110">
                                <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                            <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110">
                                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                            </a>
                        </div>

                        {/* 높이 맞추기 위한 여백 */}
                        <div className="h-32"></div>
                    </div>
                </div>

                {/* 하단 링크 */}
                <div className="flex flex-wrap justify-center gap-4 py-6 border-t border-slate-200">
                    <button className="px-4 py-2 text-sm text-slate-600 hover:text-cpurple transition-colors duration-200 font-medium">
                        회사 소개
                    </button>
                    <span className="text-slate-300">|</span>
                    <button className="px-4 py-2 text-sm text-slate-600 hover:text-cpurple transition-colors duration-200 font-medium">
                        이용약관
                    </button>
                    <span className="text-slate-300">|</span>
                    <button className="px-4 py-2 text-sm text-slate-600 hover:text-cpurple transition-colors duration-200 font-medium">
                        개인정보처리방침
                    </button>
                    <span className="text-slate-300">|</span>
                    <button className="px-4 py-2 text-sm text-slate-600 hover:text-cpurple transition-colors duration-200 font-medium">
                        사업자정보확인
                    </button>
                </div>

                {/* 저작권 */}
                <div className="text-center pt-6 border-t border-slate-200">
                    <p className="text-sm text-slate-500">
                        © 2025 <span className="font-semibold text-cpurple">Campia</span>. All rights reserved.
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                        캠핑의 새로운 경험을 만들어갑니다
                    </p>
                </div>
            </div>
        </footer>
    );
};
