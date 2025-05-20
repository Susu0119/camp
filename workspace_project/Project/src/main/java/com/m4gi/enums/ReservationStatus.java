package com.m4gi.enums;

public enum ReservationStatus {
    RESERVED("예약완료"),
    CANCELED("취소됨"),
    CHECKED_IN("입실완료"),
    CHECKED_OUT("퇴실완료"),
    NO_SHOW("노쇼");

    private final String displayName;

    ReservationStatus(String displayName) {
        this.displayName = displayName;
    }

    public static ReservationStatus fromDisplayName(String displayName) {
        for (ReservationStatus status : values()) {
            if (status.displayName.equals(displayName)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown displayName: " + displayName);
    }

    public String getDisplayName() {
        return displayName;
    }
}
