package com.aitester.salesforce.tests;

import com.aitester.salesforce.api.SalesforceApiClient;
import com.aitester.salesforce.config.ConfigReader;
import com.aitester.salesforce.listeners.InfraRetryAnalyzer;
import com.aitester.salesforce.pages.LoginPage;
import com.aitester.salesforce.pages.OpportunitiesPage;
import com.github.javafaker.Faker;
import java.time.LocalDate;
import java.util.Map;
import org.testng.Assert;
import org.testng.SkipException;
import org.testng.annotations.Test;

public final class SalesforceOpportunityApiUiTest extends BaseTest {
    @Test(retryAnalyzer = InfraRetryAnalyzer.class)
    public void apiCreatedOpportunityIsVisibleInLightning() {
        require("salesforce.baseUrl", "salesforce.username", "salesforce.password",
                "salesforce.instanceUrl", "salesforce.accessToken", "salesforce.opportunityStage",
                "sf.opportunities.path", "sf.opportunities.record");
        SalesforceApiClient api = new SalesforceApiClient();
        String accountId = null;
        String opportunityId = null;
        String opportunityName = new Faker().commerce().productName() + " " + System.nanoTime();
        try {
            accountId = api.createRecord("Account",
                    Map.of("Name", "Selenium test account " + System.nanoTime()));
            opportunityId = api.createRecord("Opportunity", Map.of(
                    "Name", opportunityName,
                    "StageName", ConfigReader.get("salesforce.opportunityStage"),
                    "CloseDate", LocalDate.now().plusDays(30).toString(),
                    "AccountId", accountId));
            new LoginPage(driver()).open().login(
                    ConfigReader.get("salesforce.username"), ConfigReader.get("salesforce.password"));
            Assert.assertTrue(new OpportunitiesPage(driver()).open().recordVisible(opportunityName),
                    "The API-created opportunity should appear in the configured Opportunities view");
        } finally {
            try {
                if (opportunityId != null) api.deleteRecord("Opportunity", opportunityId);
            } finally {
                if (accountId != null) api.deleteRecord("Account", accountId);
            }
        }
    }

    private void require(String... keys) {
        for (String key : keys) {
            if (ConfigReader.getOrDefault(key, "").isBlank()) {
                throw new SkipException("Opportunity test requires configuration: " + key);
            }
        }
    }
}
