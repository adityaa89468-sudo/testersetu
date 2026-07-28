import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Smartphone,
  Code2,
  Copy,
  Check,
  FileCode,
  ShieldCheck,
  Layers,
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface AndroidDevToolkitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidDevToolkitModal: React.FC<AndroidDevToolkitModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'gradle' | 'manifest' | 'checklist' | 'sha1'>('gradle');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const gradleSnippet = `// build.gradle.kts (Module :app)
android {
    namespace = "com.example.yourapp"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.example.yourapp"
        minSdk = 26 // Android 8.0 Oreo
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
}`;

  const manifestSnippet = `<!-- AndroidManifest.xml -->
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
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
</manifest>`;

  const copyToClipboard = (code: string, label: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto text-slate-900 dark:text-slate-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black flex items-center gap-2">
                Android Development Toolkit
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configurations, Gradle snippets, &amp; Play Console closed testing guide
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('gradle')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'gradle'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>build.gradle.kts</span>
          </button>

          <button
            onClick={() => setActiveTab('manifest')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'manifest'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>AndroidManifest.xml</span>
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'checklist'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Play Console Setup</span>
          </button>

          <button
            onClick={() => setActiveTab('sha1')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'sha1'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Find SHA-1 Key</span>
          </button>
        </div>

        {/* Content Views */}
        {activeTab === 'gradle' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Recommended Gradle Module Config (Kotlin DSL):
              </span>
              <button
                onClick={() => copyToClipboard(gradleSnippet, 'gradle')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer transition-colors"
              >
                {copiedCode === 'gradle' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto border border-slate-800 leading-relaxed">
              <code>{gradleSnippet}</code>
            </pre>
          </div>
        )}

        {activeTab === 'manifest' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Standard AndroidManifest.xml Template:
              </span>
              <button
                onClick={() => copyToClipboard(manifestSnippet, 'manifest')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer transition-colors"
              >
                {copiedCode === 'manifest' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto border border-slate-800 leading-relaxed">
              <code>{manifestSnippet}</code>
            </pre>
          </div>
        )}

        {activeTab === 'checklist' && (
          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-500" />
                Google Play Closed Testing Track Setup
              </h3>

              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600/10 text-blue-600 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <span><strong>Join Community Group:</strong> Ensure you join <code>developer-community-t4t@googlegroups.com</code> on Google Groups.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600/10 text-blue-600 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <span><strong>Add Google Group in Play Console:</strong> Open Google Play Console &rarr; Testing &rarr; Closed testing &rarr; Testers tab, select Google Groups, and paste <code>developer-community-t4t@googlegroups.com</code>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600/10 text-blue-600 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <span><strong>Submit App URL:</strong> In TesterSetu, click <strong>Add App</strong>, paste your Play Store/Testing URL. Package name is auto-detected. Upload your app icon.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600/10 text-blue-600 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">4</span>
                  <span><strong>14-Day Testing Window:</strong> 20 community testers will install and test your app daily. Daily screenshot proofs are submitted automatically for your review.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'sha1' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-2">
              <h3 className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Where to Find Your SHA-1 Certificate Fingerprint
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                SHA-1 key fingerprints are required for Google Play App Integrity, Firebase authentication, and OAuth verification.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white">Method 1: Google Play Console (Play App Signing)</h4>
              <ol className="list-decimal pl-4 space-y-1 text-slate-600 dark:text-slate-300">
                <li>Log in to your <strong>Google Play Console</strong> account.</li>
                <li>Select your Android application.</li>
                <li>In the left sidebar menu, go to <strong>Setup &rarr; App signing</strong> (or <strong>App integrity</strong>).</li>
                <li>Copy the <strong>SHA-1 certificate fingerprint</strong> listed under <i>App signing key certificate</i> or <i>Upload key certificate</i>.</li>
              </ol>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white">Method 2: Android Studio (Gradle Task)</h4>
              <ol className="list-decimal pl-4 space-y-1 text-slate-600 dark:text-slate-300">
                <li>Open your project in <strong>Android Studio</strong>.</li>
                <li>Click the <strong>Gradle</strong> tab on the top-right toolbar.</li>
                <li>Navigate to <strong>Tasks &rarr; android &rarr; signingReport</strong>.</li>
                <li>Double-click <strong>signingReport</strong> and inspect the terminal output for <code>SHA1: XX:XX:XX...</code>.</li>
              </ol>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white">Method 3: Terminal Command (keytool)</h4>
              <pre className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto border border-slate-800">
                <code>keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android</code>
              </pre>
            </div>
          </div>
        )}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            For full Android Studio guidelines, see <code>ANDROID_DEVELOPMENT.md</code> in project root.
          </span>
          <button
            onClick={onClose}
            className="py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
