"use client";

import { useEffect, useState } from 'react';

/**
 * MockApiProvider - MSW initialization (disabled by default)
 * 
 * MSW is now disabled by default. To enable it, set:
 * NEXT_PUBLIC_API_MOCKING=enabled
 * 
 * In demo mode (NEXT_PUBLIC_DEMO_MODE=true), MSW is not needed
 * as data comes from static files.
 */
export function MockApiProvider() {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const initMSW = async () => {
            try {
                // Only start MSW if explicitly enabled
                const apiMocking = process.env.NEXT_PUBLIC_API_MOCKING === 'enabled';
                
                if (apiMocking && process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
                    const { startMockApi, isMSWAvailable } = await import('@/lib/mockApi');
                await startMockApi();
                    
                    // Verify MSW is actually available
                    const available = isMSWAvailable();
                    if (available) {
                        console.log('[MockApiProvider] MSW initialized and verified');
                    } else {
                        console.warn('[MockApiProvider] MSW started but service worker not active');
                    }
                } else {
                    // MSW disabled - set ready immediately
                    if (typeof window !== 'undefined') {
                        (window as Window & { __mswReady?: boolean }).__mswReady = true;
                    }
                }
                setIsReady(true);
            } catch (error) {
                console.error('[MockApiProvider] MSW initialization failed:', error);
                // Still set ready to prevent blocking
                if (typeof window !== 'undefined') {
                    (window as Window & { __mswReady?: boolean }).__mswReady = true;
                }
                setIsReady(true);
            }
        };
        initMSW();
    }, []);

    return null;
}
