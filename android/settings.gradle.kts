import java.io.File

pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\.android.*")
                includeGroupByRegex("com\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.PREFER_SETTINGS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "TesterSetu"
include(":app")

include(":capacitor-android")
project(":capacitor-android").projectDir = File("../node_modules/@capacitor/android/capacitor")

val capacitorSettingsGradle = File("capacitor.settings.gradle")
if (capacitorSettingsGradle.exists()) {
    apply(from = capacitorSettingsGradle)
}
