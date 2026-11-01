package com.aitester.salesforce.utils;

import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public final class JavaScriptUtils {
    private final JavascriptExecutor executor;

    public JavaScriptUtils(WebDriver driver) {
        if (!(driver instanceof JavascriptExecutor javascriptExecutor)) {
            throw new IllegalArgumentException("WebDriver does not implement JavascriptExecutor");
        }
        executor = javascriptExecutor;
    }

    public void scrollIntoView(WebElement element) {
        executor.executeScript("arguments[0].scrollIntoView({block:'center'});", element);
    }

    public Object execute(String script, Object... args) {
        return executor.executeScript(script, args);
    }
}
