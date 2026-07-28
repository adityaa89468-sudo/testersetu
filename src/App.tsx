import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TestCircleLogo } from './components/TestCircleLogo';
import { SplashAndOnboarding } from './components/SplashAndOnboarding';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { AuthModal } from './components/AuthModal';
import { HomeDashboard } from './components/HomeDashboard';
import { Marketplace } from './components/Marketplace';
import { AddAppWizard } from './components/AddAppWizard';
import { AppDetailsModal } from './components/AppDetailsModal';
import { MyTasks } from './components/MyTasks';
import { DailyProofModal } from './components/DailyProofModal';
import { MyAppTracking } from './components/MyAppTracking';
import { ProofReviewModal } from './components/ProofReviewModal';
import { CampaignCompletionModal } from './components/CampaignCompletionModal';
import { PrivateFeedbackModal } from './components/PrivateFeedbackModal';
import { NotificationCenter } from './components/NotificationCenter';
import { ProfileAndSettings } from './components/ProfileAndSettings';
import { SafetyReportModal } from './components/SafetyReportModal';
import { AdminDashboard } from './components/AdminDashboard';
import { PrivacyPolicyView } from './components/PrivacyPolicyView';
import { AndroidDevToolkitModal } from './components/AndroidDevToolkitModal';
import { AppListing, Assignment, DailyProof, PrivateFeedback } from './types';
import { SEED_APPS } from './lib/seedData';
import { db, collection, onSnapshot, query, where, addDoc, doc, updateDoc } from './lib/firebase';

const AppContent: React.FC = () => {
  const { user, userProfile, loading } = useAuth();
  
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [currentTab, setCurrentTab] = useState<'home' | 'marketplace' | 'tasks' | 'my_apps' | 'profile' | 'admin'>('home');
  const [showSplash, setShowSplash] = useState(true);
  const [forcePrivacyView, setForcePrivacyView] = useState(() => {
    return window.location.search.includes('page=privacy') || window.location.pathname.includes('/privacy') || window.location.hash.includes('privacy');
  });

  // Firestore Data State
  const [apps, setApps] = useState<AppListing[]>(SEED_APPS);
  const [myAssignments, setMyAssignments] = useState<Assignment[]>([]);
  const [proofsMap, setProofsMap] = useState<Record<string, DailyProof[]>>({});
  const [assignmentsByApp, setAssignmentsByApp] = useState<Record<string, Assignment[]>>({});
  const [feedbackByApp, setFeedbackByApp] = useState<Record<string, PrivateFeedback[]>>({});

  // Modals
  const [addAppOpen, setAddAppOpen] = useState(false);
  const [selectedAppDetails, setSelectedAppDetails] = useState<AppListing | null>(null);
  const [selectedAssignmentForProof, setSelectedAssignmentForProof] = useState<Assignment | null>(null);
  const [selectedAppForReview, setSelectedAppForReview] = useState<AppListing | null>(null);
  const [selectedAssignmentForFeedback, setSelectedAssignmentForFeedback] = useState<Assignment | null>(null);
  const [selectedAppForCompletion, setSelectedAppForCompletion] = useState<AppListing | null>(null);
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const [androidDevToolkitOpen, setAndroidDevToolkitOpen] = useState(false);
  
  // Safety Report Modal State
  const [safetyReport, setSafetyReport] = useState<{
    isOpen: boolean;
    targetType: 'app' | 'proof' | 'user';
    targetId: string;
    targetTitle?: string;
  }>({
    isOpen: false,
    targetType: 'app',
    targetId: ''
  });

  // Fetch Firestore Apps
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'apps'), (snapshot) => {
      if (!snapshot.empty) {
        const firestoreApps: AppListing[] = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as AppListing));
        setApps(firestoreApps);
      }
    }, (err) => {
      console.warn("Using fallback seed apps due to Firestore rule/connection:", err.message);
    });

    return () => unsub();
  }, []);

  // Fetch User Assignments (where current user is tester)
  useEffect(() => {
    if (!user) {
      setMyAssignments([]);
      return;
    }

    const proofUnsubs: (() => void)[] = [];

    const q = query(collection(db, 'assignments'), where('testerId', '==', user.uid));
    const unsubMain = onSnapshot(
      q, 
      (snapshot) => {
        const list: Assignment[] = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Assignment));
        setMyAssignments(list);

        // Unsubscribe prior proof listeners before attaching new ones
        proofUnsubs.forEach(u => u());
        proofUnsubs.length = 0;

        // Listen to proofs for each active assignment
        list.forEach((asgn) => {
          const uProof = onSnapshot(
            collection(db, `assignments/${asgn.id}/dailyProofs`), 
            (pSnap) => {
              const proofs = pSnap.docs.map(pd => ({ id: pd.id, ...pd.data() } as DailyProof));
              setProofsMap(prev => ({ ...prev, [asgn.id]: proofs }));
            },
            (err) => {
              console.warn(`Proofs snapshot warning for ${asgn.id}:`, err.message);
            }
          );
          proofUnsubs.push(uProof);
        });
      },
      (err) => {
        console.warn("My assignments snapshot warning:", err.message);
      }
    );

    return () => {
      unsubMain();
      proofUnsubs.forEach(u => u());
    };
  }, [user]);

  // Fetch Assignments & Feedback for user's owned apps
  useEffect(() => {
    if (!user) return;

    const unsubs: (() => void)[] = [];
    const myApps = apps.filter(a => a.ownerId === user.uid);

    myApps.forEach((app) => {
      // Assignments
      const qAsgn = query(collection(db, 'assignments'), where('appId', '==', app.id));
      const uAsgn = onSnapshot(
        qAsgn, 
        (s) => {
          const list = s.docs.map(d => ({ id: d.id, ...d.data() } as Assignment));
          setAssignmentsByApp(prev => ({ ...prev, [app.id]: list }));
        },
        (err) => {
          console.warn(`AssignmentsByApp snapshot warning for ${app.id}:`, err.message);
        }
      );
      unsubs.push(uAsgn);

      // Feedback
      const qFb = query(collection(db, 'feedback'), where('appId', '==', app.id));
      const uFb = onSnapshot(
        qFb, 
        (s) => {
          const list = s.docs.map(d => ({ id: d.id, ...d.data() } as PrivateFeedback));
          setFeedbackByApp(prev => ({ ...prev, [app.id]: list }));
        },
        (err) => {
          console.warn(`FeedbackByApp snapshot warning for ${app.id}:`, err.message);
        }
      );
      unsubs.push(uFb);
    });

    return () => {
      unsubs.forEach(u => u());
    };
  }, [user, apps]);

  const handleOpenReportModal = (targetType: 'app' | 'proof' | 'user', targetId: string, targetTitle?: string) => {
    setSafetyReport({
      isOpen: true,
      targetType,
      targetId,
      targetTitle
    });
  };

  // If direct URL is requesting privacy page
  if (forcePrivacyView) {
    return (
      <PrivacyPolicyView 
        isStandalonePage 
        onNavigateHome={() => {
          if (window.history.pushState) {
            window.history.pushState({}, '', window.location.pathname);
          }
          setForcePrivacyView(false);
        }} 
      />
    );
  }

  // If initial auth is loading
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center space-y-4">
        <TestCircleLogo className="w-12 h-12 animate-pulse" />
        <p className="text-xs text-slate-400 font-bold">Initializing TesterSetu Platform...</p>
      </div>
    );
  }

  // If user is not logged in and splash is active
  if (!user && showSplash) {
    return (
      <>
        <SplashAndOnboarding
          onGetStarted={() => {
            setShowSplash(false);
            setAuthMode('register');
            setAuthModalOpen(true);
          }}
          onLogin={() => {
            setShowSplash(false);
            setAuthMode('login');
            setAuthModalOpen(true);
          }}
        />
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          mode={authMode}
          onSwitchMode={(mode) => setAuthMode(mode)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={currentTab}
        onNavigateTab={setCurrentTab}
        onOpenAuth={() => {
          setAuthMode('login');
          setAuthModalOpen(true);
        }}
        onOpenNotifications={() => setNotificationCenterOpen(true)}
        onOpenAndroidToolkit={() => setAndroidDevToolkitOpen(true)}
      />

      {/* Main Responsive Canvas Container */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pb-12 overflow-x-hidden">
        {currentTab === 'home' && (
          <HomeDashboard
            myApps={apps.filter(a => a.ownerId === user?.uid)}
            activeAssignments={myAssignments}
            pendingRequests={[]}
            onNavigateTab={setCurrentTab}
            onOpenAddApp={() => {
              if (!user) {
                setAuthMode('register');
                setAuthModalOpen(true);
                return;
              }
              setAddAppOpen(true);
            }}
            onOpenAppDetails={(appId) => {
              const target = apps.find(a => a.id === appId);
              if (target) setSelectedAppDetails(target);
            }}
          />
        )}

        {currentTab === 'marketplace' && (
          <Marketplace
            apps={apps}
            myRequestedAppIds={myAssignments.map(a => a.appId)}
            onOpenAppDetails={(appId) => {
              const target = apps.find(a => a.id === appId);
              if (target) setSelectedAppDetails(target);
            }}
            onRequestToTest={(app) => {
              if (!user) {
                setAuthMode('register');
                setAuthModalOpen(true);
                return;
              }
              setSelectedAppDetails(app);
            }}
          />
        )}

        {currentTab === 'tasks' && (
          <MyTasks
            assignments={myAssignments}
            proofsMap={proofsMap}
            onOpenProofModal={(asgn) => setSelectedAssignmentForProof(asgn)}
            onOpenFeedbackModal={(asgn) => setSelectedAssignmentForFeedback(asgn)}
          />
        )}

        {currentTab === 'my_apps' && (
          <MyAppTracking
            myApps={apps.filter(a => a.ownerId === user?.uid)}
            onOpenAddApp={() => setAddAppOpen(true)}
            onOpenProofReviewModal={(app) => setSelectedAppForReview(app)}
            assignmentsByApp={assignmentsByApp}
            feedbackByApp={feedbackByApp}
            onOpenCompletionModal={(app) => setSelectedAppForCompletion(app)}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileAndSettings />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab as any)}
        tasksBadgeCount={myAssignments.filter(a => a.status === 'in_progress').length}
        onOpenAddApp={() => {
          if (!user) {
            setAuthMode('register');
            setAuthModalOpen(true);
            return;
          }
          setAddAppOpen(true);
        }}
      />

      {/* ALL APPLICATION MODALS */}
      
      {/* Auth Dialog */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onSwitchMode={(m) => setAuthMode(m)}
      />

      {/* Add App Submission Wizard */}
      <AddAppWizard
        isOpen={addAppOpen}
        onClose={() => setAddAppOpen(false)}
        onAppCreated={() => {
          setCurrentTab('my_apps');
        }}
      />

      {/* App Details & Request to Test */}
      {selectedAppDetails && (
        <AppDetailsModal
          app={selectedAppDetails}
          isOpen={!!selectedAppDetails}
          onClose={() => setSelectedAppDetails(null)}
          onRequestToTest={async (appToTest) => {
            if (!user) {
              setAuthMode('register');
              setAuthModalOpen(true);
              return;
            }

            try {
              // Create assignment directly in Firestore
              const newAssignment = {
                appId: appToTest.id,
                appName: appToTest.appName,
                appIconUrl: appToTest.appIconUrl,
                appOwnerId: appToTest.ownerId,
                testerId: user.uid,
                testerDisplayName: userProfile?.displayName || user.displayName || 'Tester',
                optInLink: appToTest.optInLink,
                status: 'in_progress',
                startDate: Date.now(),
                completedDays: 0,
                currentDay: 1,
                testingInstructions: appToTest.testingInstructions,
                creditsReward: appToTest.creditsOffered,
                testingDurationDays: appToTest.testingDurationDays,
                updatedAt: Date.now()
              };

              await addDoc(collection(db, 'assignments'), newAssignment);

              // Update joined testers count on app
              await updateDoc(doc(db, 'apps', appToTest.id), {
                testersJoined: (appToTest.testersJoined || 0) + 1
              });

              setSelectedAppDetails(null);
              setCurrentTab('tasks');
            } catch (err) {
              console.error("Error creating assignment:", err);
            }
          }}
          onOpenReportModal={(app) => handleOpenReportModal('app', app.id, app.appName)}
        />
      )}

      {/* Daily Proof Upload Modal */}
      <DailyProofModal
        assignment={selectedAssignmentForProof}
        isOpen={!!selectedAssignmentForProof}
        onClose={() => setSelectedAssignmentForProof(null)}
        onProofSubmitted={() => {
          setSelectedAssignmentForProof(null);
        }}
      />

      {/* App Owner Proof Review Modal */}
      <ProofReviewModal
        app={selectedAppForReview}
        proofs={selectedAppForReview ? (Object.values(proofsMap).flat() as DailyProof[]).filter(p => p.appId === selectedAppForReview.id) : []}
        isOpen={!!selectedAppForReview}
        onClose={() => setSelectedAppForReview(null)}
        onRefresh={() => {}}
        onOpenReportModal={(targetType, targetId) => handleOpenReportModal(targetType, targetId)}
      />

      {/* Private Tester Feedback Modal */}
      <PrivateFeedbackModal
        assignment={selectedAssignmentForFeedback}
        isOpen={!!selectedAssignmentForFeedback}
        onClose={() => setSelectedAssignmentForFeedback(null)}
        onFeedbackSubmitted={() => {
          setSelectedAssignmentForFeedback(null);
        }}
      />

      {/* Campaign Completion Celebratory Modal */}
      <CampaignCompletionModal
        app={selectedAppForCompletion}
        isOpen={!!selectedAppForCompletion}
        onClose={() => setSelectedAppForCompletion(null)}
        feedbackList={selectedAppForCompletion ? (feedbackByApp[selectedAppForCompletion.id] || []) : []}
      />

      {/* Notification Drawer */}
      <NotificationCenter
        isOpen={notificationCenterOpen}
        onClose={() => setNotificationCenterOpen(false)}
        onNavigateTab={(tab) => {
          setNotificationCenterOpen(false);
          setCurrentTab(tab as any);
        }}
      />

      {/* Safety & Violation Report Modal */}
      <SafetyReportModal
        isOpen={safetyReport.isOpen}
        onClose={() => setSafetyReport({ ...safetyReport, isOpen: false })}
        targetType={safetyReport.targetType}
        targetId={safetyReport.targetId}
        targetTitle={safetyReport.targetTitle}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onSwitchMode={(mode) => setAuthMode(mode)}
      />

      {/* Android Dev Toolkit Modal */}
      <AndroidDevToolkitModal
        isOpen={androidDevToolkitOpen}
        onClose={() => setAndroidDevToolkitOpen(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
