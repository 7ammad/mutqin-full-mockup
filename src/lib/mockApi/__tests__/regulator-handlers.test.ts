import { describe, it, expect, beforeEach } from 'vitest';
import { resetDemo, getState, getRegulatorQueueData, getRegulatorAnalyticsData, getRegulatorMonitoringData } from '../../../context/demoStore';

describe('Regulator API Handlers - Response Shape Compliance', () => {
  beforeEach(() => {
    resetDemo();
  });

  describe('GET /api/read/regulator/queue', () => {
    it('returns correct ApiResponse envelope with data shape matching CONTRACTS.md', () => {
      const result = getRegulatorQueueData();

      // Verify envelope structure
      expect(result).toHaveProperty('counts');
      expect(result).toHaveProperty('items');
      expect(Array.isArray(result.items)).toBe(true);

      // Verify counts shape
      expect(result.counts).toHaveProperty('pending');
      expect(result.counts).toHaveProperty('dueSoon');
      expect(result.counts).toHaveProperty('overdueCompliance');
      expect(typeof result.counts.pending).toBe('number');
      expect(typeof result.counts.dueSoon).toBe('number');
      expect(typeof result.counts.overdueCompliance).toBe('number');

      // Verify items shape (RegulatorQueueItem)
      if (result.items.length > 0) {
        const item = result.items[0];
        expect(item).toHaveProperty('activityId');
        expect(item).toHaveProperty('title');
        expect(item).toHaveProperty('providerName');
        expect(item).toHaveProperty('city');
        expect(item).toHaveProperty('specialty');
        expect(item).toHaveProperty('startDate');
        expect(item).toHaveProperty('endDate');
        expect(item).toHaveProperty('status');
        expect(item).toHaveProperty('riskFlags');
        expect(Array.isArray(item.riskFlags)).toBe(true);

        // Verify status is valid ActivityStatus
        const validStatuses = ['pending_review', 'approved', 'draft', 'published', 'closed'];
        expect(validStatuses).toContain(item.status);
      }

      // Verify non-empty on fresh load (TASK 5 requirement)
      expect(result.items.length).toBeGreaterThanOrEqual(6);
    });

    it('filters by city correctly', () => {
      const all = getRegulatorQueueData();
      const filtered = getRegulatorQueueData({ city: 'Riyadh' });

      expect(filtered.items.length).toBeLessThanOrEqual(all.items.length);
      filtered.items.forEach((item) => {
        expect(item.city).toBe('Riyadh');
      });
    });

    it('filters by specialty correctly', () => {
      const all = getRegulatorQueueData();
      const filtered = getRegulatorQueueData({ specialty: 'Cardiology' });

      expect(filtered.items.length).toBeLessThanOrEqual(all.items.length);
      filtered.items.forEach((item) => {
        expect(item.specialty).toBe('Cardiology');
      });
    });
  });

  describe('GET /api/read/regulator/analytics', () => {
    it('returns correct ApiResponse envelope with data shape matching CONTRACTS.md', () => {
      const result = getRegulatorAnalyticsData();

      // Verify envelope structure
      expect(result).toHaveProperty('summary');
      expect(result).toHaveProperty('breakdown');
      expect(Array.isArray(result.breakdown)).toBe(true);

      // Verify summary shape (RegulatorAnalyticsSummary)
      expect(result.summary).toHaveProperty('totalActivities');
      expect(result.summary).toHaveProperty('approvedRate');
      expect(result.summary).toHaveProperty('avgDecisionTimeDays');
      expect(result.summary).toHaveProperty('overdueAttendanceRecords');
      expect(result.summary).toHaveProperty('overdueHoursRegistration');

      expect(typeof result.summary.totalActivities).toBe('number');
      expect(typeof result.summary.approvedRate).toBe('number');
      expect(result.summary.approvedRate).toBeGreaterThanOrEqual(0);
      expect(result.summary.approvedRate).toBeLessThanOrEqual(100);
      expect(typeof result.summary.avgDecisionTimeDays).toBe('number');
      expect(result.summary.avgDecisionTimeDays).toBeGreaterThanOrEqual(0);
      expect(typeof result.summary.overdueAttendanceRecords).toBe('number');
      expect(typeof result.summary.overdueHoursRegistration).toBe('number');

      // Verify breakdown shape
      result.breakdown.forEach((item) => {
        expect(item).toHaveProperty('key');
        expect(item).toHaveProperty('value');
        expect(typeof item.key).toBe('string');
        expect(typeof item.value).toBe('number');
      });

      // Verify avgDecisionTimeDays is computed from submittedAt/decisionAt (not random)
      const state = getState();
      const eventsWithTime = state.events.filter((e) => e.submittedAt && e.decisionAt);
      if (eventsWithTime.length > 0) {
        const expectedAvg = eventsWithTime.reduce((sum, e) => {
          const submitted = new Date(e.submittedAt!).getTime();
          const decided = new Date(e.decisionAt!).getTime();
          return sum + (decided - submitted) / (1000 * 60 * 60 * 24);
        }, 0) / eventsWithTime.length;
        expect(result.summary.avgDecisionTimeDays).toBeCloseTo(expectedAvg, 1);
      }
    });

    it('returns non-empty breakdown on fresh load', () => {
      const result = getRegulatorAnalyticsData({ groupBy: 'city' });
      // Should have breakdown data
      expect(result.breakdown.length).toBeGreaterThan(0);
    });

    it('filters by date range correctly', () => {
      const all = getRegulatorAnalyticsData();
      const filtered = getRegulatorAnalyticsData({
        from: '2024-01-01',
        to: '2024-12-31',
      });

      expect(filtered.summary.totalActivities).toBeLessThanOrEqual(all.summary.totalActivities);
    });
  });

  describe('No new status strings introduced', () => {
    it('only uses valid ActivityStatus values', () => {
      const queueData = getRegulatorQueueData();
      const validStatuses = ['draft', 'pending_review', 'approved', 'rejected', 'published', 'completed', 'closed'];

      queueData.items.forEach((item) => {
        expect(validStatuses).toContain(item.status);
      });
    });

    it('only uses valid AttendanceRecordsStatus values', () => {
      const monitoringData = getRegulatorMonitoringData();
      const validStatuses = ['not_started', 'in_progress', 'submitted', 'accepted', 'returned_for_fix', 'overdue'];

      monitoringData.forEach((item) => {
        expect(validStatuses).toContain(item.attendanceRecords.status);
        expect(validStatuses).toContain(item.hoursRegistration.status);
      });
    });
  });
});

