package com.m4gi.service;

public interface PortOneService {
    String getAccessToken();
    void cancelPayment(String impUid, int amount, String reason, String accessToken);
}

