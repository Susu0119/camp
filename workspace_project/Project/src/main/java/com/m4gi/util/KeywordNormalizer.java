package com.m4gi.util;

import java.util.Arrays;
import java.util.List;

public class KeywordNormalizer {

    // 예외로 간주할 키워드들 (사용자 입력에 포함되면 예외 처리)
    private static final List<String> exceptionKeywords = Arrays.asList(
            "사망", "장례", "입원", "병원", "수술", "응급실", "사고", "다쳤어요", "교통사고", "태풍", "불만"
    );

    // 예외 키워드가 포함되어 있으면 true
    public static boolean isExceptional(String input) {
        return exceptionKeywords.stream().anyMatch(input::contains);
    }
}
