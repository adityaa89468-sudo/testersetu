# Android Development & Google Play Closed Testing Guide

This project is tailored for **Android Developers** building apps in Android Studio (Kotlin / Java / Jetpack Compose) and running **Google Play Closed Beta Testing (20 Testers for 14 Days)**.

---

## 📱 1. Android Studio Project Setup

### `build.gradle.kts` (Module :app)
Ensure your app targets modern Android SDK levels and is configured for closed testing:

```kotlin
android {
    namespace = "com.yourcompany.yourapp"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.yourcompany.yourapp"
        minSdk = 26 // Android 8.0 Oreo
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            isDebuggable = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("debug")
        }
    }
}
```

---

## 🔒 2. `AndroidManifest.xml` Setup

Include necessary permissions and intent filters for opt-in deep links:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Internet permission for network communication -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.MyApp">

        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

---

## 🚀 3. Google Play Console 20-Testers Requirement Checklist

1. **Google Group Setup**:
   - Join our official Google Group: `testersetu@googlegroups.com`
   - In **Google Play Console** &rarr; **Testing** &rarr; **Closed testing**, under **Testers**, select **Google Groups** and add `testersetu@googlegroups.com`.

2. **Publish Closed Testing Track**:
   - Upload your AAB (Android App Bundle) build to Closed Testing.
   - Copy the **Opt-in link** (`https://play.google.com/apps/testing/com.yourcompany.yourapp`).

3. **List App on TesterSetu Platform**:
   - Click **Add App** on TesterSetu.
   - Paste your app URL. Package name (`com.yourcompany.yourapp`) is auto-detected.
   - Upload your app icon image file.
   - Community testers will opt-in and test your app daily for 14 consecutive days!

---

## 🌐 4. Progressive Web App (PWA) / Trusted Web Activity (TWA)

This web application contains a valid `/public/manifest.json` configured for Android WebViews, PWAs, and TWA (Bubblewrap CLI). You can convert this web application directly into an Android `.apk` / `.aab` using Bubblewrap:

```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest=https://your-domain.com/manifest.json
bubblewrap build
```
