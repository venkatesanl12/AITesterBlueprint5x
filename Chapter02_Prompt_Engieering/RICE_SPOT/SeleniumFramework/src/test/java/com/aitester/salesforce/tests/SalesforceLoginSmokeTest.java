package com.aitester.salesforce.tests;

import com.aitester.salesforce.config.ConfigReader;
import com.aitester.salesforce.listeners.InfraRetryAnalyzer;
import com.aitester.salesforce.pages.HomePage;
import com.aitester.salesforce.pages.LoginPage;
import org.testng.Assert;
import org.testng.SkipException;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public final class SalesforceLoginSmokeTest extends BaseTest {
    @BeforeMethod
    public void requireSandboxConfiguration() {
        require("salesforce.baseUrl", "salesforce.username", "salesforce.password",
                "salesforce.authSuccessUrlFragment", "sf.home.ready");
    }

    @Test(retryAnalyzer = InfraRetryAnalyzer.class)
    public void validSandboxUserReachesConfiguredHome() {
        HomePage home = new LoginPage(driver()).open()
                .login(ConfigReader.get("salesforce.username"), ConfigReader.get("salesforce.password"));
        Assert.assertTrue(home.waitUntilLoaded().isLoaded());
    }

    private void require(String... keys) {
        for (String key : keys) {
            if (ConfigReader.getOrDefault(key, "").isBlank()) {
                throw new SkipException("Sandbox test requires configuration: " + key);
            }
        }
    }
}
