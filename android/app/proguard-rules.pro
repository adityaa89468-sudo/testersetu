# Keep WebView and JavaScript interfaces
-keepattributes JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep WebKit and AndroidX components
-keep class androidx.webkit.** { *; }
-keep class android.webkit.** { *; }
