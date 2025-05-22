package com.m4gi.enums;

public enum RefundPolicy {
    FULL(14, 1.0),
    HALF(3, 0.5),
    NONE(0, 0.0);

    private final int minDaysBefore;
    private final double refundRate;

    RefundPolicy(int minDaysBefore, double refundRate) {
        this.minDaysBefore = minDaysBefore;
        this.refundRate = refundRate;
    }

    // 환불을 반환
    public static double getRefundRate(int daysBefore, boolean isExceptional) {
        if (isExceptional) return 1.0;

        if (daysBefore >= FULL.minDaysBefore) {
            return FULL.refundRate;

        } else if (daysBefore >= HALF.minDaysBefore) {
            return HALF.refundRate;

        } else {
            return NONE.refundRate;
        }
    }
}
