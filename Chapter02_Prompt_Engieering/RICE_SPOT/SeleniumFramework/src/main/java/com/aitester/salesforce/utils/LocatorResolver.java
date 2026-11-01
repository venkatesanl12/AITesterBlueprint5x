package com.aitester.salesforce.utils;

import com.aitester.salesforce.config.ConfigReader;
import java.util.Locale;
import org.openqa.selenium.By;

public final class LocatorResolver {
    private LocatorResolver() {
    }

    public static By fromConfig(String key) {
        String configured = ConfigReader.get(key);
        int separator = configured.indexOf(':');
        if (separator <= 0 || separator == configured.length() - 1) {
            throw new IllegalArgumentException("Locator " + key + " must use strategy:value syntax");
        }
        String strategy = configured.substring(0, separator).trim().toLowerCase(Locale.ROOT);
        String value = configured.substring(separator + 1).trim();
        return switch (strategy) {
            case "id" -> By.id(value);
            case "name" -> By.name(value);
            case "css" -> By.cssSelector(value);
            case "xpath" -> By.xpath(value);
            case "aria" -> By.cssSelector("[aria-label=\"" + value.replace("\"", "\\\"") + "\"]");
            default -> throw new IllegalArgumentException("Unsupported locator strategy: " + strategy);
        };
    }
}
