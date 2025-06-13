import { useEffect, useRef, useState } from "react";
import { apiCore } from '../utils/Auth.jsx';

export default function NaverMap({ address }) {
    const [start, setStart] = useState(""); // 출발지 입력값
    const [goal, setGoal] = useState(address || ""); // 도착지(초기값: props)
    const [suggestions, setSuggestions] = useState([]); // 자동완성 주소 리스트
    const [showSuggestions, setShowSuggestions] = useState(false);
    const mapRef = useRef(null);
    const mapObj = useRef(null);
    const polyline = useRef(null);
    const markers = useRef([]);

    // 지도 초기화 및 기본 마커 표시
    useEffect(() => {
        if (window.naver && window.naver.maps && mapRef.current && !mapObj.current) {
            mapObj.current = new window.naver.maps.Map(mapRef.current, {
                center: new window.naver.maps.LatLng(37.5665, 126.9780), // 서울시청(임시)
                zoom: 7
            });

            // 지도 초기화 후 address가 있으면 마커 표시
            if (address) {
                window.naver.maps.Service.geocode({ query: address }, (status, response) => {
                    console.log('Geocoding status:', status);
                    console.log('Geocoding response:', response);
                    console.log('Addresses array:', response.v2?.addresses);

                    if (status === 200 && response.v2.addresses && response.v2.addresses.length > 0) {
                        const { x, y } = response.v2.addresses[0];
                        const position = new window.naver.maps.LatLng(parseFloat(y), parseFloat(x));

                        console.log('Creating marker at:', position);

                        // 기존 마커 제거
                        markers.current.forEach(m => m.setMap(null));
                        markers.current = [];

                        // 도착지 마커 생성 (기본 마커 사용)
                        const marker = new window.naver.maps.Marker({
                            position: position,
                            map: mapObj.current,
                            title: "도착지"
                        });

                        markers.current.push(marker);

                        // 지도 중심을 도착지로 이동
                        mapObj.current.setCenter(position);
                        mapObj.current.setZoom(15);
                    } else {
                        console.error('Geocoding failed:', status);
                    }
                });
            }
        }
    }, [address]); // address 변경시에도 실행

    // 출발지 자동완성 (백엔드 프록시 API 활용)
    useEffect(() => {
        if (start.length < 2) {
            setSuggestions([]);
            return;
        }
        // apiCore.get 사용, 백엔드 프록시 호출
        apiCore.get(`/api/naver/autocomplete?query=${encodeURIComponent(start)}`)
            .then(res => {
                const data = res.data;
                setSuggestions(Array.isArray(data.items) ? data.items : []);
            })
            .catch(() => setSuggestions([]));
    }, [start]);

    // 길찾기 실행
    const handleDirection = () => {
        if (!start || !goal) {
            alert("출발지와 도착지를 모두 입력하세요.");
            return;
        }
        // 출발지, 도착지 각각 geocode
        Promise.all([
            new Promise((resolve, reject) => {
                window.naver.maps.Service.geocode({ query: start }, (status, response) => {
                    if (status !== 200 || !response.v2.addresses || response.v2.addresses.length === 0) return reject("출발지 변환 실패");
                    const { x, y } = response.v2.addresses[0];
                    resolve({ lng: parseFloat(x), lat: parseFloat(y) });
                });
            }),
            new Promise((resolve, reject) => {
                window.naver.maps.Service.geocode({ query: goal }, (status, response) => {
                    if (status !== 200 || !response.v2.addresses || response.v2.addresses.length === 0) return reject("도착지 변환 실패");
                    const { x, y } = response.v2.addresses[0];
                    resolve({ lng: parseFloat(x), lat: parseFloat(y) });
                });
            })
        ]).then(async ([startCoord, goalCoord]) => {
            try {
                // Spring 백엔드를 통한 API 호출 (수정된 부분)
                const url = `/api/directions?start=${startCoord.lng},${startCoord.lat}&goal=${goalCoord.lng},${goalCoord.lat}`;
                const res = await apiCore.get(url);

                // 응답 데이터 처리 (Spring에서 JSON 문자열을 반환할 수 있으므로 확인)
                let data;
                if (typeof res.data === 'string') {
                    data = JSON.parse(res.data);
                } else {
                    data = res.data;
                }

                if (data.code !== 0) {
                    alert("경로 검색 실패: " + data.message);
                    return;
                }

                // 지도에 경로 및 마커 표시
                const path = data.route.traoptimal[0].path.map(([lng, lat]) => new window.naver.maps.LatLng(lat, lng));

                // 기존 폴리라인 제거
                if (polyline.current) polyline.current.setMap(null);

                // 새 폴리라인 생성
                polyline.current = new window.naver.maps.Polyline({
                    map: mapObj.current,
                    path,
                    strokeColor: '#008000',
                    strokeWeight: 5
                });

                // 기존 마커 제거
                markers.current.forEach(m => m.setMap(null));

                // 새 마커 생성 (출발지, 도착지)
                markers.current = [
                    new window.naver.maps.Marker({
                        position: path[0],
                        map: mapObj.current,
                        title: "출발지"
                    }),
                    new window.naver.maps.Marker({
                        position: path[path.length - 1],
                        map: mapObj.current,
                        title: "도착지"
                    })
                ];

                // 지도 영역 맞추기
                mapObj.current.fitBounds(new window.naver.maps.LatLngBounds(...path));

            } catch (error) {
                console.error("API 호출 에러:", error);
                alert("길찾기 API 호출 중 오류가 발생했습니다.");
            }
        }).catch(e => {
            alert(e);
        });
    };

    useEffect(() => {
        setGoal(address || "");
    }, [address]);

    return (
        <div>
            <div className="flex gap-2 mb-2 relative">
                <input
                    type="text"
                    value={start}
                    onChange={e => {
                        setStart(e.target.value);
                        setShowSuggestions(true);
                    }}
                    placeholder="출발지(예: 서울역)"
                    className="border rounded px-2 py-1 w-2/5"
                    autoComplete="off"
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                />
                {/* 자동완성 리스트 */}
                {showSuggestions && suggestions.length > 0 && (
                    <ul className="absolute left-0 top-10 bg-white border rounded shadow w-2/5 z-50 max-h-60 overflow-y-auto">
                        {suggestions.map((item, idx) => (
                            <li
                                key={idx}
                                className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                                onMouseDown={() => {
                                    setStart(item);
                                    setShowSuggestions(false);
                                }}
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                )}
                <input
                    type="text"
                    value={goal}
                    onChange={e => setGoal(e.target.value)}
                    placeholder="도착지"
                    className="border rounded px-2 py-1 w-2/5"
                    readOnly={!!address}
                />
                <button onClick={handleDirection} className="bg-green-600 text-white px-4 py-1 rounded">길찾기</button>
            </div>
            <div ref={mapRef} style={{ width: "100%", height: "400px" }}></div>
        </div>
    );
}