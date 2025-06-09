#!/bin/bash

# React + Vite 프론트엔드 배포 스크립트

echo "=== 프론트엔드 배포 시작 ==="

# 의존성 설치
echo "의존성 설치 중..."
npm install

# Vite 빌드
echo "Vite 빌드 시작..."
npm run build

# 빌드 성공 확인
if [ ! -d "dist" ]; then
    echo "빌드 실패! dist 디렉토리가 없습니다."
    exit 1
fi

# 기존 파일 제거
echo "기존 파일 제거 중..."
sudo rm -rf /var/www/campia/*

# 빌드된 파일을 웹 디렉토리로 복사
echo "빌드된 파일 배포 중..."
sudo cp -r dist/* /var/www/campia/

# 권한 설정
sudo chown -R www-data:www-data /var/www/campia
sudo chmod -R 755 /var/www/campia

# Nginx 설정 업데이트
echo "Nginx 설정 업데이트 중..."
sudo bash -c 'cat > /etc/nginx/sites-available/campia << EOF
server {
    listen 80;
    server_name _;
    root /var/www/campia;
    index index.html;

    # React Router를 위한 설정 (SPA)
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # API 프록시 설정 (백엔드로 전달)
    location /api/ {
        proxy_pass http://BACKEND_VM_EXTERNAL_IP:8080/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # 정적 파일 캐싱
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip 압축
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
EOF'

# Nginx 사이트 활성화
sudo ln -sf /etc/nginx/sites-available/campia /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Nginx 설정 테스트 및 재시작
sudo nginx -t
sudo systemctl restart nginx

echo "=== 프론트엔드 배포 완료 ==="
echo "웹사이트 URL: http://VM_EXTERNAL_IP"
echo "Nginx 상태 확인: sudo systemctl status nginx"
echo "Nginx 로그 확인: sudo tail -f /var/log/nginx/error.log"
echo ""
echo "⚠️  중요: Nginx 설정에서 BACKEND_VM_EXTERNAL_IP를 실제 백엔드 VM IP로 변경하세요!" 