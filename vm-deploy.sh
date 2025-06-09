#!/bin/bash

# Campia 프로젝트 배포 스크립트

echo "=== Campia 프로젝트 배포 시작 ==="

# 프로젝트 디렉토리로 이동
cd /home/m4gicoras/campia/camp

# 최신 코드 가져오기
echo "📡 최신 코드 가져오는 중..."
git pull origin dev

# 백엔드 배포
echo "🏗️ 백엔드 배포 시작..."
cd /home/m4gicoras/campia/camp/workspace_project/Project

# Maven으로 WAR 파일 빌드
echo "🔨 백엔드 빌드 중..."
mvn clean package -Dmaven.test.skip=true

# 기존 WAR 파일 제거
sudo rm -f /var/lib/tomcat9/webapps/web.war
sudo rm -rf /var/lib/tomcat9/webapps/web

# 새 WAR 파일 배포 (실제 생성된 파일명 사용)
echo "🚀 백엔드 배포 중..."
sudo cp target/web.war /var/lib/tomcat9/webapps/web.war

# Tomcat 재시작
sudo systemctl restart tomcat9

# 프론트엔드 배포
echo "🌐 프론트엔드 배포 시작..."
cd /home/m4gicoras/campia/camp/frontend/m4gi

# Node.js 버전 확인 및 업그레이드
echo "🔍 Node.js 버전 확인..."
node_version=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$node_version" -lt 20 ]; then
    echo "⬆️ Node.js 20으로 업그레이드 중..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo "✅ Node.js 업그레이드 완료: $(node -v)"
else
    echo "✅ Node.js 버전 OK: $(node -v)"
fi

# 환경 변수 설정
echo "⚙️ 프론트엔드 환경 변수 설정..."
cat > .env.production << EOF
VITE_API_BASE_URL=http://34.168.101.140:8080
EOF

# 의존성 설치
echo "📦 프론트엔드 의존성 설치 중..."
npm install

# 프로덕션 빌드
echo "🔨 프론트엔드 빌드 중..."
npm run build

# 기존 파일 제거 및 새 파일 배포
echo "🚀 프론트엔드 배포 중..."
sudo rm -rf /var/www/campia/*
sudo cp -r dist/* /var/www/campia/

# Nginx 설정 (CORS 헤더 제거 - Spring에서 처리)
echo "⚙️ Nginx 설정 중..."
sudo bash -c 'cat > /etc/nginx/sites-available/campia << EOF
server {
    listen 80;
    server_name 34.168.101.140;
    
    # 프론트엔드 정적 파일 서빙
    location / {
        root /var/www/campia;
        try_files \$uri \$uri/ /index.html;
        index index.html;
    }
    
    # 백엔드 API 프록시 (/web으로 시작하는 모든 요청)
    location /web/ {
        proxy_pass http://localhost:8080/web/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF'

# Nginx 사이트 활성화
sudo ln -sf /etc/nginx/sites-available/campia /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Nginx 설정 테스트 및 재시작
sudo nginx -t
sudo systemctl restart nginx

echo ""
echo "✅ 배포 완료!"
echo ""
echo "🌐 접속 주소:"
echo "- 웹사이트: http://34.168.101.140"
echo "- 백엔드 API: http://34.168.101.140:8080/web"
echo "- Tomcat 관리자: http://34.168.101.140:8080/manager"
echo ""
echo "⚠️  주의사항:"
echo "- Spring CORS 설정이 프로덕션 IP (34.168.101.140)를 허용하도록 수정이 필요할 수 있습니다"
echo "- 현재 CORS 설정은 localhost:5173만 허용하고 있습니다"
echo ""