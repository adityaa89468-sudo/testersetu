import { AppListing, PlatformConfig } from '../types';

export const DEFAULT_PLATFORM_CONFIG: PlatformConfig = {
  minTestingDays: 14,
  defaultTesterReward: 15,
  maxActiveAppsPerUser: 3,
  welcomeBonusCredits: 100,
  announcements: [
    {
      id: 'ann-1',
      title: 'Welcome to TesterSetu 1.0!',
      content: 'Connect with fellow Android developers to test closed-beta apps, submit daily proofs, and qualify for Google Play production access.',
      date: Date.now() - 86400000
    },
    {
      id: 'ann-2',
      title: 'Genuine Testing Commitment',
      content: 'Always conduct manual testing on physical Android devices or standard emulators. Bots and fake screenshots will result in immediate bans.',
      date: Date.now() - 172800000
    }
  ]
};

export const SEED_APPS: AppListing[] = [
  {
    id: 'app-seed-1',
    ownerId: 'demo-dev-1',
    ownerDisplayName: 'Aria Chen',
    ownerDevName: 'Aria Software Studio',
    appName: 'FocusPomo - Task & Interval Timer',
    packageName: 'com.ariastudio.focuspomo',
    category: 'Productivity',
    shortDescription: 'Distraction-free Pomodoro technique timer with offline sync and widget.',
    fullDescription: 'FocusPomo is designed for student productivity and remote workers. Features include customizable interval sounds, task tagging, statistics graphs, and Android 14 Material You dynamic colors.',
    appIconUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    minAndroidVersion: 'Android 8.0 (API 26)',
    optInLink: 'https://play.google.com/apps/testing/com.ariastudio.focuspomo',
    playStoreLink: 'https://play.google.com/store/apps/details?id=com.ariastudio.focuspomo',
    googleGroupLink: 'https://groups.google.com/g/focuspomo-beta-testers',
    privacyPolicyUrl: 'https://ariastudio.example.com/privacy',
    devContactEmail: 'aria.dev@example.com',
    testersNeeded: 20,
    testersJoined: 14,
    testingDurationDays: 14,
    startDate: Date.now() - 3 * 86400000,
    testingInstructions: 'Please open the app daily, create at least 1 timer session, and test the notification alert when timer completes.',
    dailyProofRequirement: 'Screenshot showing the active timer screen or completed session history.',
    creditsOffered: 20,
    status: 'active',
    isVerified: true,
    createdAt: Date.now() - 3 * 86400000,
    updatedAt: Date.now() - 3 * 86400000
  },
  {
    id: 'app-seed-2',
    ownerId: 'demo-dev-2',
    ownerDisplayName: 'Marcus Vance',
    ownerDevName: 'Vance Logic Labs',
    appName: 'ByteBudget - Smart Expense Tracker',
    packageName: 'com.vance.bytebudget',
    category: 'Finance',
    shortDescription: 'Offline-first currency & expense ledger with visual pie charts.',
    fullDescription: 'ByteBudget helps privacy-focused users track daily spending. Supports multiple currencies, export to CSV, biometric lock screen, and custom budget limits.',
    appIconUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=150&auto=format&fit=crop&q=80',
    minAndroidVersion: 'Android 9.0 (API 28)',
    optInLink: 'https://play.google.com/apps/testing/com.vance.bytebudget',
    playStoreLink: 'https://play.google.com/store/apps/details?id=com.vance.bytebudget',
    googleGroupLink: 'https://groups.google.com/g/bytebudget-closed-test',
    privacyPolicyUrl: 'https://vancestyle.example.com/privacy',
    devContactEmail: 'marcus@vance.example.com',
    testersNeeded: 20,
    testersJoined: 18,
    testingDurationDays: 14,
    startDate: Date.now() - 5 * 86400000,
    testingInstructions: 'Add 2 transactions daily, test changing base currency in Settings, and verify dark theme toggle.',
    dailyProofRequirement: 'Screenshot of the Dashboard balance page or Expense List.',
    creditsOffered: 18,
    status: 'active',
    isVerified: true,
    createdAt: Date.now() - 5 * 86400000,
    updatedAt: Date.now() - 5 * 86400000
  },
  {
    id: 'app-seed-3',
    ownerId: 'demo-dev-3',
    ownerDisplayName: 'Sophia Patel',
    ownerDevName: 'Zenith Mobile Solutions',
    appName: 'HabitZen - Daily Routine Builder',
    packageName: 'com.zenith.habitzen',
    category: 'Health & Fitness',
    shortDescription: 'Minimalist habit tracker with streak counters and daily reminders.',
    fullDescription: 'Build long-lasting habits with HabitZen. Uses gentle vibration cues, heatmaps for monthly progress, and customizable home screen widgets.',
    appIconUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=150&auto=format&fit=crop&q=80',
    minAndroidVersion: 'Android 10.0 (API 29)',
    optInLink: 'https://play.google.com/apps/testing/com.zenith.habitzen',
    playStoreLink: 'https://play.google.com/store/apps/details?id=com.zenith.habitzen',
    googleGroupLink: 'https://groups.google.com/g/habitzen-testing-circle',
    privacyPolicyUrl: 'https://zenith.example.com/privacy',
    devContactEmail: 'sophia@zenith.example.com',
    testersNeeded: 25,
    testersJoined: 8,
    testingDurationDays: 14,
    startDate: Date.now() - 1 * 86400000,
    testingInstructions: 'Mark at least one habit complete each day. Verify that streak counter increments accurately.',
    dailyProofRequirement: 'Screenshot showing habits marked done with streak flames.',
    creditsOffered: 25,
    status: 'active',
    isVerified: true,
    createdAt: Date.now() - 1 * 86400000,
    updatedAt: Date.now() - 1 * 86400000
  },
  {
    id: 'app-seed-4',
    ownerId: 'demo-dev-4',
    ownerDisplayName: 'Liam O\'Connor',
    ownerDevName: 'PixelForge Interactive',
    appName: 'Dungeon Rogue - Pixel RPG',
    packageName: 'com.pixelforge.dungeonrogue',
    category: 'Games',
    shortDescription: 'Turn-based procedurally generated pixel dungeon crawler game.',
    fullDescription: 'Explore infinite dungeons, collect spell scrolls, and defeat ancient monsters in this retro 16-bit RPG crafted with Unity for Android.',
    appIconUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150&auto=format&fit=crop&q=80',
    minAndroidVersion: 'Android 8.0 (API 26)',
    optInLink: 'https://play.google.com/apps/testing/com.pixelforge.dungeonrogue',
    playStoreLink: 'https://play.google.com/store/apps/details?id=com.pixelforge.dungeonrogue',
    googleGroupLink: 'https://groups.google.com/g/dungeonrogue-beta',
    privacyPolicyUrl: 'https://pixelforge.example.com/privacy',
    devContactEmail: 'liam@pixelforge.example.com',
    testersNeeded: 20,
    testersJoined: 19,
    testingDurationDays: 14,
    startDate: Date.now() - 10 * 86400000,
    testingInstructions: 'Play floor 1 to 3, test inventory potion usage, and check frame rate stability on lower-end devices.',
    dailyProofRequirement: 'Screenshot in combat mode or character stat inventory screen.',
    creditsOffered: 20,
    status: 'active',
    isVerified: true,
    createdAt: Date.now() - 10 * 86400000,
    updatedAt: Date.now() - 10 * 86400000
  },
  {
    id: 'app-seed-5',
    ownerId: 'demo-dev-5',
    ownerDisplayName: 'Elena Rostova',
    ownerDevName: 'Rostova Dev Labs',
    appName: 'VoiceDraft - Instant Audio Notes',
    packageName: 'com.rostova.voicedraft',
    category: 'Tools',
    shortDescription: 'Voice memo recorder with fast playback speeds and speech formatting.',
    fullDescription: 'VoiceDraft captures high quality AAC voice recordings, auto-saves to internal storage, and allows quick sharing via standard Android intent sheets.',
    appIconUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=150&auto=format&fit=crop&q=80',
    minAndroidVersion: 'Android 10.0 (API 29)',
    optInLink: 'https://play.google.com/apps/testing/com.rostova.voicedraft',
    playStoreLink: 'https://play.google.com/store/apps/details?id=com.rostova.voicedraft',
    privacyPolicyUrl: 'https://voicedraft.example.com/privacy',
    devContactEmail: 'elena@voicedraft.example.com',
    testersNeeded: 15,
    testersJoined: 6,
    testingDurationDays: 14,
    startDate: Date.now() - 2 * 86400000,
    testingInstructions: 'Record a short 10-second voice snippet, test renaming audio files, and test background recording permission.',
    dailyProofRequirement: 'Screenshot showing recorded audio files list.',
    creditsOffered: 15,
    status: 'active',
    isVerified: true,
    createdAt: Date.now() - 2 * 86400000,
    updatedAt: Date.now() - 2 * 86400000
  }
];

export const COMMUNITY_GUIDELINES = [
  {
    title: '1. Genuine Human Manual Testing',
    content: 'All testing must be performed manually by real developers on real physical Android devices or genuine Android Studio emulators. Automated scripts, bots, or fake screenshot generators are strictly prohibited.'
  },
  {
    title: '2. 14-Day Closed Testing Protocol',
    content: 'To help developers qualify for Google Play production access, stay opt-in for the full 14 consecutive days. Ensure the app remains installed on your testing device.'
  },
  {
    title: '3. Daily Screenshot Proof',
    content: 'Upload 1 clear, authentic screenshot daily demonstrating active app usage. Screenshots must show genuine features being tested.'
  },
  {
    title: '4. Constructive Private Feedback',
    content: 'Provide respectful, structured feedback regarding performance, UI, stability, and bugs directly through TesterSetu. Never post negative public reviews or demand compensation outside the platform credit system.'
  },
  {
    title: '5. Zero Tolerance for Abuse',
    content: 'Creating duplicate accounts, manipulating credit balances, or reporting false rejections will result in permanent account suspension and credit forfeiture.'
  }
];
