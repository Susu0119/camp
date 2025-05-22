"use client";
import React, { useState } from "react";
import FormInput from "./CS_LostReportFormInput";
import FormTextarea from "./CS_LostFormTextArea";
import { DatePicker, TimePicker } from "./CS_Date";
import FileUpload from "./CS_FileUpload";

export default function CSLostReportForm() {
  const [formData, setFormData] = useState({
    campsite: "",
    reservationID: "",
    lostLocation: "",
    lostDate: "",
    lostTime: "",
    itemDescription: "",
    itemPhoto: null,
  });

  // 타입 어노테이션(e: React.ChangeEvent<HTMLInputElement>) 제거
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 타입 어노테이션(e: React.ChangeEvent<HTMLTextAreaElement>) 제거
  const handleTextareaChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 타입 어노테이션(date: string) 제거
  const handleDateSelect = (date) => {
    setFormData((prev) => ({ ...prev, lostDate: date }));
  };

  // 타입 어노테이션(time: string) 제거
  const handleTimeSelect = (time) => {
    setFormData((prev) => ({ ...prev, lostTime: time }));
  };

  // 타입 어노테이션(file: File | null) 제거
  const handleFileSelect = (file) => {
    setFormData((prev) => ({ ...prev, itemPhoto: file }));
  };

  // 타입 어노테이션(e: React.FormEvent) 제거
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData);
    // You could add form validation here
    alert("분실물 신고가 접수되었습니다.");
  };

  return (
    <form className="flex flex-col pt-1.5 mt-6 w-full text-sm max-md:max-w-full" onSubmit={handleSubmit}>
      <FormInput
        label="캠핑장명"
        placeholder="방문하신 캠핑장 이름을 입력해주세요"
        value={formData.campsite}
        onChange={(e) => handleInputChange({ ...e, target: { ...e.target, name: "campsite" } })}
      />

      <FormInput
        label="예약번호"
        placeholder="예약번호를 입력해주세요"
        value={formData.reservationID}
        onChange={(e) => handleInputChange({ ...e, target: { ...e.target, name: "reservationID" } })}
        className="mt-8"
      />

      <FormInput
        label="분실 위치"
        placeholder="물건을 잃어버린 위치를 입력해주세요"
        value={formData.lostLocation}
        onChange={(e) => handleInputChange({ ...e, target: { ...e.target, name: "lostLocation" } })}
        className="mt-8"
      />

      <div className="flex gap-5 justify-between mt-8 max-w-full leading-none w-[396px]">
        <label>분실 날짜</label>
        <label>분실 시각</label>
      </div>

      <div className="flex flex-wrap gap-4 mt-3.5 w-full leading-none text-zinc-500 max-md:max-w-full">
        <DatePicker onDateSelect={handleDateSelect} />
        <TimePicker onTimeSelect={handleTimeSelect} />
      </div>

      <FormTextarea
        label="물품 설명"
        placeholder="분실한 물품에 대해 자세히 설명해주세요"
        value={formData.itemDescription}
        onChange={(e) => handleTextareaChange({ ...e, target: { ...e.target, name: "itemDescription" } })}
        className="mt-8"
      />

      <FileUpload
        label="물품 사진"
        onFileSelect={handleFileSelect}
      />

      <button
        type="submit"
        className="self-stretch px-4 py-2.5 mt-6 leading-none text-center bg-fuchsia-700 rounded-md min-h-10 text-neutral-50"
      >
        분실물 신고하기
      </button>
    </form>
  );
};