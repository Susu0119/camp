package com.m4gi.service;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

public interface FileUploadService {
	/**
	 * 파일을 GCS의 지정된 폴더에 업로드하고, 업로드된 파일의 public URL을 반환
	 * @param file 업로드할 MultipartFile 객체
	 * @param fileName GCS에 저장될 파일 이름 (확장자 포함)
	 * @param targetFolderName GCS 버킷 내에 파일을 저장할 대상 폴더 이름
	 */
	String uploadFile(MultipartFile file, String fileName, String targetFolderName) throws IOException;
}
