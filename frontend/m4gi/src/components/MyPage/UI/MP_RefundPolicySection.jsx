"use client";
import React, { useState } from "react";

const RefundPolicySection = () => {
  const [isAgreed, setIsAgreed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const toggleAgreement = () => {
    setIsAgreed(!isAgreed);
  };

  // 모달 닫기
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <section className="flex justify-center px-4 py-6">
      <article className="w-full max-w-2xl bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-black mb-4">환불 규정</h2>

        <div className="flex flex-col gap-3 bg-white border border-zinc-200 rounded-md p-4 mb-3 text-left">
          <p className="text-sm text-zinc-600 leading-relaxed">
            이용일 기준 <strong>14일 전까지</strong> 취소: 결제 금액의 전액 환불
          </p>
          <p className="text-sm text-zinc-600 leading-relaxed">
            이용일 기준 <strong>7일 ~ 3일 전까지</strong> 취소: 결제 금액의 50% 환불
          </p>
          <p className="text-sm text-zinc-600 leading-relaxed">
            이용일 기준 <strong>3일 전 이후</strong> 취소: 환불 불가
          </p>
        </div>

        <p className="text-xs text-stone-400 mb-4 text-left">
          ※ 환불은 취소 요청일로부터 최대 5영업일 이내에 처리됩니다.
        </p>

        <label className="flex items-center gap-3 cursor-pointer mb-6">
          <input
            type="checkbox"
            checked={isAgreed}
            onChange={toggleAgreement}
            className="w-5 h-5 accent-fuchsia-700"
          />
          <span className="text-sm text-fuchsia-700 leading-snug">
            취소/환불 규정을 확인했습니다. 해당 내용에 동의합니다.
          </span>

        </label>
        {/* 모달 */}
        {showModal && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
            onClick={closeModal}
          >
            <div
              className="bg-white rounded-lg p-6 max-w-xs text-center"
              onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않도록
            >
              <p className="mb-4 text-gray-700">
                취소/환불 규정에 동의하셔야 다음 단계로 진행할 수 있습니다.
              </p>
              <button
                onClick={closeModal}
                className="mt-2 px-4 py-2 bg-[#8C06AD] text-white rounded-md hover:bg-purple-800 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        )}
      </article>
    </section>
  );
};

export default RefundPolicySection;
