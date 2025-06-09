// 캠핑장 타입 변환 유틸리티

// 캠핑장 타입 영어 -> 한글 변환
export const translateType = (type) => {
    if (!type) return type;
    
    // Set 타입인 경우 (여러 타입이 콤마로 구분된 경우)
    if (typeof type === 'object' && type instanceof Set) {
        return Array.from(type).map(t => translateSingleType(t)).join(', ');
    }
    
    // 배열인 경우
    if (Array.isArray(type)) {
        return type.map(t => translateSingleType(t)).join(', ');
    }
    
    // 문자열인 경우 (콤마로 구분될 수 있음)
    if (typeof type === 'string' && type.includes(',')) {
        return type.split(',').map(t => translateSingleType(t.trim())).join(', ');
    }
    
    // 단일 타입인 경우
    return translateSingleType(type);
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