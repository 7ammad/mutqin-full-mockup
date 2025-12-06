"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getAllEventsFull } from "@/lib/dataSource";
import type { DemoEvent } from "@/context/demoSeed";
import RegulatorQueueTab from "./RegulatorQueueTab";
import RegulatorReviewTab from "./RegulatorReviewTab";
import RegulatorDecisionsTab from "./RegulatorDecisionsTab";
import RegulatorAuditTab from "./RegulatorAuditTab";
import RegulatorAnalyticsTab from "./RegulatorAnalyticsTab";

type TabType = 'queue' | 'review' | 'decisions' | 'monitoring' | 'analytics';

export default function RegulatorView() {
  const searchParams = useSearchParams();
  const tab = (searchParams.get('tab') || 'queue') as TabType;
  const itemId = searchParams.get('itemId') || undefined;

  const [allEvents, setAllEvents] = useState<DemoEvent[]>([]);
  const [queueEvents, setQueueEvents] = useState<DemoEvent[]>([]);

  const loadData = async () => {
    try {
      const events = await getAllEventsFull();
      setAllEvents(events);
      // Filter to pending_review for queue
      const pending = events.filter(e => e.status === 'pending_review');
      setQueueEvents(pending);
    } catch (err) {
      console.error('Failed to load regulator data:', err);
      // Set empty arrays on error to prevent UI crashes
      setQueueEvents([]);
      setAllEvents([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDecision = async () => {
    await loadData();
  };

  return (
    <div className="space-y-6">
      {tab === 'queue' && <RegulatorQueueTab queueEvents={queueEvents} />}
      {tab === 'review' && (
        <RegulatorReviewTab
          itemId={itemId}
          queueEvents={queueEvents}
          onDecision={handleDecision}
        />
      )}
      {tab === 'decisions' && <RegulatorDecisionsTab allEvents={allEvents} />}
      {tab === 'monitoring' && <RegulatorAuditTab allEvents={allEvents} />}
      {tab === 'analytics' && <RegulatorAnalyticsTab allEvents={allEvents} />}
    </div>
  );
}
