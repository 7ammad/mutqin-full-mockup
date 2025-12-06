"use client";

import { useMemo } from "react";
import { getHcpCredits } from "@/context/demoStore";

/**
 * Unified CME Data Hook
 * 
 * Provides a single source of truth for CME hours calculation across the application.
 * All components should use this hook instead of calculating CME data independently.
 * 
 * @param hcpId - The HCP user ID (default: "hcp-1" for demo)
 * @returns Unified CME data including current hours, required hours, progress, etc.
 */
export function useCmeData(hcpId: string = "hcp-1") {
    const creditsData = useMemo(() => getHcpCredits(hcpId), [hcpId]);

    // CME Calculation Logic (unified)
    // Total CME hours = posted (certified) + earned (attended, not yet certified)
    const currentHours = creditsData.posted + creditsData.earned;
    
    // Required hours per year
    // Specialists: 40 hours/year (default)
    // General Practitioners/Dentists: 30 hours/year
    // For demo, using 40 as default. In production, this should come from user profile/license type
    const requiredHours = 40;
    
    // Progress calculation
    const progress = Math.min((currentHours / requiredHours) * 100, 100);
    const remainingHours = Math.max(requiredHours - currentHours, 0);
    const isComplete = currentHours >= requiredHours;
    
    return {
        // Raw data from source
        creditsData,
        
        // Calculated values
        currentHours,
        requiredHours,
        progress,
        remainingHours,
        isComplete,
        
        // Breakdown
        posted: creditsData.posted,
        earned: creditsData.earned,
        pending: creditsData.pending,
        
        // Helper values
        totalHours: currentHours, // Alias for currentHours
    };
}


