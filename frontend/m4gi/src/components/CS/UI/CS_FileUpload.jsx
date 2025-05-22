"use client";
import React, { useState, useRef } from "react";

// interface FileUploadProps { ... } // TypeScript 인터페이스 정의 제거

// React.FC<FileUploadProps> 타입 어노테이션 제거
export default function CSFileUpload({ label, onFileSelect }) {
    // useState의 제네릭 타입 (<File | null>, <string | null>) 제거
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    // useRef의 제네릭 타입 (<HTMLInputElement>) 제거
    const fileInputRef = useRef(null);

    // 매개변수 e의 타입 어노테이션 (React.ChangeEvent<HTMLInputElement>) 제거
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            onFileSelect(file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (event) => {
                // 타입 단언 (as string) 제거
                setPreview(event.target?.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="flex flex-col pt-1.5 w-full text-sm">
            <label className="self-start leading-none">{label}</label>
            <div
                className="flex flex-col items-center p-7 mt-3.5 leading-none text-center rounded-lg border-2 border border-dashed text-zinc-500 cursor-pointer max-md:px-5 max-md:max-w-full"
                onClick={handleClick}
            >
                {preview ? (
                    <div className="flex flex-col items-center">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-md"
                        />
                        <p className="mt-2">파일 변경하기</p>
                    </div>
                ) : (
                    <>
                        <img
                            src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/60e72b605a9cba9013257c36ef14ed35f0bfdd39?placeholderIfAbsent=true"
                            className="object-contain w-8 aspect-square"
                            alt="Upload icon"
                        />
                        <p className="mt-2">클릭하여 사진 업로드 (선택사항)</p>
                    </>
                )}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />
            </div>
        </div>
    );
};