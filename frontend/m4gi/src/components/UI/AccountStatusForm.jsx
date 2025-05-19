import React from "react";
import ActionButton from "./ActionButton";


export function AccountStatusForm() {
  return (
    <div className="w-full px-6">
      <div className="mx-auto" style={{ maxWidth: "420px" }}>
        <form
          className="relative z-10 w-full px-6 py-8 rounded-2xl shadow-lg border border-white 
                     bg-[rgba(255,255,255,0.3)] backdrop-blur-md"
        >
            <h2 className="text-2xl font-bold leading-none text-center text-white">
                가입한 계정 찾기
            </h2>

            <p className="pt-4 text-sm leading-5 text-center text-white">
                인증된 휴대폰 번호입니다 <br />
                가입된 계정 : 카카오 <br />
                campai123@kakao.com
            </p>
            <div className="pt-2 w-full space-y-4">
                <div className="flex flex-col w-full text-center">
                <ActionButton>가입한 계정 찾기</ActionButton>
            </div>
        </div>
        </form>
      </div>
    </div>
  );
}

export default AccountStatusForm;
