package com.aitester.salesforce.tests;

import com.aitester.salesforce.components.LightningButton;
import com.aitester.salesforce.utils.ShadowDomUtils;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;
import org.openqa.selenium.By;
import org.testng.Assert;
import org.testng.annotations.Test;

public final class FrameworkBrowserSmokeTest extends BaseTest {
    @Test
    public void browserCanClickAndFindNativeShadowDomContent() {
        String html = """
                <!doctype html>
                <html><body>
                  <main id="status">Browser session ready</main>
                  <button id="action" onclick="document.querySelector('#status').textContent='Action completed'">Run</button>
                  <div id="host"></div>
                  <script>
                    document.querySelector('#host').attachShadow({mode:'open'})
                      .innerHTML='<span id="shadow-status">Shadow DOM ready</span>';
                  </script>
                </body></html>
                """;
        String encoded = Base64.getEncoder().encodeToString(html.getBytes(StandardCharsets.UTF_8));
        driver().get("data:text/html;charset=utf-8;base64," + encoded);
        Assert.assertEquals(driver().findElement(By.id("status")).getText(), "Browser session ready");
        new LightningButton(driver(), By.id("action")).click();
        Assert.assertEquals(driver().findElement(By.id("status")).getText(), "Action completed");
        String shadowText = new ShadowDomUtils(driver())
                .findNested(List.of(By.id("host")), By.cssSelector("#shadow-status"))
                .getText();
        Assert.assertEquals(shadowText, "Shadow DOM ready");
    }
}
