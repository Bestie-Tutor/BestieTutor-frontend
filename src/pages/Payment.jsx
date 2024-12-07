import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Payment() {
  const navigate = useNavigate();

  useEffect(() => {
    const loadIamportScript = () => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdn.iamport.kr/js/iamport.payment-1.2.0.js";
        script.async = true;
        script.onload = () => resolve(window.IMP);
        script.onerror = () => reject(new Error("아임포트 스크립트 로드 실패"));
        document.body.appendChild(script);
      });
    };

    const initIamport = async () => {
      try {
        const IMP = await loadIamportScript();
        if (!IMP) {
          throw new Error("아임포트 객체가 로드되지 않았습니다.");
        }
        IMP.init("imp00000000"); // 테스트용
        /*IMP.init("imp04448206"); // 가맹점 식별코드 */

        // 결제 요청
        IMP.request_pay(
          {
            pg: "html5_inicis",
            pay_method: "card",
            merchant_uid: `order_${new Date().getTime()}`,
            name: "테스트 결제",
            amount: 1000,
            buyer_email: "test@test.com",
            buyer_name: "테스트 사용자",
            buyer_tel: "01012345678",
            buyer_addr: "서울특별시 강남구 테헤란로",
            buyer_postcode: "12345",
          },
          (response) => {
            if (response.success) {
              alert("결제가 성공적으로 완료되었습니다.");
              navigate("/success");
            } else {
              alert(`결제 실패: ${response.error_msg}`);
              navigate("/failure");
            }
          }
        );
      } catch (error) {
        console.error(error.message);
        alert("결제 모듈 로드에 실패했습니다. 다시 시도해주세요.");
      }
    };

    initIamport();
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>결제 진행 중...</h2>
    </div>
  );
}