"use client";

import { useEffect } from 'react';
import { startMockApi } from '@/lib/mockApi';

export function MockApiProvider() {
    useEffect(() => {
        startMockApi();
    }, []);

    return null;
}
