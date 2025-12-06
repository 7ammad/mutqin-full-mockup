# Implementation Plan
## Missing Routes & Pages

**Current:** 13/52 pages (25%)  
**Target:** 52/52 pages (100%)

---

## Phase 1: Critical (3 routes)
1. `/dashboard` - Redirect to role-specific dashboard
2. Verify `/not-found` and `/error` pages

## Phase 2: Auth & Onboarding (8 routes)
3. `/auth/register`
4. `/auth/forgot-password`
5. `/auth/reset-password`
6. `/onboarding/hcp`
7. `/onboarding/organizer`
8. `/onboarding/vendor`
9. `/onboarding/regulator`
10. `/onboarding/event-manager`

## Phase 3: Public Events (11 routes)
11. `/events` - Listing
12. `/events/search` - Search
13. `/events/browse` - Browse
14. `/events/[id]` - Detail (8 events)
15. `/events/[id]/register` - Register (8 events)

## Phase 4: HCP Routes (6 routes)
16. `/dashboard/hcp/events` - Event discovery
17. `/dashboard/hcp/events/[id]` - Event detail
18. `/dashboard/hcp/tickets` - Tickets list
19. `/dashboard/hcp/tickets/[id]` - Ticket detail
20. `/dashboard/hcp/certificates` - Certificates list
21. `/dashboard/hcp/certificates/[id]` - Certificate detail

## Phase 5: Organizer Routes (8 routes)
22. `/dashboard/organizer/events` - Events list
23. `/dashboard/organizer/events/create` - Create event
24. `/dashboard/organizer/events/[id]` - Event management
25. `/dashboard/organizer/events/[id]/edit` - Edit
26. `/dashboard/organizer/events/[id]/registrations` - Registrations
27. `/dashboard/organizer/events/[id]/attendance` - Attendance
28. `/dashboard/organizer/events/[id]/certificates` - Certificates
29. `/dashboard/organizer/events/[id]/sponsors` - Sponsors

## Phase 6: Vendor Routes (5 routes)
30. `/dashboard/vendor/marketplace` - Marketplace
31. `/dashboard/vendor/campaigns` - Campaigns list
32. `/dashboard/vendor/campaigns/[id]` - Campaign detail
33. `/dashboard/vendor/events/[id]` - Event sponsorship
34. `/dashboard/vendor/sponsorships/[id]` - Sponsorship detail

## Phase 7: Regulator Routes (4 routes)
35. `/dashboard/regulator/applications` - Applications queue
36. `/dashboard/regulator/applications/[id]` - Application review
37. `/dashboard/regulator/applications/[id]/decision` - Decision
38. `/dashboard/regulator/applications/[id]/checklist` - Checklist

## Phase 8: Event Manager Routes (3 routes)
39. `/dashboard/event-manager/events/[id]` - Event management
40. `/dashboard/event-manager/events/[id]/checkin` - Check-in
41. `/dashboard/event-manager/events/[id]/attendance` - Attendance

## Phase 9: Settings (4 routes)
42. `/dashboard/profile` - Profile
43. `/dashboard/settings` - Settings overview
44. `/dashboard/settings/notifications` - Notifications
45. `/dashboard/settings/security` - Security

---

## Testing Requirements

- Unit tests for each route (Jest + React Testing Library)
- Integration tests for critical flows (Playwright)
- Route accessibility tests
- Component rendering tests

---

## Implementation Order

Start Phase 1 → Complete sequentially → Test each phase → Update status

















