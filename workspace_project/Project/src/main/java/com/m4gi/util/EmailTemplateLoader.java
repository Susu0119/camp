package com.m4gi.util;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

public class EmailTemplateLoader {

    private static final String TEMPLATE_PATH = "/templates/email.html";

    public static String loadTemplate(String s) throws IOException {
        try (InputStream in = EmailTemplateLoader.class.getResourceAsStream(TEMPLATE_PATH)) {
            if (in == null) {
                throw new IOException("파일을 찾을 수 없습니다: " + TEMPLATE_PATH);
            }
            return new String(in.readAllBytes(), StandardCharsets.UTF_8);
        }
    }
}
