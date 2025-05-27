package com.m4gi.service;


import java.io.IOException;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;

@Service
public class GCSUploadService implements FileUploadService {

    // Google Cloud 프로젝트 ID
    private static final String PROJECT_ID = "latale-1d43a";
    // 업로드할 버킷 이름
    private static final String BUCKET_NAME = "m4gi";
    // 업로드할 폴더 이름

    @Override
    public String uploadFile(MultipartFile file, String fileName, String FOLDER_NAME) throws IOException {
        // GCS 클라이언트 생성 
        Storage storage = StorageOptions.newBuilder()
                .setProjectId(PROJECT_ID)
                .build()
                .getService();

        String fullPath = FOLDER_NAME + "/" + fileName;

        // 업로드할 BlobId, BlobInfo 생성
        BlobId blobId = BlobId.of(BUCKET_NAME, fullPath);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                .setContentType(file.getContentType())
                .build();

        // 업로드 수행
        storage.create(blobInfo, file.getBytes(), Storage.BlobTargetOption.predefinedAcl(Storage.PredefinedAcl.PUBLIC_READ));

        // GCS에 업로드된 파일의 접근 URL을 구성
        String fileUrl = "https://storage.googleapis.com/" + BUCKET_NAME + "/" + fullPath;

        return fileUrl;
    }
}
