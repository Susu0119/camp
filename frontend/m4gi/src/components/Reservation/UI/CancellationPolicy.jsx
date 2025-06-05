import React from 'react';

export default function CancellationPolicy() {
  const policies = [
    {
      period: "14일 전까지",
      refund: "100% 전액 환불",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      icon: (
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      period: "7일 ~ 3일 전",
      refund: "50% 부분 환불",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      icon: (
        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      )
    },
    {
      period: "3일 전 이후",
      refund: "환불 불가",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      icon: (
        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* 헤더 */}
      <div className="bg-cpurple px-6 py-4">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          취소 및 환불 정책
        </h2>
      </div>

      {/* 컨텐츠 */}
      <div className="p-6">
        <div className="mb-4">
          <p className="text-gray-600 text-sm">
            예약 취소 시점에 따른 환불 규정입니다. 정확한 취소 시점을 확인해 주세요.
          </p>
        </div>

        <div className="space-y-3">
          {policies.map((policy, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-4 rounded-lg border ${policy.borderColor} ${policy.bgColor} transition-all hover:shadow-sm`}
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {policy.icon}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{policy.period}</p>
                  <p className="text-sm text-gray-600">취소 가능 기간</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold text-lg ${policy.color}`}>
                  {policy.refund}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-gray-700">
              <p className="font-medium mb-1">환불 안내</p>
              <ul className="space-y-1 text-gray-600">
                <li>• 환불은 결제 수단에 따라 영업일 기준 3-7일 소요됩니다.</li>
                <li>• 천재지변으로 인한 취소는 별도 정책이 적용됩니다.</li>
                <li>• 자세한 문의는 고객센터로 연락해 주세요.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
