"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../../utils/Auth";
import { useNavigate } from 'react-router-dom'; 
import axios from "axios";
import Swal from 'sweetalert2';
import dayjs from 'dayjs';

export default function CSPaymentForm() {
  const { user: userInfo, isAuthenticated, isLoading } = useAuth();
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    reservationNumber: '',
    inquiryContent: ''
  });

  // ✅ 유저 정보로 초기값 세팅
  useEffect(() => {
    if (isAuthenticated && userInfo) {
      setFormData(prev => ({
        ...prev,
        name: userInfo.nickname || '', // 또는 userInfo.name
        email: userInfo.email || '',
        contact: userInfo.phone || '' // userInfo.contact 등 실제 필드명 확인
      }));
    }
  }, [isAuthenticated, userInfo]);

  useEffect(() => {
  if (isAuthenticated) {
    axios.get('/web/api/cs/reservations', { withCredentials: true })
      .then(res => {
        console.log("예약 API 응답", res.data);
        setReservations(res.data); // 여기 수정할 수도 있음
      })
      .catch(err => console.error(err));
  }
}, [isAuthenticated]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      // 필수 입력값 검증
    if (!formData.reservationNumber.trim() || !formData.inquiryContent.trim()) {
      Swal.fire({
                icon: 'warning',
                title: '문의 오류',
                text: '예약번호와 문의 내용을 입력해주세요.',
      });
      return;
    }

    try {
      const response = await axios.post(
        "web/api/cs/inquiries",
        {
          campgroundId: null, // 선택적으로 넣을 수 있음 (있으면 값으로 대체)
          reservationId: formData.reservationNumber.trim(),
          category: 2, // 예약·결제 카테고리 고정
          message: formData.inquiryContent.trim(),
          attachments: JSON.stringify([]) // 향후 파일 첨부 시 활용
        },
        {
          withCredentials: true, // 세션 쿠키 전송
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      console.log("문의 등록 성공:", response.data);
      Swal.fire({
        icon: 'success',
        title: '문의 성공',
        text: '문의가 성공적으로 등록되었습니다.',
        confirmButtonText: '확인'
      }).then(() => {
        navigate('/cs/main'); // 먼저 이동
        setFormData(prev => ({
          ...prev,
          reservationNumber: '',
          inquiryContent: ''
        }));
      });
      
      
      setFormData(prev => ({
        ...prev,
        reservationNumber: '',
        inquiryContent: ''
      }));
    } catch (error) {
      console.error("문의 등록 실패:", error);
      Swal.fire({
                icon: 'error',
                title: '문의 오류',
                text: '문의 등록 중 오류가 발생했습니다.',
              });
    }
  };

  if (isLoading) {
    return <p className="py-10 text-center">로딩 중...</p>;
  }

  if (!isAuthenticated) {
    return <p className="py-10 text-center text-red-500">로그인 후 이용해주세요.</p>;
  }

  return (
    <main className="flex flex-col items-center px-10 pt-10 pb-24 min-w-60 w-[1162px] max-md:px-5 max-md:max-w-full">
      <div className="max-w-full w-[672px]">
        <h1 className="text-3xl font-bold leading-tight text-black">예약·결제 문의</h1>
        <form className="mt-6 w-full text-sm max-md:max-w-full" onSubmit={handleSubmit}>
          {/* 이름 */}
          <div className="mt-6 w-full">
            <label className="font-bold">닉네임 ● 이름</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              readOnly
              className="w-full px-4 py-2.5 mt-2 bg-gray-100 border border-zinc-200 rounded-md text-zinc-500"
            />
          </div>

          {/* 이메일 */}
          <div className="mt-6 w-full">
            <label className="font-bold">이메일</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              className="w-full px-4 py-2.5 mt-2 bg-gray-100 border border-zinc-200 rounded-md text-zinc-500"
            />
          </div>

          {/* 연락처 */}
          <div className="mt-6 w-full">
            <label className="font-bold">연락처</label>
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              readOnly
              className="w-full px-4 py-2.5 mt-2 bg-gray-100 border border-zinc-200 rounded-md text-zinc-500"
            />
          </div>

          <div className="mt-6 w-full">
            <label className="font-bold">예약 선택</label>
            <select
              name="reservationNumber"
              value={formData.reservationNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 mt-2 bg-white border border-zinc-200 rounded-md text-zinc-700"
            >
              <option value="">-- 예약을 선택하세요 --</option>
              {Array.isArray(reservations) && reservations.length > 0 ? (
                reservations.map(r => (
                  <option key={r.reservationId} value={r.reservationId}>
                    {`${r.reservationId} (${dayjs(r.reservationDate).format('YYYY.MM.DD')} ~ ${dayjs(r.endDate).format('YYYY.MM.DD')})`}
                  </option>
                ))
              ) : (
                <option disabled>예약 내역이 없습니다</option>
              )}
            </select>
          </div>


          <div className="mt-6 w-full max-md:max-w-full">
            <label className="font-bold leading-none text-black">
              문의 내용
            </label>
            <div className="overflow-hidden relative px-3.5 pt-2.5 pb-24 mt-2 w-full leading-none bg-white rounded-md border border-solid border-zinc-200 min-h-[120px] text-zinc-500">
              <textarea
                name="inquiryContent"
                value={formData.inquiryContent}
                onChange={handleInputChange}
                placeholder="예약 변경, 취소, 환불 또는 결제 관련 오류 내용을 작성해주세요."
                className="z-10 w-full h-full resize-none bg-transparent border-none outline-none px-3 pt-3 text-sm leading-relaxed"
                style={{ minHeight: '120px' }}
              />

            </div>
          </div>

          <button
            type="submit"
            className="self-stretch px-4 py-2.5 mt-6 w-full font-bold leading-none text-center bg-fuchsia-700 rounded-md min-h-10 text-neutral-50 max-md:max-w-full hover:bg-fuchsia-800 transition-colors"
          >
            문의하기
          </button>
        </form>
      </div>
    </main>
  );
}
