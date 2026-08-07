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
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "TesterSetu"
include(":app")

include(":capacitor-android")
project(":capacitor-android").projectDir = java.io.File("../node_modules/@capacitor/android/capacitor")

val capacitorSettingsGradle = java.io.File("capacitor.settings.gradle")
if (capacitorSettingsGradle.exists()) {
    apply(from = capacitorSettingsGradle)
}
