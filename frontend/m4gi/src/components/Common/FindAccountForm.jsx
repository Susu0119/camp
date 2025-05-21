"use client";
import React from "react";
import FormInput from "./FormInput";
import ActionButton from "./ActionButton";

const FindAccountForm = () => {
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
            캠피아에서 이용중인 SNS 계정을 찾을라면 <br />
            휴대폰으로 인증해 주세요
          </p>

          <div className="pt-2 w-full space-y-4">
            <FormInput placeholder="전화번호" />

            <div className="flex overflow-hidden flex-col justify-center w-full font-bold text-center">
              <ActionButton>인증번호 발송</ActionButton>
            </div>

            <div className="flex gap-2.5 justify-center items-center w-full text-center">
              <div className="flex-1">
                <FormInput placeholder="인증번호" />
              </div>
              <div className="flex-1">
                <ActionButton>인증 확인</ActionButton>
              </div>
            </div>

            <div className="flex flex-col w-full text-center">
              <ActionButton>가입한 계정 찾기</ActionButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FindAccountForm;
