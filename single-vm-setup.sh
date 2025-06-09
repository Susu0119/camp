#!/bin/bash

# 단일 VM에 프론트엔드 + 백엔드 통합 배포 설정 스크립트

echo "=== Campia 통합 서버 환경 설정 시작 ==="

# 시스템 업데이트
sudo apt update && sudo apt upgrade -y

# Java 11 설치 (백엔드용)
sudo apt install openjdk-11-jdk -y

# Maven 설치 (백엔드용)
sudo apt install maven -y

# Tomcat 9 설치 (백엔드용)
sudo apt install tomcat9 tomcat9-admin -y

# Node.js 18 설치 (프론트엔드용)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Nginx 설치 (프론트엔드용)
sudo apt install nginx -y

# Git 설치
sudo apt install git -y

# 방화벽 설정 (80포트만 외부 오픈, 8080은 내부용)
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw --force enable

# Tomcat 시작 및 자동 시작 설정
sudo systemctl start tomcat9
sudo systemctl enable tomcat9

# Nginx 시작 및 자동 시작 설정
sudo systemctl start nginx
sudo systemctl enable nginx

# Tomcat 관리자 계정 설정
sudo bash -c 'cat > /etc/tomcat9/tomcat-users.xml << EOF
<?xml version="1.0" encoding="UTF-8"?>
<tomcat-users xmlns="http://tomcat.apache.org/xml"
              xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
              xsi:schemaLocation="http://tomcat.apache.org/xml tomcat-users.xsd"
              version="1.0">
  <role rolename="manager-gui"/>
  <role rolename="manager-script"/>
  <user username="admin" password="admin123" roles="manager-gui,manager-script"/>
</tomcat-users>
EOF'

# 웹 디렉토리 생성 및 권한 설정
sudo mkdir -p /var/www/campia
sudo chown -R $USER:$USER /var/www/campia
sudo chmod -R 755 /var/www/campia

# 프로젝트 디렉토리 생성
mkdir -p ~/campia-project
cd ~/campia-project

# Tomcat 재시작
sudo systemctl restart tomcat9

echo "=== 환경 설정 완료 ==="
echo ""
echo "🌐 서비스 포트:"
echo "- Nginx (프론트엔드): 80"
echo "- Tomcat (백엔드): 8080 (내부 전용)"
echo ""
echo "🔧 관리 도구:"
echo "- Tomcat 관리자: http://localhost:8080/manager (admin/admin123)"
echo ""
echo "📁 다음 단계:"
echo "1. 프로젝트 코드를 ~/campia-project에 업로드하세요"
echo "2. single-vm-deploy.sh 스크립트를 실행하세요" 