package com.m4gi.util;

import java.security.SecureRandom;

public class UUIDGenerator {
	private static final String LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    private static final SecureRandom random = new SecureRandom();

    public static String generateReviewId() {
        StringBuilder sb = new StringBuilder(50);
        for (int i = 0; i < 50; i++) {
            int index = random.nextInt(LETTERS.length());
            sb.append(LETTERS.charAt(index));
        }
        return sb.toString();
    }
}
