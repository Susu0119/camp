<div className="flex-1 flex flex-col">
  <div className="flex justify-between items-center mb-4 select-none">
    <h2 className="text-purple-900/80 text-2xl">예약 상세 정보</h2>
    <button onClick={onClose} className="text-xl font-bold">&times;</button>
  </div>

  <div className="grid grid-cols-2 mt-6 gap-x-6 gap-y-4 text-lg text-black/80 leading-relaxed">
    <p><strong>예약자 : </strong> {localDetail.userNickname}</p>
    <p className="break-all max-w-[280px]">
      <strong>예약 ID : </strong> {localDetail.reservationId}
    </p>
    <p><strong>전화번호 : </strong> {maskPhone(localDetail.phone)}</p>
    <p><strong>캠핑장 : </strong> {localDetail.campgroundName}</p>
    <p><strong>사이트 : </strong> {localDetail.reservationSite}</p>
    <p><strong>예약일 : </strong> {formatDate(localDetail.reservationDate)}</p>
    <p><strong>입실일 : </strong> {formatDate(localDetail.checkinTime)}</p>
    <p><strong>퇴실일 : </strong> {formatDate(localDetail.checkoutTime)}</p>
    <p><strong>예약상태 : </strong> {mapReservationStatus(localDetail.reservationStatus)}</p>
    <p><strong>환불상태 : </strong> {mapRefundStatus(localDetail.refundStatus)}</p>
    <p><strong>입실상태 : </strong> {localDetail.checkinStatus}</p>
    <p><strong>취소사유 : </strong> {localDetail.cancelReason}</p>
    {localDetail.customReason && (
      <p><strong>상세 취소 사유 : </strong> {localDetail.customReason}</p>
    )}
  </div>

  {localDetail.refundStatus === 1 && (
    <div className="flex justify-end gap-4 mt-4">
      <button
        onClick={() => handleRefundAction("APPROVE")}
        className="w-[120px] px-3 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-sm hover:bg-purple-700 transition-colors shadow-md"
      >
        환불 승인
      </button>
      <button
        onClick={() => handleRefundAction("REJECT")}
        className="w-[120px] px-3 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors shadow-md"
      >
        환불 거절
      </button>
    </div>
  )}
</div>
