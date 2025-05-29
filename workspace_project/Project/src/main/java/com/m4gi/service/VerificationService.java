package com.m4gi.service;

public interface VerificationService {
    boolean sendCode(String phoneOrEmail);
    boolean verifyCode(String phoneOrEmail, String code);
}