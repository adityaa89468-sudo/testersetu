export type UserRole = 'user' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  developerName: string;
  country: string;
  experience: 'beginner' | 'intermediate' | 'experienced' | 'studio';
  photoURL?: string;
  playStoreDevLink?: string;
  agreedToManualTesting: boolean;
  credits: number;
  testingStreak: number;
  reliabilityScore: number;
  completedTestsCount: number;
  submittedAppsCount: number;
  role: UserRole;
  createdAt: number;
  updatedAt: number;
  isSuspended?: boolean;
  notificationPreferences?: {
    emailReminders: boolean;
    pushNotifications: boolean;
    proofUpdates: boolean;
  };
}

export type AppCategory = 
  | 'Tools' 
  | 'Productivity' 
  | 'Social' 
  | 'Games' 
  | 'Finance' 
  | 'Health & Fitness' 
  | 'Education' 
  | 'Lifestyle' 
  | 'Entertainment' 
  | 'Utilities';

export type AppStatus = 'pending_review' | 'active' | 'paused' | 'completed' | 'suspended';

export interface AppListing {
  id: string;
  ownerId: string;
  ownerDisplayName: string;
  ownerDevName: string;
  appName: string;
  packageName: string;
  category: AppCategory;
  shortDescription: string;
  fullDescription: string;
  appIconUrl: string;
  minAndroidVersion: string;
  optInLink: string;
  playStoreLink: string;
  googleGroupLink?: string;
  privacyPolicyUrl: string;
  devContactEmail: string;
  testersNeeded: number;
  testersJoined: number;
  testingDurationDays: number;
  startDate: number;
  testingInstructions: string;
  dailyProofRequirement: string;
  creditsOffered: number;
  status: AppStatus;
  isVerified: boolean;
  createdAt: number;
  updatedAt: number;
}

export type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';

export interface TestingRequest {
  id: string;
  appId: string;
  appName: string;
  appIconUrl: string;
  appOwnerId: string;
  testerId: string;
  testerDisplayName: string;
  testerDevName: string;
  testerPhotoUrl?: string;
  creditsReserved: number;
  status: RequestStatus;
  rejectionReason?: string;
  createdAt: number;
  updatedAt: number;
}

export type AssignmentStatus = 'in_progress' | 'completed' | 'disputed' | 'cancelled';

export interface Assignment {
  id: string;
  requestId: string;
  appId: string;
  appName: string;
  appIconUrl: string;
  appOwnerId: string;
  testerId: string;
  testerDisplayName: string;
  testerPhotoUrl?: string;
  testingDurationDays: number;
  currentDay: number;
  completedDays: number;
  startDate: number;
  status: AssignmentStatus;
  creditsReward: number;
  testingInstructions: string;
  optInLink: string;
  playStoreLink: string;
  createdAt: number;
  updatedAt: number;
}

export type ProofStatus = 'under_review' | 'accepted' | 'rejected';

export interface DailyProof {
  id: string;
  assignmentId: string;
  appId: string;
  testerId: string;
  appOwnerId: string;
  dayNumber: number;
  screenshotUrl: string;
  notes: string;
  featuresTested: string;
  bugsFound: string;
  clientTimestamp: number;
  serverTimestamp: number;
  status: ProofStatus;
  rejectionReason?: string;
  createdAt: number;
}

export interface PrivateFeedback {
  id: string;
  appId: string;
  appName: string;
  assignmentId: string;
  testerId: string;
  testerDisplayName: string;
  appOwnerId: string;
  rating: number;
  uiRating: number;
  performanceRating: number;
  stabilityRating: number;
  easeOfUseRating: number;
  bugsFound: string;
  suggestedImprovements: string;
  deviceModel: string;
  androidVersion: string;
  createdAt: number;
}

export type NotificationType = 
  | 'request' 
  | 'request_accepted' 
  | 'request_rejected' 
  | 'proof_submitted' 
  | 'proof_accepted' 
  | 'proof_rejected' 
  | 'feedback' 
  | 'campaign_completed' 
  | 'admin';

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  relatedId?: string;
  read: boolean;
  createdAt: number;
}

export type CreditTransactionType = 
  | 'WELCOME_BONUS' 
  | 'EARNED_TESTING' 
  | 'PENALTY_MISSED_TESTING'
  | 'RESERVED_CAMPAIGN' 
  | 'REFUNDED' 
  | 'ADMIN_ADJUSTMENT' 
  | 'CAMPAIGN_FEE';

export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number;
  type: CreditTransactionType;
  relatedAppId?: string;
  relatedAssignmentId?: string;
  previousBalance: number;
  newBalance: number;
  description: string;
  createdAt: number;
}

export type ReportReason = 
  | 'invalid_link' 
  | 'misleading_info' 
  | 'inappropriate_content' 
  | 'suspicious_proof' 
  | 'harassment' 
  | 'credit_manipulation' 
  | 'other';

export interface SafetyReport {
  id: string;
  reporterId: string;
  reporterDisplayName: string;
  targetType: 'app' | 'proof' | 'user';
  targetId: string;
  targetTitle?: string;
  reason: ReportReason;
  details: string;
  status: 'pending' | 'resolved' | 'dismissed';
  resolutionNotes?: string;
  createdAt: number;
}

export interface PlatformConfig {
  minTestingDays: number;
  defaultTesterReward: number;
  maxActiveAppsPerUser: number;
  welcomeBonusCredits: number;
  announcements?: { id: string; title: string; content: string; date: number }[];
}
