#!/bin/bash

# React + Vite 프론트엔드 서버 설정 스크립트

echo "=== 프론트엔드 서버 환경 설정 시작 ==="

# 시스템 업데이트
sudo apt update && sudo apt upgrade -y

# Node.js 18 설치
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Nginx 설치
sudo apt install nginx -y

# Git 설치
sudo apt install git -y

# 방화벽 설정
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw --force enable

# Nginx 시작 및 자동 시작 설정
sudo systemctl start nginx
sudo systemctl enable nginx

# 웹 디렉토리 생성 및 권한 설정
sudo mkdir -p /var/www/campia
sudo chown -R $USER:$USER /var/www/campia
sudo chmod -R 755 /var/www/campia

# 프로젝트 디렉토리 생성
mkdir -p ~/campia-frontend
cd ~/campia-frontend

echo "=== 환경 설정 완료 ==="
echo "다음 단계:"
echo "1. 프론트엔드 코드를 이 디렉토리에 업로드하세요"
echo "2. npm install 명령으로 의존성을 설치하세요"
echo "3. .env.production 파일을 설정하세요 (VITE_API_BASE_URL=http://BACKEND_VM_IP:8080)"
echo "4. npm run build 명령으로 빌드하세요"
echo "5. Nginx 설정을 업데이트하세요" 