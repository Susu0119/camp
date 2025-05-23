export default function Footer() {
    return (
        <footer className="flex z-0 flex-col items-center pt-14 pb-8 mt-2.5 w-full text-sm border-t bg-slate-100 bg-opacity-30 border-slate-200     ">
            <div className="px-8 w-[1400px]">
                <div className="flex flex-col max-w-full text-slate-950 w-[982px]">
                    <div className="flex flex-wrap gap-5 justify-between max-w-full w-[894px]">
                        <div className="flex flex-col items-start font-bold">
                            <h3 className="text-lg leading-loose">고객센터</h3>
                            <p className="mt-7 text-2xl leading-none">1588-0000</p>
                            <p className="self-stretch mt-6 leading-5 text-slate-500">
                                평일 09:00 - 18:00 (점심시간 12:00 - 13:00)
                                <br />
                                주말 및 공휴일 휴무
                            </p>
                            <div className="flex gap-3 mt-6 leading-none text-center w-[186px]">
                                <button className="self-stretch py-2 pr-3 pl-3.5 bg-white rounded-md border border-solid border-slate-200">
                                    자주 묻는 질문
                                </button>
                                <button className="self-stretch py-2 pr-3 pl-3.5 bg-white rounded-md border border-solid border-slate-200">
                                    1:1 문의
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col items-start self-start leading-none">
                            <h3 className="text-lg font-bold leading-loose">기업 정보</h3>
                            <p className="mt-7">상호명: (주)캠피아</p>
                            <p className="mt-3">대표: 홍길동</p>
                            <p className="mt-3">사업자등록번호: 123-45-67890</p>
                            <p className="self-stretch mt-3">주소: 서울특별시 강남구 테헤란로 123</p>
                            <p className="mt-3">이메일: info@campinggo.com</p>
                        </div>
                    </div>
                    <div className="flex gap-2.5 self-end max-w-full leading-none text-center w-[298px]">
                        <button className="self-stretch py-2 pr-3 pl-3.5 bg-white rounded-md border border-solid border-slate-200">
                            회사 소개
                        </button>
                        <button className="self-stretch py-2 pr-3.5 pl-3 whitespace-nowrap bg-white rounded-md border border-solid border-slate-200">
                            이용약관
                        </button>
                        <button className="self-stretch px-3.5 py-2 whitespace-nowrap bg-white rounded-md border border-solid border-slate-200">
                            개인정보처리방침
                        </button>
                    </div>
                </div>
                <div className="pt-4 mt-8 leading-none text-center border-t border-slate-200 text-slate-500">
                    © 2025 캠피아. All rights reserved.
                </div>
            </div>
        </footer>
    );
};
