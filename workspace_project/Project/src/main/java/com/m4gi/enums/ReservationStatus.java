package com.m4gi.enums;

public enum ReservationStatus {
    WAITING(1, "환불대기"),
    COMPLETED(2, "환불완료"),
    REJECTED(3, "환불거절"),
    DENIED(4, "환불불가");

    private final int code;
    private final String label;

    // 🔧 생성자 이름 꼭 enum 이름과 같게!
    ReservationStatus(int code, String label) {
        this.code = code;
        this.label = label;
    }

    public int getCode() {
        return code;
    }

    public String getLabel() {
        return label;
    }

    public static ReservationStatus fromCode(int code) {
        for (ReservationStatus r : values()) {
            if (r.code == code) return r;
        }
        throw new IllegalArgumentException("Invalid reservation status code: " + code);
    }
}
