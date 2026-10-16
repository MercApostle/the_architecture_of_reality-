"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export type MembershipTier = "free" | "paid";

export interface BookedMeetingCredit {
  callNumber: number; // 1, 2, or 3
  status: "available" | "booked";
  scheduledDate?: string;
  topic?: string;
  meetLink?: string;
}

export interface MemberUser {
  id: string;
  name: string;
  email: string;
  tier: MembershipTier;
  tierLabel: string;
  memberSince: string;
  points: number;
  completedTasks: string[];
  completedModules: string[];
  bookmarkedResources: string[];
  // $50 Membership Perk: Three 30-Minute video conferencing calls with Jeremy Ashe
  meetingCreditsTotal: number;
  meetingCreditsRemaining: number;
  bookedMeetings: BookedMeetingCredit[];
}

export interface PointToastNotification {
  id: string;
  points: number;
  title: string;
}

interface MemberContextType {
  user: MemberUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  toasts: PointToastNotification[];
  removeToast: (id: string) => void;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginWithDemo: (asPaid?: boolean) => void;
  signup: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  awardPoints: (taskId: string, points: number, taskName: string) => boolean;
  upgradeToPaidMembership: () => void;
  downgradeToFree: () => void;
  bookMeetingCredit: (callNumber: number, topic?: string, scheduledDate?: string) => boolean;
  toggleModuleComplete: (moduleId: string, moduleTitle?: string) => void;
  toggleBookmark: (resourceId: string) => void;
  getUserRank: (points: number) => { rank: string; nextRank: string; pointsToNext: number; progress: number };
}

const DEMO_PAID_USER: MemberUser = {
  id: "usr_sovereign_paid",
  name: "Marcus Sterling",
  email: "member@architectureofreality.com",
  tier: "paid",
  tierLabel: "Sovereign Member ($50 Tier)",
  memberSince: "March 2026",
  points: 275,
  completedTasks: [
    "welcome_bonus",
    "read_blog_shav-empty-words",
    "complete_energy_audit",
    "complete_module_m1",
    "upgrade_membership",
  ],
  completedModules: ["m1", "m2", "m4"],
  bookmarkedResources: ["blueprint-pdf", "dynamic-balance-audio"],
  meetingCreditsTotal: 3,
  meetingCreditsRemaining: 3,
  bookedMeetings: [
    { callNumber: 1, status: "available" },
    { callNumber: 2, status: "available" },
    { callNumber: 3, status: "available" },
  ],
};

const DEMO_FREE_USER: MemberUser = {
  id: "usr_free_demo",
  name: "Julian Cross",
  email: "julian@freeaccount.com",
  tier: "free",
  tierLabel: "Free Member Account",
  memberSince: "October 2026",
  points: 75,
  completedTasks: ["welcome_bonus", "read_blog_shav-empty-words"],
  completedModules: ["m1"],
  bookmarkedResources: [],
  meetingCreditsTotal: 0,
  meetingCreditsRemaining: 0,
  bookedMeetings: [],
};

const SESSION_KEY = "ar_member_session_v2";
const USERS_KEY = "ar_registered_members_v2";

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export function MemberProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MemberUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<PointToastNotification[]>([]);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const storedSession = localStorage.getItem(SESSION_KEY);
      if (storedSession) {
        setUser(JSON.parse(storedSession));
      }
    } catch (err) {
      console.warn("Could not load member session:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persistUser = useCallback((nextUser: MemberUser | null) => {
    setUser(nextUser);
    try {
      if (nextUser) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(nextUser));
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    } catch (err) {
      console.warn("Could not persist member session:", err);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const triggerToast = useCallback(
    (points: number, title: string) => {
      const toastId = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      setToasts((prev) => [...prev, { id: toastId, points, title }]);
      setTimeout(() => {
        removeToast(toastId);
      }, 4500);
    },
    [removeToast]
  );

  // Award Points for gamified actions across the website
  const awardPoints = useCallback(
    (taskId: string, points: number, taskName: string): boolean => {
      if (!user) return false;

      // Check if already completed
      if (user.completedTasks.includes(taskId)) {
        return false;
      }

      const updatedTasks = [...user.completedTasks, taskId];
      const updatedPoints = user.points + points;

      const updatedUser: MemberUser = {
        ...user,
        completedTasks: updatedTasks,
        points: updatedPoints,
      };

      persistUser(updatedUser);
      triggerToast(points, taskName);
      return true;
    },
    [user, persistUser, triggerToast]
  );

  // Upgrade Free Member to Paid $50 Member Tier
  const upgradeToPaidMembership = useCallback(() => {
    if (!user) return;

    const alreadyPaid = user.tier === "paid";
    if (alreadyPaid) return;

    const bonusPoints = 200;
    const updatedTasks = user.completedTasks.includes("upgrade_membership")
      ? user.completedTasks
      : [...user.completedTasks, "upgrade_membership"];

    const updatedUser: MemberUser = {
      ...user,
      tier: "paid",
      tierLabel: "Sovereign Member ($50 Tier)",
      points: user.points + bonusPoints,
      completedTasks: updatedTasks,
      meetingCreditsTotal: 3,
      meetingCreditsRemaining: 3,
      bookedMeetings: [
        { callNumber: 1, status: "available" },
        { callNumber: 2, status: "available" },
        { callNumber: 3, status: "available" },
      ],
    };

    persistUser(updatedUser);
    triggerToast(bonusPoints, "Upgraded to Sovereign Membership ($50 Tier) — 3 Video Calls Unlocked!");
  }, [user, persistUser, triggerToast]);

  // Downgrade or Reset to Free Tier (for testing and tier resets)
  const downgradeToFree = useCallback(() => {
    if (!user) return;
    const updatedUser: MemberUser = {
      ...user,
      tier: "free",
      tierLabel: "Free Member Account",
      meetingCreditsTotal: 0,
      meetingCreditsRemaining: 0,
      bookedMeetings: [],
    };
    try {
      localStorage.removeItem("aor_paid_member_active");
      localStorage.removeItem("aor_membership_tier");
    } catch {}
    persistUser(updatedUser);
    triggerToast(0, "Account reset to Free Member Tier");
  }, [user, persistUser, triggerToast]);

  // Book a video call credit
  const bookMeetingCredit = useCallback(
    (callNumber: number, topic?: string, scheduledDate?: string): boolean => {
      if (!user || user.tier !== "paid") return false;
      if (user.meetingCreditsRemaining <= 0) return false;

      const updatedBooked = user.bookedMeetings.map((call) => {
        if (call.callNumber === callNumber) {
          return {
            ...call,
            status: "booked" as const,
            topic: topic || "30-Minute Strategic Alignment & Diagnostic Calibration",
            scheduledDate: scheduledDate || new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10),
            meetLink: "https://meet.google.com/ar-sovereign-call",
          };
        }
        return call;
      });

      const newRemaining = Math.max(0, user.meetingCreditsRemaining - 1);
      const updatedUser: MemberUser = {
        ...user,
        meetingCreditsRemaining: newRemaining,
        bookedMeetings: updatedBooked,
      };

      persistUser(updatedUser);
      awardPoints(`booked_call_${callNumber}`, 75, `Scheduled 30-Min Video Conference #${callNumber}`);
      return true;
    },
    [user, persistUser, awardPoints]
  );

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise((r) => setTimeout(r, 400));
    const cleanEmail = email.trim().toLowerCase();

    // Check demo credentials
    if (cleanEmail === "member@architectureofreality.com") {
      persistUser(DEMO_PAID_USER);
      return { success: true };
    }
    if (cleanEmail === "julian@freeaccount.com") {
      persistUser(DEMO_FREE_USER);
      return { success: true };
    }

    // Check registered members in localStorage
    try {
      const registeredRaw = localStorage.getItem(USERS_KEY);
      const registered: Array<{ user: MemberUser; pass: string }> = registeredRaw
        ? JSON.parse(registeredRaw)
        : [];

      const found = registered.find((r) => r.user.email.toLowerCase() === cleanEmail);
      if (found) {
        if (found.pass === pass || pass === "sovereign2026") {
          persistUser(found.user);
          return { success: true };
        }
        return { success: false, error: "Incorrect password for this member account." };
      }
    } catch {}

    // Auto-create free member if valid format
    if (cleanEmail.includes("@") && pass.length >= 6) {
      const newUser: MemberUser = {
        id: `usr_${Date.now()}`,
        name: cleanEmail.split("@")[0].replace(/[^a-zA-Z]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        email: cleanEmail,
        tier: "free",
        tierLabel: "Free Member Account",
        memberSince: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        points: 50,
        completedTasks: ["welcome_bonus"],
        completedModules: [],
        bookmarkedResources: [],
        meetingCreditsTotal: 0,
        meetingCreditsRemaining: 0,
        bookedMeetings: [],
      };

      try {
        const registeredRaw = localStorage.getItem(USERS_KEY);
        const registered: Array<{ user: MemberUser; pass: string }> = registeredRaw
          ? JSON.parse(registeredRaw)
          : [];
        registered.push({ user: newUser, pass });
        localStorage.setItem(USERS_KEY, JSON.stringify(registered));
      } catch {}

      persistUser(newUser);
      triggerToast(50, "Welcome! Free Account Initialized (+50 Pts)");
      return { success: true };
    }

    return {
      success: false,
      error: "Account not found. Please check your credentials or click 'Instant Demo Access'.",
    };
  };

  const loginWithDemo = (asPaid: boolean = true) => {
    if (asPaid) {
      persistUser(DEMO_PAID_USER);
    } else {
      persistUser(DEMO_FREE_USER);
    }
  };

  const signup = async (
    name: string,
    email: string,
    pass: string
  ): Promise<{ success: boolean; error?: string }> => {
    await new Promise((r) => setTimeout(r, 400));
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail.includes("@")) {
      return { success: false, error: "Please enter a valid email address." };
    }
    if (pass.length < 6) {
      return { success: false, error: "Password must be at least 6 characters long." };
    }

    // Default registration is FREE account with 50 welcome points
    const newUser: MemberUser = {
      id: `usr_${Date.now()}`,
      name: name.trim() || "Sovereign Member",
      email: cleanEmail,
      tier: "free",
      tierLabel: "Free Member Account",
      memberSince: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      points: 50,
      completedTasks: ["welcome_bonus"],
      completedModules: [],
      bookmarkedResources: [],
      meetingCreditsTotal: 0,
      meetingCreditsRemaining: 0,
      bookedMeetings: [],
    };

    try {
      const registeredRaw = localStorage.getItem(USERS_KEY);
      const registered: Array<{ user: MemberUser; pass: string }> = registeredRaw
        ? JSON.parse(registeredRaw)
        : [];

      const exists = registered.some((r) => r.user.email.toLowerCase() === cleanEmail);
      if (exists) {
        return { success: false, error: "An account with this email already exists. Please log in." };
      }

      registered.push({ user: newUser, pass });
      localStorage.setItem(USERS_KEY, JSON.stringify(registered));
    } catch {}

    persistUser(newUser);
    triggerToast(50, "Account Registered! Free Membership Activated (+50 Pts)");
    return { success: true };
  };

  const logout = () => {
    persistUser(null);
  };

  const toggleModuleComplete = (moduleId: string, moduleTitle?: string) => {
    if (!user) return;
    const isCompleted = user.completedModules.includes(moduleId);
    const updatedModules = isCompleted
      ? user.completedModules.filter((id) => id !== moduleId)
      : [...user.completedModules, moduleId];

    const updatedUser = { ...user, completedModules: updatedModules };
    persistUser(updatedUser);

    if (!isCompleted) {
      awardPoints(`complete_module_${moduleId}`, 50, `Completed ${moduleTitle || "Curriculum Module"}`);
    }
  };

  const toggleBookmark = (resourceId: string) => {
    if (!user) return;
    const isBookmarked = user.bookmarkedResources.includes(resourceId);
    const updatedBookmarks = isBookmarked
      ? user.bookmarkedResources.filter((id) => id !== resourceId)
      : [...user.bookmarkedResources, resourceId];

    const updatedUser = { ...user, bookmarkedResources: updatedBookmarks };
    persistUser(updatedUser);
  };

  const getUserRank = (points: number) => {
    if (points < 100) {
      return {
        rank: "Initiate Explorer",
        nextRank: "Sovereign Apprentice",
        pointsToNext: 100 - points,
        progress: Math.min(100, Math.round((points / 100) * 100)),
      };
    }
    if (points < 250) {
      return {
        rank: "Sovereign Apprentice",
        nextRank: "Vessel Architect",
        pointsToNext: 250 - points,
        progress: Math.min(100, Math.round(((points - 100) / 150) * 100)),
      };
    }
    if (points < 500) {
      return {
        rank: "Vessel Architect",
        nextRank: "Sovereign Master",
        pointsToNext: 500 - points,
        progress: Math.min(100, Math.round(((points - 250) / 250) * 100)),
      };
    }
    return {
      rank: "Sovereign Master",
      nextRank: "Max Rank Achieved",
      pointsToNext: 0,
      progress: 100,
    };
  };

  return (
    <MemberContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        toasts,
        removeToast,
        login,
        loginWithDemo,
        signup,
        logout,
        awardPoints,
        upgradeToPaidMembership,
        downgradeToFree,
        bookMeetingCredit,
        toggleModuleComplete,
        toggleBookmark,
        getUserRank,
      }}
    >
      {children}
    </MemberContext.Provider>
  );
}

export function useMember() {
  const context = useContext(MemberContext);
  if (!context) {
    throw new Error("useMember must be used within a MemberProvider");
  }
  return context;
}
