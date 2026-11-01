package com.aitester.salesforce.utils;

import java.util.List;
import org.openqa.selenium.By;
import org.openqa.selenium.SearchContext;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public final class ShadowDomUtils {
    private final WebDriver driver;

    public ShadowDomUtils(WebDriver driver) {
        this.driver = driver;
    }

    public WebElement findNested(List<By> hosts, By target) {
        if (hosts == null || hosts.isEmpty()) {
            throw new IllegalArgumentException("At least one shadow host is required");
        }
        SearchContext context = driver;
        for (By host : hosts) context = context.findElement(host).getShadowRoot();
        return context.findElement(target);
    }
}
