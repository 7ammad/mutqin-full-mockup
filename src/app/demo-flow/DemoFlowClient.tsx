'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

type TabKey = 'organizer' | 'regulator' | 'eventManager' | 'hcp' | 'vendor';

type FlowState = {
  accreditationStatus?: 'pending_review' | 'approved' | 'draft';
  eventStatus?: 'draft' | 'pending_review' | 'approved' | 'published' | 'closed';
  assignmentId?: string;
  assignmentStatus?: 'pending' | 'accepted' | 'declined';
  ticketId?: string;
  ticketStatus?: 'confirmed' | 'attended';
  attendanceFinalized?: boolean;
  certificateId?: string;
  reviewId?: string;
  sponsorshipId?: string;
};

const defaultIds = {
  eventId: 'evt-1',
  organizerId: 'org-1',
  eventManagerId: 'em-1',
  hcpId: 'hcp-1',
  vendorId: 'vendor-1',
  accreditationId: 'acc-1',
};

const tabs: { key: TabKey; label: string }[] = [
  { key: 'organizer', label: 'Organizer' },
  { key: 'regulator', label: 'Regulator' },
  { key: 'eventManager', label: 'Event Manager' },
  { key: 'hcp', label: 'HCP' },
  { key: 'vendor', label: 'Vendor' },
];

function jsonPretty(value: unknown) {
  if (!value) return '—';
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export default function DemoFlowClient() {
  const [activeTab, setActiveTab] = useState<TabKey>('organizer');
  const [flowState, setFlowState] = useState<FlowState>({
    eventStatus: 'published',
    assignmentId: 'assign-1',
    assignmentStatus: 'pending',
    ticketId: 'tkt-1',
    ticketStatus: 'confirmed',
  });
  const [lastResult, setLastResult] = useState<unknown>(null);
  const [lastError, setLastError] = useState<string>('');
  const [inputs, setInputs] = useState({
    accreditationId: defaultIds.accreditationId,
    reviewText: '',
    rating: 5,
    rejectionReason: '',
    sponsorshipPackage: 'gold',
  });

  const withResult = async <T,>(fn: () => Promise<T>) => {
    setLastError('');
    try {
      const res = await fn();
      setLastResult(res);
      return res;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setLastError(message);
      setLastResult(null);
      return null;
    }
  };

  const handleSubmitAccreditation = async () => {
    const res = await withResult(() =>
      api.submitAccreditation({ eventId: defaultIds.eventId })
    );
    if (res && res.ok) {
      setFlowState((prev) => ({ ...prev, accreditationStatus: 'pending_review', eventStatus: 'pending_review' }));
    }
  };

  const handleReviewApprove = async () => {
    const res = await withResult(() =>
      api.reviewAccreditation({
        eventId: defaultIds.eventId,
        decision: 'approve',
        accreditationId: inputs.accreditationId,
      })
    );
    if (res && res.ok) {
      setFlowState((prev) => ({ ...prev, accreditationStatus: 'approved', eventStatus: 'approved' }));
    }
  };

  const handleReviewReject = async () => {
    const res = await withResult(() =>
      api.reviewAccreditation({
        eventId: defaultIds.eventId,
        decision: 'reject',
        reason: inputs.rejectionReason,
      })
    );
    if (res && res.ok) {
      setFlowState((prev) => ({ ...prev, accreditationStatus: 'draft', eventStatus: 'draft' }));
    }
  };

  const handlePublish = async () => {
    const res = await withResult(() =>
      api.publishEvent({ eventId: defaultIds.eventId, organizerId: defaultIds.organizerId })
    );
    if (res && res.ok) {
      setFlowState((prev) => ({ ...prev, eventStatus: 'published' }));
    }
  };

  const handleCreateAssignment = async () => {
    const res = await withResult(() =>
      api.createAssignment({
        eventId: defaultIds.eventId,
        eventManagerId: defaultIds.eventManagerId,
      })
    );
    if (res && res.ok) {
      setFlowState((prev) => ({
        ...prev,
        assignmentId: res.assignmentId,
        assignmentStatus: 'pending',
      }));
    }
  };

  const handleAcceptAssignment = async () => {
    if (!flowState.assignmentId) return;
    const res = await withResult(() =>
      api.respondAssignment({
        assignmentId: flowState.assignmentId as string,
        decision: 'accept',
      })
    );
    if (res && res.ok) {
      setFlowState((prev) => ({ ...prev, assignmentStatus: 'accepted' }));
    }
  };

  const handleRegister = async () => {
    const res = await withResult(() =>
      api.createRegistration({
        eventId: defaultIds.eventId,
        hcpId: defaultIds.hcpId,
      })
    );
    if (res && res.ok) {
      setFlowState((prev) => ({
        ...prev,
        ticketId: res.ticketId,
        ticketStatus: 'confirmed',
      }));
    }
  };

  const handleCheckIn = async () => {
    if (!flowState.ticketId) return;
    const res = await withResult(() =>
      api.checkIn({
        ticketId: flowState.ticketId as string,
        eventManagerId: defaultIds.eventManagerId,
      })
    );
    if (res && res.ok) {
      setFlowState((prev) => ({ ...prev, ticketStatus: 'attended' }));
    }
  };

  const handleFinalize = async () => {
    const res = await withResult(() =>
      api.finalizeAttendance({
        eventId: defaultIds.eventId,
        eventManagerId: defaultIds.eventManagerId,
      })
    );
    if (res && res.ok) {
      setFlowState((prev) => ({ ...prev, attendanceFinalized: true }));
    }
  };

  const handleIssueCertificate = async () => {
    const res = await withResult(() =>
      api.issueCertificate({
        eventId: defaultIds.eventId,
        hcpId: defaultIds.hcpId,
      })
    );
    if (res && res.ok) {
      setFlowState((prev) => ({ ...prev, certificateId: res.certificateId }));
    }
  };

  const handleCreateReview = async () => {
    const res = await withResult(() =>
      api.createReview({
        eventId: defaultIds.eventId,
        hcpId: defaultIds.hcpId,
        rating: inputs.rating,
        text: inputs.reviewText,
      })
    );
    if (res && res.ok) {
      setFlowState((prev) => ({ ...prev, reviewId: res.reviewId }));
    }
  };

  const handlePurchaseSponsorship = async () => {
    const res = await withResult(() =>
      api.purchaseSponsorship({
        eventId: defaultIds.eventId,
        vendorId: defaultIds.vendorId,
        package: inputs.sponsorshipPackage,
      })
    );
    if (res && res.ok) {
      setFlowState((prev) => ({ ...prev, sponsorshipId: res.sponsorshipId }));
    }
  };

  const publishDisabled = flowState.eventStatus !== 'approved';
  const registerDisabled = flowState.eventStatus !== 'published';
  const acceptDisabled = flowState.assignmentStatus !== 'pending' || !flowState.assignmentId;
  const checkInDisabled =
    flowState.ticketStatus !== 'confirmed' ||
    flowState.assignmentStatus !== 'accepted' ||
    flowState.eventStatus !== 'published';
  const finalizeDisabled = flowState.ticketStatus !== 'attended';
  const certificateDisabled =
    !flowState.attendanceFinalized ||
    flowState.eventStatus !== 'approved' ||
    flowState.ticketStatus !== 'attended';
  const reviewDisabled = flowState.ticketStatus !== 'attended';

  const renderOutput = () => (
    <section className="bg-gray-50 border rounded p-3 space-y-2">
      <div>
        <p className="text-sm font-semibold">Last result</p>
        <pre className="text-xs bg-white border rounded p-2 overflow-auto">{jsonPretty(lastResult)}</pre>
      </div>
      <div>
        <p className="text-sm font-semibold">Last error</p>
        <p className="text-xs text-red-600">{lastError || '—'}</p>
      </div>
      <div>
        <p className="text-sm font-semibold">Derived state (local)</p>
        <pre className="text-xs bg-white border rounded p-2 overflow-auto">
          {jsonPretty(flowState)}
        </pre>
      </div>
    </section>
  );

  const renderOrganizer = () => (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          className="px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-40"
          onClick={handleSubmitAccreditation}
        >
          Submit Accreditation
        </button>
        <button
          className="px-3 py-2 bg-indigo-600 text-white rounded disabled:opacity-40"
          onClick={handlePublish}
          disabled={publishDisabled}
        >
          Publish Event
        </button>
        <button
          className="px-3 py-2 bg-slate-600 text-white rounded disabled:opacity-40"
          onClick={handleCreateAssignment}
        >
          Create Assignment
        </button>
      </div>
      {renderOutput()}
    </div>
  );

  const renderRegulator = () => (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 items-center">
        <input
          className="border rounded px-2 py-1 text-sm"
          value={inputs.accreditationId}
          onChange={(e) => setInputs((prev) => ({ ...prev, accreditationId: e.target.value }))}
          placeholder="accreditationId"
        />
        <button
          className="px-3 py-2 bg-green-600 text-white rounded disabled:opacity-40"
          onClick={handleReviewApprove}
        >
          Approve
        </button>
        <input
          className="border rounded px-2 py-1 text-sm"
          value={inputs.rejectionReason}
          onChange={(e) => setInputs((prev) => ({ ...prev, rejectionReason: e.target.value }))}
          placeholder="Rejection reason"
        />
        <button
          className="px-3 py-2 bg-red-600 text-white rounded disabled:opacity-40"
          onClick={handleReviewReject}
        >
          Reject
        </button>
      </div>
      {renderOutput()}
    </div>
  );

  const renderEventManager = () => (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          className="px-3 py-2 bg-teal-600 text-white rounded disabled:opacity-40"
          onClick={handleAcceptAssignment}
          disabled={acceptDisabled}
        >
          Accept Assignment
        </button>
        <button
          className="px-3 py-2 bg-amber-600 text-white rounded disabled:opacity-40"
          onClick={handleCheckIn}
          disabled={checkInDisabled}
        >
          Check-in Ticket
        </button>
        <button
          className="px-3 py-2 bg-emerald-600 text-white rounded disabled:opacity-40"
          onClick={handleFinalize}
          disabled={finalizeDisabled}
        >
          Finalize Attendance
        </button>
        <button
          className="px-3 py-2 bg-purple-600 text-white rounded disabled:opacity-40"
          onClick={handleIssueCertificate}
          disabled={certificateDisabled}
        >
          Issue Certificate
        </button>
      </div>
      {renderOutput()}
    </div>
  );

  const renderHcp = () => (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 items-center">
        <button
          className="px-3 py-2 bg-blue-700 text-white rounded disabled:opacity-40"
          onClick={handleRegister}
          disabled={registerDisabled}
        >
          Register
        </button>
        <input
          type="number"
          className="border rounded px-2 py-1 text-sm w-20"
          min={1}
          max={5}
          value={inputs.rating}
          onChange={(e) => setInputs((prev) => ({ ...prev, rating: Number(e.target.value) }))}
        />
        <input
          className="border rounded px-2 py-1 text-sm w-48"
          placeholder="Review text"
          value={inputs.reviewText}
          onChange={(e) => setInputs((prev) => ({ ...prev, reviewText: e.target.value }))}
        />
        <button
          className="px-3 py-2 bg-slate-700 text-white rounded disabled:opacity-40"
          onClick={handleCreateReview}
          disabled={reviewDisabled}
        >
          Submit Review
        </button>
      </div>
      {renderOutput()}
    </div>
  );

  const renderVendor = () => (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 items-center">
        <select
          className="border rounded px-2 py-1 text-sm"
          value={inputs.sponsorshipPackage}
          onChange={(e) => setInputs((prev) => ({ ...prev, sponsorshipPackage: e.target.value }))}
        >
          <option value="bronze">bronze</option>
          <option value="gold">gold</option>
          <option value="platinum">platinum</option>
        </select>
        <button
          className="px-3 py-2 bg-orange-600 text-white rounded"
          onClick={handlePurchaseSponsorship}
        >
          Purchase Sponsorship
        </button>
      </div>
      {renderOutput()}
    </div>
  );

  const renderTabContent = () => {
    if (activeTab === 'organizer') return renderOrganizer();
    if (activeTab === 'regulator') return renderRegulator();
    if (activeTab === 'eventManager') return renderEventManager();
    if (activeTab === 'hcp') return renderHcp();
    return renderVendor();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-2 rounded border ${
              activeTab === tab.key ? 'bg-black text-white' : 'bg-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <section className="text-sm text-gray-700 space-y-1">
        <div>المعرفات الجاهزة للاستخدام في التدفق:</div>
        <div className="flex flex-wrap gap-3">
          <span>eventId: {defaultIds.eventId}</span>
          <span>organizerId: {defaultIds.organizerId}</span>
          <span>eventManagerId: {defaultIds.eventManagerId}</span>
          <span>hcpId: {defaultIds.hcpId}</span>
          <span>vendorId: {defaultIds.vendorId}</span>
        </div>
      </section>

      <div>{renderTabContent()}</div>
    </div>
  );
}
