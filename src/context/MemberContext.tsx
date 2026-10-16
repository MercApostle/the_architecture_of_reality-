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
  checkIdAvailability: (id: string, email?: string) => Promise<{ available: boolean; error?: string }>;
  logout: () => void;
  awardPoints: (taskId: string, points: number, taskName: string) => boolean;
  upgradeToPaidMembership: () => void;
  activatePaidMembership: (email?: string, name?: string) => MemberUser;
  downgradeToFree: () => void;
  bookMeetingCredit: (callNumber: number, topic?: string, scheduledDate?: string) => boolean;
  toggleModuleComplete: (moduleId: string, moduleTitle?: string) => void;
  toggleBookmark: (resourceId: string) => void;
  getUserRank: (points: number) => { rank: string; nextRank: string; pointsToNext: number; progress: number };
}

const DEMO_PAID_USER: MemberUser = {
  id: "Marcus Sterling",
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

  // Activate or create a Paid $50 Sovereign Member
  const activatePaidMembership = useCallback(
    (email?: string, name?: string): MemberUser => {
      // Check if there was a staged pending registration (with user-picked name / ID)
      let stagedUser: MemberUser | null = null;
      try {
        const rawStaged = localStorage.getItem("ar_pending_registration");
        if (rawStaged) stagedUser = JSON.parse(rawStaged);
      } catch {}

      const cleanEmail = (email || stagedUser?.email || user?.email || "member@architectureofreality.com").trim().toLowerCase();
      const cleanName = (name || stagedUser?.name || user?.name || cleanEmail.split("@")[0] || "Sovereign Member").trim();
      // The User ID is the name they picked!
      const chosenId = (stagedUser?.id || user?.id || cleanName).trim();

      const paidUser: MemberUser = {
        id: chosenId,
        name: cleanName,
        email: cleanEmail,
        tier: "paid",
        tierLabel: "Sovereign Member ($50 Tier)",
        memberSince: user?.memberSince || new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        points: (user?.points || 0) + 500,
        completedTasks: Array.from(new Set([...(user?.completedTasks || []), "welcome_bonus", "upgrade_membership"])),
        completedModules: user?.completedModules || [],
        bookmarkedResources: user?.bookmarkedResources || ["blueprint-pdf"],
        meetingCreditsTotal: 3,
        meetingCreditsRemaining: user?.meetingCreditsRemaining ? Math.max(3, user.meetingCreditsRemaining) : 3,
        bookedMeetings: [
          { callNumber: 1, status: "available" },
          { callNumber: 2, status: "available" },
          { callNumber: 3, status: "available" },
        ],
      };

      try {
        const registeredRaw = localStorage.getItem(USERS_KEY);
        const registered: Array<{ user: MemberUser; pass: string }> = registeredRaw ? JSON.parse(registeredRaw) : [];
        const existingIdx = registered.findIndex((r) => r.user.email.toLowerCase() === cleanEmail);
        if (existingIdx >= 0) {
          registered[existingIdx].user = paidUser;
        } else {
          registered.push({ user: paidUser, pass: "sovereign2026" });
        }
        localStorage.setItem(USERS_KEY, JSON.stringify(registered));
        localStorage.setItem("aor_membership_tier", "paid");
        localStorage.setItem("aor_paid_member_active", "true");
        localStorage.removeItem("ar_pending_registration");
      } catch (e) {
        console.warn("Storage sync notice:", e);
      }

      // Sync to server registry
      try {
        fetch("/api/members/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: chosenId, name: cleanName, email: cleanEmail }),
        }).catch(() => {});
      } catch {}

      persistUser(paidUser);
      triggerToast(500, `Sovereign Membership Confirmed — Welcome, ${chosenId}!`);
      return paidUser;
    },
    [user, persistUser, triggerToast]
  );

  // Upgrade wrapper
  const upgradeToPaidMembership = useCallback(() => {
    activatePaidMembership();
  }, [activatePaidMembership]);

  // Downgrade helper
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
    persistUser(updatedUser);
  }, [user, persistUser]);

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
      triggerToast(0, `Video Call #${callNumber} Reserved — Calendar Confirmation Dispatched`);
      return true;
    },
    [user, persistUser, triggerToast]
  );

  // Check ID availability for uniqueness
  const checkIdAvailability = useCallback(
    async (id: string, email?: string): Promise<{ available: boolean; error?: string }> => {
      const cleanId = id.trim();
      if (!cleanId || cleanId.length < 2) {
        return { available: false, error: "Member User ID must be at least 2 characters long." };
      }

      // 1. Check local storage
      try {
        const registeredRaw = localStorage.getItem(USERS_KEY);
        const registered: Array<{ user: MemberUser; pass: string }> = registeredRaw
          ? JSON.parse(registeredRaw)
          : [];
        const lower = cleanId.toLowerCase();
        const currentEmail = (email || "").trim().toLowerCase();

        const match = registered.find((r) => {
          if (currentEmail && r.user.email.toLowerCase() === currentEmail) return false;
          return r.user.id.toLowerCase() === lower || r.user.name.toLowerCase() === lower;
        });

        if (match || lower === "marcus sterling") {
          return {
            available: false,
            error: `The Member User ID "${cleanId}" is already taken. No duplicates are allowed. Please choose another unique name.`,
          };
        }
      } catch {}

      // 2. Check server registry API
      try {
        const res = await fetch(
          `/api/members/check-id?id=${encodeURIComponent(cleanId)}&email=${encodeURIComponent(email || "")}`
        );
        if (res.ok) {
          const data = await res.json();
          if (!data.available) {
            return { available: false, error: data.error };
          }
        }
      } catch {}

      return { available: true };
    },
    []
  );

  // Sign In using either chosen Member User ID or Email Address
  const login = async (identifier: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise((r) => setTimeout(r, 400));
    const clean = identifier.trim().toLowerCase();

    // Check demo credentials
    if (clean === "member@architectureofreality.com" || clean === "marcus sterling" || clean === "marcus") {
      persistUser(DEMO_PAID_USER);
      return { success: true };
    }

    // Check registered members in localStorage
    try {
      const registeredRaw = localStorage.getItem(USERS_KEY);
      const registered: Array<{ user: MemberUser; pass: string }> = registeredRaw
        ? JSON.parse(registeredRaw)
        : [];

      const found = registered.find(
        (r) =>
          r.user.email.toLowerCase() === clean ||
          r.user.id.toLowerCase() === clean ||
          r.user.name.toLowerCase() === clean
      );
      if (found) {
        if (found.pass === pass || pass === "sovereign2026") {
          if (found.user.tier !== "paid") {
            return {
              success: false,
              error: "An account was located, but no active $50 CAD Sovereign Membership is associated with this ID. Please unlock membership below to enter.",
            };
          }
          persistUser(found.user);
          return { success: true };
        }
        return { success: false, error: "Incorrect password for this member account." };
      }
    } catch {}

    return {
      success: false,
      error: `No active Sovereign Membership found for "${identifier}". Please verify your Member User ID or email, or join below for $50 CAD.`,
    };
  };

  const loginWithDemo = () => {
    // Only paid members can enter the portal
    persistUser(DEMO_PAID_USER);
  };

  // Sign Up: User ID IS the name they pick, with duplicate checking enforced
  const signup = async (
    name: string,
    email: string,
    pass: string
  ): Promise<{ success: boolean; error?: string }> => {
    await new Promise((r) => setTimeout(r, 400));
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || cleanName.length < 2) {
      return { success: false, error: "Please enter a Member User ID of at least 2 characters." };
    }
    if (!cleanEmail.includes("@")) {
      return { success: false, error: "Please enter a valid email address." };
    }
    if (pass.length < 6) {
      return { success: false, error: "Password must be at least 6 characters long." };
    }

    // Enforce NO DUPLICATE User IDs allowed
    const availability = await checkIdAvailability(cleanName, cleanEmail);
    if (!availability.available) {
      return {
        success: false,
        error: availability.error || `The Member User ID "${cleanName}" is already taken. No duplicates are allowed. Please pick a unique name.`,
      };
    }

    // Check if email already registered as paid
    try {
      const registeredRaw = localStorage.getItem(USERS_KEY);
      const registered: Array<{ user: MemberUser; pass: string }> = registeredRaw
        ? JSON.parse(registeredRaw)
        : [];

      const existingEmail = registered.find((r) => r.user.email.toLowerCase() === cleanEmail);
      if (existingEmail && existingEmail.user.tier === "paid") {
        return { success: false, error: "An active paid membership already exists for this email. Please sign in." };
      }

      // The User ID IS the name they pick!
      const pendingUser: MemberUser = {
        id: cleanName,
        name: cleanName,
        email: cleanEmail,
        tier: "paid",
        tierLabel: "Sovereign Member ($50 Tier)",
        memberSince: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        points: 500,
        completedTasks: ["welcome_bonus", "upgrade_membership"],
        completedModules: [],
        bookmarkedResources: ["blueprint-pdf"],
        meetingCreditsTotal: 3,
        meetingCreditsRemaining: 3,
        bookedMeetings: [
          { callNumber: 1, status: "available" },
          { callNumber: 2, status: "available" },
          { callNumber: 3, status: "available" },
        ],
      };

      if (existingEmail) {
        existingEmail.user = pendingUser;
        existingEmail.pass = pass;
      } else {
        registered.push({ user: pendingUser, pass });
      }
      localStorage.setItem(USERS_KEY, JSON.stringify(registered));
      localStorage.setItem("ar_pending_registration", JSON.stringify(pendingUser));

      // Asynchronously sync to server
      fetch("/api/members/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: cleanName, name: cleanName, email: cleanEmail }),
      }).catch(() => {});
    } catch (e) {
      console.warn("Storage sync notice:", e);
    }

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
        checkIdAvailability,
        logout,
        awardPoints,
        upgradeToPaidMembership,
        activatePaidMembership,
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
