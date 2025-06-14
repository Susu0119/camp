import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { apiCore } from '../utils/Auth.jsx';
import Button from "../components/Common/Button.jsx";

export default function NaverMap({ address }) {
    const [start, setStart] = useState(""); // 출발지 입력값
    const [goal, setGoal] = useState(address || ""); // 도착지(초기값: props)
    const [showPostcode, setShowPostcode] = useState(false); // 카카오 주소 검색 표시 여부
    
    // ▼▼▼▼▼ 1. 경로 요약 정보를 저장할 state 추가 ▼▼▼▼▼
    const [summary, setSummary] = useState(null);

    const mapRef = useRef(null);
    const mapObj = useRef(null);
    const polyline = useRef(null);
    const markers = useRef([]);
    const postcodeContainerRef = useRef(null);

    // 카카오 주소 검색 스크립트 로딩
    useEffect(() => {
        if (window.daum && window.daum.Postcode) { return; }
        const script = document.createElement('script');
        script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        script.onload = () => console.log('카카오 주소 검색 스크립트 로드 성공');
        script.onerror = () => alert('카카오 주소 검색 스크립트 로드에 실패했습니다.');
        document.head.appendChild(script);
    }, []);

    // 카카오 주소 검색 UI 생성 및 관리
    useLayoutEffect(() => {
        if (showPostcode && window.daum && window.daum.Postcode) {
            new window.daum.Postcode({
                oncomplete: function (data) {
                    let fullAddress = data.roadAddress;
                    if (data.bname) { fullAddress += ` (${data.bname})`; }
                    setStart(fullAddress);
                    setShowPostcode(false);
                },
                width: '100%', height: '100%', maxSuggestItems: 5
            }).embed(postcodeContainerRef.current);
            postcodeContainerRef.current.style.display = 'block';
        } else if (postcodeContainerRef.current) {
            postcodeContainerRef.current.style.display = 'none';
        }
    }, [showPostcode]);

    // 지도 초기화 로직
    useEffect(() => {
        if (window.naver && window.naver.maps && mapRef.current && !mapObj.current) {
            mapObj.current = new window.naver.maps.Map(mapRef.current, { center: new window.naver.maps.LatLng(37.5665, 126.9780), zoom: 7, minZoom: 6 });
            if (address) {
                window.naver.maps.Service.geocode({ query: address }, (status, response) => {
                    if (status === 200 && response.v2.addresses?.length > 0) {
                        const { x, y } = response.v2.addresses[0];
                        const position = new window.naver.maps.LatLng(parseFloat(y), parseFloat(x));
                        markers.current.forEach(m => m.setMap(null));
                        markers.current = [];
                        const marker = new window.naver.maps.Marker({ position, map: mapObj.current, title: "도착지" });
                        markers.current.push(marker);
                        mapObj.current.setCenter(position);
                        mapObj.current.setZoom(15);
                    }
                });
            }
        }
    }, [address]);

    // 길찾기 실행
    const handleDirection = () => {
        // 길찾기 실행 시 이전 요약 정보 초기화
        setSummary(null);

        if (!start || !goal) {
            alert("출발지와 도착지를 모두 입력하세요.");
            return;
        }
        const geocode = (query) => new Promise((resolve, reject) => {
            window.naver.maps.Service.geocode({ query }, (status, response) => {
                if (status === 200 && response.v2.addresses?.length > 0) {
                    const { x, y } = response.v2.addresses[0];
                    resolve({ lng: parseFloat(x), lat: parseFloat(y) });
                } else {
                    let errorMessage = `'${query}' 주소의 좌표를 찾을 수 없습니다.`;
                    if (status !== 200) {
                        errorMessage += `\n(네이버 지도 API 오류: ${response.v2.errorMessage || `상태 코드 ${status}`})`;
                    } else {
                        errorMessage += `\n(팁: 공원이나 산 같은 넓은 지역 대신, 주변의 구체적인 건물 이름이나 지번 주소로 검색해보세요.)`;
                    }
                    reject(errorMessage);
                }
            });
        });
        Promise.all([geocode(start), geocode(goal)])
            .then(async ([startCoord, goalCoord]) => {
                try {
                    const url = `/api/directions?start=${startCoord.lng},${startCoord.lat}&goal=${goalCoord.lng},${goalCoord.lat}`;
                    const res = await apiCore.get(url);
                    const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
                    if (data.code !== 0) { alert("경로 검색 실패: " + data.message); return; }

                    // ▼▼▼▼▼ 2. API 응답 성공 시 summary state 업데이트 ▼▼▼▼▼
                    if (data.route.traoptimal[0].summary) {
                        setSummary(data.route.traoptimal[0].summary);
                    }

                    const path = data.route.traoptimal[0].path.map(([lng, lat]) => new window.naver.maps.LatLng(lat, lng));
                    if (polyline.current) polyline.current.setMap(null);
                    polyline.current = new window.naver.maps.Polyline({ map: mapObj.current, path, strokeColor: '#007BFF', strokeOpacity: 0.8, strokeWeight: 6 });
                    markers.current.forEach(m => m.setMap(null));
                    markers.current = [
                        new window.naver.maps.Marker({ position: path[0], map: mapObj.current, title: "출발지" }),
                        new window.naver.maps.Marker({ position: path[path.length - 1], map: mapObj.current, title: "도착지" })
                    ];
                    mapObj.current.fitBounds(polyline.current.getBounds());
                } catch (error) {
                    console.error("API 호출 에러:", error);
                    alert("길찾기 API 호출 중 오류가 발생했습니다.");
                }
            }).catch(e => {
                alert(e);
            });
    };

    useEffect(() => { setGoal(address || ""); }, [address]);

    // 예상 시간을 'X시간 Y분' 형식으로 변환하는 헬퍼 함수
    const formatDuration = (ms) => {
        if (!ms) return '0분';
        const totalMinutes = Math.round(ms / 60000);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        
        let result = '';
        if (hours > 0) result += `${hours}시간 `;
        if (minutes > 0 || hours === 0) result += `${minutes}분`;
        return result.trim();
    };

    return (
        <div className="p-4 bg-gray-50 rounded-lg shadow-md">
            <style>{`.form-input{background-color:white;border:1px solid #d1d5db;border-radius:.375rem;box-shadow:0 1px 2px 0 rgba(0,0,0,.05);padding:.5rem .75rem;font-size:.875rem;line-height:1.5;width:100%;height:2.5rem}.form-input:focus{outline:2px solid transparent;outline-offset:2px;border-color:#3b82f6;box-shadow:0 0 0 2px #bfdbfe}.form-input::placeholder{color:#9ca3af}.form-input:read-only{background-color:#f3f4f6;cursor:not-allowed}#postcode-wrapper{position:absolute;top:calc(100% + 5px);left:0;width:100%;max-width:420px;height:450px;background:white;border:1px solid #e2e8f0;border-radius:.5rem;box-shadow:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -2px rgba(0,0,0,.05);z-index:50;overflow:hidden}.postcode-header{padding:.75rem 1rem;border-bottom:1px solid #e2e8f0;background-color:#f8fafc;display:flex;justify-content:space-between;align-items:center}.postcode-header span{font-weight:600;color:#1e293b}.postcode-header button{color:#64748b;font-weight:bold;font-size:1.25rem;background:none;border:none;cursor:pointer;transition:color .2s}.postcode-header button:hover{color:#1e293b}`}</style>
            
            <div className="flex flex-wrap items-end gap-4 mb-4">
                <div className="relative flex-grow min-w-[250px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">출발지</label>
                    <div className="flex items-center gap-4">
                        <input type="text" value={start} placeholder="주소검색 버튼 클릭" className="form-input" readOnly />
                        <Button onClick={() => setShowPostcode(true)} className="bg-cpurple h-[40px] w-[68px] text-white text-sm">검색</Button>
                    </div>
                    <div id="postcode-wrapper" style={{ display: showPostcode ? 'block' : 'none' }}>
                        <div className="postcode-header">
                            <span className="text-sm">주소 검색</span>
                            <button onClick={() => setShowPostcode(false)}>&times;</button>
                        </div>
                        <div ref={postcodeContainerRef} style={{ height: 'calc(100% - 53px)' }}></div>
                    </div>
                </div>
                <div className="flex-grow min-w-[250px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">도착지</label>
                    <input type="text" value={goal} onChange={e => setGoal(e.target.value)} placeholder="도착지 주소 입력" className="form-input" readOnly={!!address} />
                </div>
                <div className="flex-shrink-0">
                    <Button onClick={handleDirection} className="bg-cpurple h-[40px] text-white text-sm">길찾기</Button>
                </div>
            </div>

            <div ref={mapRef} style={{ width: "100%", height: "400px", borderRadius: '0.5rem', overflow: 'hidden', marginBottom: '1rem' }}></div>

            {/* ▼▼▼▼▼ 3. 경로 요약 정보 표시 UI ▼▼▼▼▼ */}
            {summary && (
                <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b">경로 요약</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                        <div>
                            <p className="text-sm text-gray-500">예상 시간</p>
                            <p className="text-lg font-semibold text-blue-600">{formatDuration(summary.duration)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">총 거리</p>
                            <p className="text-lg font-semibold text-gray-800">{(summary.distance / 1000).toFixed(1)} km</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">택시 요금</p>
                            <p className="text-lg font-semibold text-gray-800">{summary.taxiFare.toLocaleString('ko-KR')} 원</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">통행료</p>
                            <p className="text-lg font-semibold text-gray-800">{summary.tollFare.toLocaleString('ko-KR')} 원</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}