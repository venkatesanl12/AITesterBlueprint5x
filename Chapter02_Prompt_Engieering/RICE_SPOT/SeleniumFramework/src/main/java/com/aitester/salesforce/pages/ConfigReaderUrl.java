package com.aitester.salesforce.pages;

import com.aitester.salesforce.config.ConfigReader;

final class ConfigReaderUrl {
    private ConfigReaderUrl() {
    }

    static String baseUrl() {
        return ConfigReader.get("salesforce.baseUrl").replaceAll("/+$", "");
    }

    static String path(String key) {
        return ConfigReader.get(key);
    }
}
