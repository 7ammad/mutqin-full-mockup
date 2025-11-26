# Complete Sitemap - Event-Med Platform
## All Routes and Pages

**Date:** 2024  
**Total Pages:** 52  
**Current:** 13 (25% complete)

---

## Static Routes (36)

### Public Routes
1. `/` - Landing Page ✅
2. `/auth/login` - Login Page ✅
3. `/auth/register` - Registration Page ❌
4. `/auth/forgot-password` - Password Recovery ❌
5. `/auth/reset-password` - Password Reset ❌
6. `/demo` - Component Demo ✅
7. `/not-found` - 404 Error Page ✅
8. `/error` - Error Boundary ✅
9. `/sitemap.xml` - Sitemap ✅
10. `/robots.txt` - Robots File ✅

### Dashboard Routes
11. `/dashboard` - Dashboard Redirect ✅
12. `/dashboard/profile` - User Profile ❌
13. `/dashboard/settings` - Settings ❌
14. `/dashboard/settings/notifications` - Notification Settings ❌
15. `/dashboard/settings/security` - Security Settings ❌

### HCP Routes
16. `/dashboard/hcp` - HCP Dashboard ✅
17. `/dashboard/hcp/tickets` - My Tickets ❌
18. `/dashboard/hcp/certificates` - Certificates ❌

### Organizer Routes
19. `/dashboard/organizer` - Organizer Dashboard ✅
20. `/dashboard/organizer/events/create` - Create Event ❌

### Vendor Routes
21. `/dashboard/vendor` - Vendor Dashboard ✅

### Regulator Routes
22. `/dashboard/regulator` - Regulator Dashboard ✅

### Event Manager Routes
23. `/dashboard/event-manager` - Event Manager Dashboard ✅

### Onboarding Routes
24. `/onboarding/hcp` - HCP Onboarding ❌
25. `/onboarding/organizer` - Organizer Onboarding ❌
26. `/onboarding/vendor` - Vendor Onboarding ❌
27. `/onboarding/regulator` - Regulator Onboarding ❌
28. `/onboarding/event-manager` - Event Manager Onboarding ❌

### Missing Static Routes (9)
29. `/events` - Event Listing ❌
30. `/events/search` - Event Search ❌
31. `/events/browse` - Browse Events ❌
32. `/dashboard/hcp/events` - HCP Event Discovery ❌
33. `/dashboard/organizer/events` - Organizer Events List ❌
34. `/dashboard/vendor/marketplace` - Vendor Marketplace ❌
35. `/dashboard/vendor/campaigns` - Vendor Campaigns List ❌
36. `/dashboard/regulator/applications` - Regulator Applications Queue ❌

---

## Dynamic Routes (16)

### Event Routes (8 events in mockData)
37. `/events/1` - Event Detail (Saudi Cardiology Conference) ❌
38. `/events/2` - Event Detail (Advanced Nursing Workshop) ❌
39. `/events/3` - Event Detail (Pediatrics Symposium) ❌
40. `/events/4` - Event Detail (General Surgery Conference) ❌
41. `/events/5` - Event Detail (Advanced Anesthesia Course) ❌
42. `/events/6` - Event Detail (Clinical Pharmacy Conference) ❌
43. `/events/7` - Event Detail (Emergency Medicine Symposium) ❌
44. `/events/8` - Event Detail (Diagnostic Radiology Workshop) ❌

### Registration Routes (8 events)
45. `/events/1/register` - Registration ❌
46. `/events/2/register` - Registration ❌
47. `/events/3/register` - Registration ❌
48. `/events/4/register` - Registration ❌
49. `/events/5/register` - Registration ❌
50. `/events/6/register` - Registration ❌
51. `/events/7/register` - Registration ❌
52. `/events/8/register` - Registration ❌

---

## Additional Dynamic Routes (Variable - Based on User Data)

### HCP Dynamic Routes
- `/dashboard/hcp/events/[id]` - HCP Event View (per event)
- `/dashboard/hcp/tickets/[id]` - Ticket Detail (per ticket)
- `/dashboard/hcp/certificates/[id]` - Certificate Detail (per certificate)

### Organizer Dynamic Routes
- `/dashboard/organizer/events/[id]` - Event Management (per event)
- `/dashboard/organizer/events/[id]/edit` - Edit Event (per event)
- `/dashboard/organizer/events/[id]/assign` - Assign Manager (per event)
- `/dashboard/organizer/events/[id]/registrations` - View Registrations (per event)
- `/dashboard/organizer/events/[id]/attendance` - Attendance (per event)
- `/dashboard/organizer/events/[id]/certificates` - Certificates (per event)
- `/dashboard/organizer/events/[id]/sponsors` - Sponsors (per event)

### Vendor Dynamic Routes
- `/dashboard/vendor/campaigns/[id]` - Campaign Detail (per campaign)
- `/dashboard/vendor/events/[id]` - Event Sponsorship (per event)
- `/dashboard/vendor/sponsorships/[id]` - Sponsorship Detail (per sponsorship)

### Regulator Dynamic Routes
- `/dashboard/regulator/applications/[id]` - Application Review (per application)
- `/dashboard/regulator/applications/[id]/decision` - Decision (per application)
- `/dashboard/regulator/applications/[id]/checklist` - Checklist (per application)

### Event Manager Dynamic Routes
- `/dashboard/event-manager/events/[id]` - Event Management (per event)
- `/dashboard/event-manager/events/[id]/checkin` - QR Check-in (per event)
- `/dashboard/event-manager/events/[id]/attendance` - Attendance (per event)

---

## Sitemap Diagram

```
event-med.ksa/
│
├── / (Landing) ✅
├── /auth/
│   ├── /login ✅
│   ├── /register ❌
│   ├── /forgot-password ❌
│   └── /reset-password ❌
│
├── /events/
│   ├── / (Listing) ❌
│   ├── /search ❌
│   ├── /browse ❌
│   ├── /[id] ❌ (8 pages: /1, /2, /3, /4, /5, /6, /7, /8)
│   └── /[id]/register ❌ (8 pages: /1/register, /2/register, etc.)
│
├── /onboarding/
│   ├── /hcp ❌
│   ├── /organizer ❌
│   ├── /vendor ❌
│   ├── /regulator ❌
│   └── /event-manager ❌
│
├── /dashboard/
│   ├── / (Redirect) ✅
│   ├── /profile ❌
│   ├── /settings/
│   │   ├── / ❌
│   │   ├── /notifications ❌
│   │   └── /security ❌
│   │
│   ├── /hcp/
│   │   ├── / ✅
│   │   ├── /events ❌
│   │   ├── /events/[id] ❌ (variable)
│   │   ├── /tickets ❌
│   │   ├── /tickets/[id] ❌ (variable)
│   │   ├── /certificates ❌
│   │   └── /certificates/[id] ❌ (variable)
│   │
│   ├── /organizer/
│   │   ├── / ✅
│   │   ├── /events ❌
│   │   ├── /events/create ❌
│   │   ├── /events/[id] ❌ (variable)
│   │   ├── /events/[id]/edit ❌ (variable)
│   │   ├── /events/[id]/assign ❌ (variable)
│   │   ├── /events/[id]/registrations ❌ (variable)
│   │   ├── /events/[id]/attendance ❌ (variable)
│   │   ├── /events/[id]/certificates ❌ (variable)
│   │   └── /events/[id]/sponsors ❌ (variable)
│   │
│   ├── /vendor/
│   │   ├── / ✅
│   │   ├── /marketplace ❌
│   │   ├── /campaigns ❌
│   │   ├── /campaigns/[id] ❌ (variable)
│   │   ├── /events/[id] ❌ (variable)
│   │   └── /sponsorships/[id] ❌ (variable)
│   │
│   ├── /regulator/
│   │   ├── / ✅
│   │   ├── /applications ❌
│   │   ├── /applications/[id] ❌ (variable)
│   │   ├── /applications/[id]/decision ❌ (variable)
│   │   ├── /applications/[id]/checklist ❌ (variable)
│   │   ├── /analytics ❌
│   │   └── /audit ❌
│   │
│   └── /event-manager/
│       ├── / ✅
│       ├── /events/[id] ❌ (variable)
│       ├── /events/[id]/checkin ❌ (variable)
│       └── /events/[id]/attendance ❌ (variable)
│
├── /demo ✅
├── /not-found ✅
├── /error ✅
├── /sitemap.xml ✅
└── /robots.txt ✅
```

---

## Status Summary

**Total Static Routes:** 36  
**Total Dynamic Routes (Current Data):** 16  
**Total Pages:** 52

**Existing:** 13 pages (25%)  
**Missing:** 39 pages (75%)

---

**Legend:**
- ✅ = Exists
- ❌ = Missing
- (variable) = Dynamic route, count depends on data



