package com.aitester.salesforce.driver;

import com.aitester.salesforce.config.ConfigReader;
import java.net.MalformedURLException;
import java.net.URI;
import java.time.Duration;
import java.util.Locale;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.Capabilities;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.remote.RemoteWebDriver;

public final class DriverFactory {
    private static final Logger LOGGER = LogManager.getLogger(DriverFactory.class);
    private static final ThreadLocal<WebDriver> DRIVER = new ThreadLocal<>();

    private DriverFactory() {
    }

    public static WebDriver createDriver() {
        if (DRIVER.get() != null) {
            throw new IllegalStateException("A driver already exists for this test thread");
        }
        String browser = ConfigReader.getOrDefault("browser", "chrome").toLowerCase(Locale.ROOT);
        boolean headless = ConfigReader.getBoolean("headless", true);
        String remoteUrl = ConfigReader.getOrDefault("selenium.remoteUrl", "");
        WebDriver driver = create(browser, headless, remoteUrl);
        driver.manage().timeouts().implicitlyWait(Duration.ZERO);
        driver.manage().timeouts().pageLoadTimeout(
                Duration.ofSeconds(ConfigReader.getInt("timeouts.pageLoadSeconds", 60)));
        driver.manage().window().maximize();
        DRIVER.set(driver);
        LOGGER.info("Started {} browser (headless={})", browser, headless);
        return driver;
    }

    public static WebDriver getDriver() {
        WebDriver driver = DRIVER.get();
        if (driver == null) throw new IllegalStateException("No WebDriver is bound to this test thread");
        return driver;
    }

    public static WebDriver currentDriverOrNull() {
        return DRIVER.get();
    }

    public static void quitDriver() {
        WebDriver driver = DRIVER.get();
        try {
            if (driver != null) {
                driver.quit();
                LOGGER.info("Closed browser for current thread");
            }
        } finally {
            DRIVER.remove();
        }
    }

    private static WebDriver create(String browser, boolean headless, String remoteUrl) {
        return switch (browser) {
            case "chrome" -> {
                ChromeOptions options = new ChromeOptions();
                if (headless) options.addArguments("--headless=new");
                options.addArguments("--disable-dev-shm-usage", "--no-sandbox");
                yield remoteUrl.isBlank() ? new ChromeDriver(options) : remote(options, remoteUrl);
            }
            case "firefox" -> {
                FirefoxOptions options = new FirefoxOptions();
                if (headless) options.addArguments("-headless");
                yield remoteUrl.isBlank() ? new FirefoxDriver(options) : remote(options, remoteUrl);
            }
            case "edge" -> {
                EdgeOptions options = new EdgeOptions();
                if (headless) options.addArguments("--headless=new");
                yield remoteUrl.isBlank() ? new EdgeDriver(options) : remote(options, remoteUrl);
            }
            default -> throw new IllegalArgumentException(
                    "Unsupported browser '" + browser + "'; use chrome, firefox, or edge");
        };
    }

    private static WebDriver remote(Capabilities capabilities, String url) {
        try {
            return new RemoteWebDriver(URI.create(url).toURL(), capabilities);
        } catch (MalformedURLException | IllegalArgumentException exception) {
            throw new IllegalArgumentException("Invalid selenium.remoteUrl: " + url, exception);
        }
    }
}
