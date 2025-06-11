package com.m4gi.controller;

import com.m4gi.service.FileUploadService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class FileUploadController {

    private final FileUploadService gcsUploadService;

    @Autowired
    public FileUploadController(FileUploadService gcsUploadService) {
        this.gcsUploadService = gcsUploadService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> handleFileUpload(
    		@RequestParam("file") MultipartFile file,
    	    @RequestParam(value = "folder", required = false, defaultValue = "images") String folder // ⬅️ 폴더 경로 받기
    		) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "업로드할 파일을 선택해주세요."));
        }

        try {
            // GCS에 저장될 고유한 파일 이름 생성 (덮어쓰기 방지 및 파일명 충돌 방지)
            String originalFileName = file.getOriginalFilename();
            String extension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                extension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            // 예: "profile_images" 폴더에 저장되므로, 서비스에서 해당 폴더명을 fileName 앞에 붙여줍니다.
            // GCSUploadService의 uploadFile 메소드는 두 번째 인자로 "폴더명 제외한 순수 파일명"을 기대하고
            // 내부에서 FOLDER_NAME + "/" + fileName으로 경로를 만듭니다.
            // 따라서 여기서는 순수 파일명만 생성합니다.
            String uniqueFileNameInFolder = UUID.randomUUID().toString() + extension;

            // GCSUploadService 호출
            String fileUrl = gcsUploadService.uploadFile(file, uniqueFileNameInFolder, folder);
            
            Map<String, String> response = new HashMap<>();
            response.put("FileURL", fileUrl);
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "파일 업로드 중 오류 발생: " + e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "서버 내부 오류: " + e.getMessage()));
        }
    }
}
