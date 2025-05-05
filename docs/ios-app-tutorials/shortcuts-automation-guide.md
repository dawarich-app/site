# 📱 Automating Tracking with Shortcuts

Dawarich iOS app supports automation using the Shortcuts app by exposing the following actions:

- **Start Tracking**
- **Stop Tracking**
- **Upload Tracked Points**

These actions can be integrated into your own automations using Apple's Shortcuts app, enabling powerful time- and location-based behaviors.

---

## ⚙️ Available Shortcut Actions

| Action               | Description                                       |
|----------------------|---------------------------------------------------|
| **Start Tracking**   | Begins location tracking in the app.              |
| **Stop Tracking**    | Ends location tracking.                           |
| **Upload Points**    | Uploads all tracked points to your server.        |

These actions can be used in **automations** or started **manually** from Shortcuts app. They can also be added to Home screen.

<img src="/img/shortcuts-actions.png" width="250" /> <img src="/img/shortcuts-homescreen.png" width="250" /> 
---

## 📍 Example 1: Start Tracking When Leaving Home!

This automation will automatically start tracking when you leave your home.

1. Open the **Shortcuts** app.
2. Go to the **Automation** tab and tap **+** to create a new automation.
3. Choose **Create Personal Automation**.
4. Select **Leave** under the **Location** section.
5. Choose your **Home** address as the location and adjust circle radius on the map.
6. Set **Time Range** if needed.
7. Set **Run immediately** or **Run after confirmation** if you would like to confirm manually.
8. Tap **Next**.
9. Search for Dawarich's **Start Tracking** action and add it.
10. Tap **Next**.

<img src="/img/shortcuts-location.png" width="250" /> <img src="/img/shortcuts-leave.png" width="250" /> 

---

## 🌙 Example 2: Upload Points at Midnight

This automation uploads all tracked points at 00:00 every day.

1. In the **Shortcuts** app, go to the **Automation** tab.
2. Tap **+** → **Create Personal Automation**.
3. Choose **Time of Day**.
4. Set it to **Midnight (00:00)** and **Daily**.
5. Set **Run immediately** or **Run after confirmation** if you would like to confirm manually.
6. Tap **Next**, then **Add Action**.
7. Search for and select the **Upload Points** action from your app.
8. Tap **Next**.

<img src="/img/shortcuts-time.png" width="250" /> <img src="/img/shortcuts-upload.png" width="250" /> 

---

## ✅ Tips

- You can set several **locations** or **time-based triggers** for custom automation.
- Use **if conditions** in shortcuts to add logic (e.g., only upload tracks if connected to home Wi-Fi).
- **Automation permissions**: After the first run, the Shortcuts app may ask for confirmation to run custom actions—approve them to allow background automation.
