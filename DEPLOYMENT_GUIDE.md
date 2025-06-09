# 🚀 Campia 프로젝트 Google Compute Engine 배포 가이드

## 📋 프로젝트 구조
- **백엔드**: Spring MVC + Tomcat (WAR 배포)
- **프론트엔드**: React + Vite + Nginx

## 🏗️ 배포 아키텍처
```
[사용자] → [프론트엔드 VM (Nginx:80)] → [백엔드 VM (Tomcat:8080)]
```

## 📋 1. VM 인스턴스 생성

### 백엔드 VM
- **OS**: Ubuntu 20.04 LTS
- **머신 타입**: e2-medium (2 vCPU, 4GB RAM)
- **방화벽**: HTTP, HTTPS 트래픽 허용
- **포트**: 8080 (Tomcat)

### 프론트엔드 VM
- **OS**: Ubuntu 20.04 LTS  
- **머신 타입**: e2-small (1 vCPU, 2GB RAM)
- **방화벽**: HTTP, HTTPS 트래픽 허용
- **포트**: 80 (Nginx)

## 📋 2. 백엔드 배포 단계

### 2.1 환경 설정
```bash
# VM에 접속 후 실행
chmod +x backend-setup.sh
./backend-setup.sh
```

### 2.2 프로젝트 업로드
```bash
cd ~/campia-backend
# Git 클론 또는 파일 업로드
git clone YOUR_REPOSITORY_URL .
```

### 2.3 설정 파일 수정
```bash
# application-prod.properties 수정
nano src/main/resources/application-prod.properties

# 다음 값들을 실제 값으로 변경:
# - cors.allowed.origins=http://FRONTEND_VM_EXTERNAL_IP
# - gemini.api.key=YOUR_ACTUAL_GEMINI_API_KEY  
# - weather.api.key=YOUR_ACTUAL_WEATHER_API_KEY
```

### 2.4 배포 실행
```bash
chmod +x backend-deploy.sh
./backend-deploy.sh
```

### 2.5 배포 확인
```bash
# Tomcat 상태 확인
sudo systemctl status tomcat9

# 애플리케이션 접속 테스트
curl http://localhost:8080

# 로그 확인
sudo tail -f /var/log/tomcat9/catalina.out
```

## 📋 3. 프론트엔드 배포 단계

### 3.1 환경 설정
```bash
# VM에 접속 후 실행
chmod +x frontend-setup.sh
./frontend-setup.sh
```

### 3.2 프로젝트 업로드
```bash
cd ~/campia-frontend
# Git 클론 또는 파일 업로드
git clone YOUR_REPOSITORY_URL .
cd frontend/m4gi
```

### 3.3 환경 변수 설정
```bash
# .env.production 파일 생성
cat > .env.production << EOF
VITE_API_BASE_URL=http://BACKEND_VM_EXTERNAL_IP:8080
NODE_ENV=production
EOF
```

### 3.4 배포 실행
```bash
chmod +x ../../frontend-deploy.sh
../../frontend-deploy.sh
```

### 3.5 Nginx 설정 수정
```bash
# 백엔드 IP 주소 업데이트
sudo nano /etc/nginx/sites-available/campia
# BACKEND_VM_EXTERNAL_IP를 실제 백엔드 VM의 외부 IP로 변경

sudo nginx -t
sudo systemctl restart nginx
```

### 3.6 배포 확인
```bash
# Nginx 상태 확인
sudo systemctl status nginx

# 웹사이트 접속 테스트
curl http://localhost

# 로그 확인
sudo tail -f /var/log/nginx/access.log
```

## 📋 4. 최종 확인 사항

### ✅ 체크리스트
- [ ] 백엔드 VM에서 Tomcat이 정상 실행 중
- [ ] 백엔드 API 엔드포인트 접속 가능 (`http://BACKEND_VM_IP:8080`)
- [ ] 프론트엔드 VM에서 Nginx가 정상 실행 중  
- [ ] 프론트엔드 웹사이트 접속 가능 (`http://FRONTEND_VM_IP`)
- [ ] 프론트엔드에서 백엔드 API 호출 정상 작동
- [ ] CORS 설정이 올바르게 적용됨
- [ ] API 키들이 올바르게 설정됨

### 🔧 트러블슈팅

#### 백엔드 문제
```bash
# Tomcat 로그 확인
sudo tail -f /var/log/tomcat9/catalina.out

# 포트 확인
sudo netstat -tlnp | grep 8080

# 방화벽 확인
sudo ufw status
```

#### 프론트엔드 문제
```bash
# Nginx 로그 확인
sudo tail -f /var/log/nginx/error.log

# Nginx 설정 테스트
sudo nginx -t

# 포트 확인
sudo netstat -tlnp | grep 80
```

## 🌐 접속 URL
- **프론트엔드**: `http://FRONTEND_VM_EXTERNAL_IP`
- **백엔드**: `http://BACKEND_VM_EXTERNAL_IP:8080`
- **Tomcat 관리자**: `http://BACKEND_VM_EXTERNAL_IP:8080/manager` (admin/admin123)

## 🔒 보안 권장사항
1. Tomcat 관리자 계정 비밀번호 변경
2. 방화벽 규칙 최소화 (필요한 포트만 열기)
3. SSL 인증서 적용 (Let's Encrypt 권장)
4. 정기적인 시스템 업데이트 