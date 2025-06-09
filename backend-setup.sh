#!/bin/bash

# Spring MVC + Tomcat 서버 설정 스크립트

echo "=== 백엔드 서버 환경 설정 시작 ==="

# 시스템 업데이트
sudo apt update && sudo apt upgrade -y

# Java 11 설치 (pom.xml에서 1.11 사용)
sudo apt install openjdk-11-jdk -y

# Maven 설치
sudo apt install maven -y

# Tomcat 9 설치
sudo apt install tomcat9 tomcat9-admin -y

# Git 설치
sudo apt install git -y

# 방화벽 설정 (8080 포트 열기)
sudo ufw allow 8080
sudo ufw allow ssh
sudo ufw --force enable

# Tomcat 시작 및 자동 시작 설정
sudo systemctl start tomcat9
sudo systemctl enable tomcat9

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

# 프로젝트 디렉토리 생성
mkdir -p ~/campia-backend
cd ~/campia-backend

# Tomcat 재시작
sudo systemctl restart tomcat9

echo "=== 환경 설정 완료 ==="
echo "Tomcat 관리자: http://VM_EXTERNAL_IP:8080/manager"
echo "계정: admin / admin123"
echo ""
echo "다음 단계:"
echo "1. 프로젝트 코드를 이 디렉토리에 업로드하세요"
echo "2. application-prod.properties 파일을 설정하세요"
echo "3. mvn clean package 명령으로 WAR 파일 빌드하세요"
echo "4. WAR 파일을 Tomcat에 배포하세요" 