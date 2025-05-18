import { useEffect } from "react";
import axios from "axios";

export default function KakaoCallback() {
  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (code) {
      axios.post("http://localhost:8080/oauth/kakao/callback", { code })
        .then((res) => {
          console.log("로그인 성공", res.data);
          // 로그인 처리 or 로컬 스토리지 저장 등
        })
        .catch((err) => {
          console.error("로그인 실패", err);
        });
    }
  }, []);

  return <div>로그인 처리 중...</div>;
}
