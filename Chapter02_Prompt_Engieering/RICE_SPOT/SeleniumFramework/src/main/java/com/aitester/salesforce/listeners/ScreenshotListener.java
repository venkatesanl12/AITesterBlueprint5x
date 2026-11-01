package com.aitester.salesforce.listeners;

import com.aitester.salesforce.driver.DriverFactory;
import io.qameta.allure.Allure;
import java.io.ByteArrayInputStream;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.testng.ITestListener;
import org.testng.ITestResult;

public final class ScreenshotListener implements ITestListener {
    private static final Logger LOGGER = LogManager.getLogger(ScreenshotListener.class);

    @Override
    public void onTestFailure(ITestResult result) {
        WebDriver driver = DriverFactory.currentDriverOrNull();
        if (!(driver instanceof TakesScreenshot screenshotDriver)) return;
        try {
            Allure.addAttachment(result.getName(), "image/png",
                    new ByteArrayInputStream(screenshotDriver.getScreenshotAs(OutputType.BYTES)), ".png");
        } catch (org.openqa.selenium.WebDriverException exception) {
            LOGGER.error("Could not capture screenshot for failed test {}", result.getName(), exception);
        }
    }
}
