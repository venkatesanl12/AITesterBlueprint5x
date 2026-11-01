package com.aitester.salesforce.listeners;

import java.util.Locale;
import java.util.concurrent.atomic.AtomicInteger;
import org.openqa.selenium.WebDriverException;
import org.testng.IRetryAnalyzer;
import org.testng.ITestResult;

public final class InfraRetryAnalyzer implements IRetryAnalyzer {
    private static final int MAX_RETRIES = 1;
    private final AtomicInteger retries = new AtomicInteger();

    @Override
    public boolean retry(ITestResult result) {
        Throwable failure = result.getThrowable();
        return failure instanceof WebDriverException
                && isKnownTransportFailure(failure.getMessage())
                && retries.getAndIncrement() < MAX_RETRIES;
    }

    private boolean isKnownTransportFailure(String message) {
        if (message == null) return false;
        String text = message.toLowerCase(Locale.ROOT);
        return text.contains("chrome not reachable")
                || text.contains("disconnected: not connected to devtools")
                || text.contains("failed to decode response from marionette");
    }
}
