#!/bin/bash

# Spring MVC WAR 배포 스크립트

echo "=== 백엔드 배포 시작 ==="

# 기존 배포 제거
echo "기존 배포 제거 중..."
sudo rm -rf /var/lib/tomcat9/webapps/ROOT*
sudo rm -rf /var/lib/tomcat9/webapps/web*

# Maven 빌드
echo "Maven 빌드 시작..."
mvn clean package -DskipTests

# 빌드 성공 확인
if [ ! -f "target/web-1.0.0-BUILD-SNAPSHOT.war" ]; then
    echo "빌드 실패! WAR 파일이 없습니다."
    exit 1
fi

# WAR 파일을 Tomcat webapps 디렉토리로 복사
echo "WAR 파일 배포 중..."
sudo cp target/web-1.0.0-BUILD-SNAPSHOT.war /var/lib/tomcat9/webapps/ROOT.war

# Tomcat 재시작
echo "Tomcat 재시작 중..."
sudo systemctl restart tomcat9

# 배포 완료 대기
echo "배포 완료 대기 중..."
sleep 10

echo "=== 백엔드 배포 완료 ==="
echo "애플리케이션 URL: http://VM_EXTERNAL_IP:8080"
echo "Tomcat 관리자: http://VM_EXTERNAL_IP:8080/manager"
echo "로그 확인: sudo tail -f /var/log/tomcat9/catalina.out"
echo "상태 확인: curl http://localhost:8080" 