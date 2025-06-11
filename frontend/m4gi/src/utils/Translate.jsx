// 캠핑장 타입 변환 유틸리티

// 캠핑장 타입 영어 -> 한글 변환
export const translateType = (type) => {
    // 타입 데이터가 없으면 그대로 반환
    if (!type) return type;

    let typeArray;

    // 어떤 형태의 데이터든 표준 배열 형태로 변환
    if (Array.isArray(type) || type instanceof Set) {
        typeArray = Array.from(type);
    } else {
        // 문자열이거나 다른 타입일 경우, 문자열로 바꿔서 처리
        typeArray = String(type).split(',').map(t => t.trim());
    }

    // 배열의 첫 2개 아이템만 잘라내어 각각 번역한 후, 콤마로 합쳐서 반환
    return typeArray
        .slice(0, 1)                         // 배열에서 앞에서부터 최대 1개를 선택 (변경 가능)
        .map(t => translateSingleType(t))    // 선택된 각 아이템을 번역
        .join(', ');                         // 번역된 결과들을 ", "로 연결
};

// 단일 타입 변환 함수
const translateSingleType = (type) => {
    const typeMap = {
        'CAMPING': '캠핑',
        'CARAVAN': '카라반',
        'GLAMPING': '글램핑',
        'AUTO': '오토캠핑',
        'CAMPNIC': '캠프닉',
        // 소문자 버전도 지원
        'camping': '캠핑',
        'caravan': '카라반',
        'glamping': '글램핑',
        'auto': '오토캠핑',
        'campnic': '캠프닉',
        // zone type 변환도 지원
        'tent': '캠핑',
    };

    return typeMap[type] || type;
};

// 지형 타입 영어 -> 한글 변환
export const translateTerrainType = (type) => {
    const terrainMap = {
        'Grass': '잔디/흙',
        'Deck': '데크',
        'Gravel': '자갈/파쇄석',
        'Sand': '모래',
        'Mixed': '혼합',
        'Other': '기타'
    };

    return terrainMap[type] || type;
};

// 캠핑장 타입 한글 -> 영어 변환 (필터 등에서 사용)
export const translateCampgroundTypeToEnglish = (koreanType) => {
    const reverseTypeMap = {
        '캠핑': 'CAMPING',
        '카라반': 'CARAVAN',
        '글램핑': 'GLAMPING',
        '오토캠핑': 'AUTO',
        '캠프닉': 'CAMPNIC'
    };

    return reverseTypeMap[koreanType] || koreanType;
}; 