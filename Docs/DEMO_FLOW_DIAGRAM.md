# Demo Flow Diagram
## Visual Representation of End-to-End Journey

---

## Complete Flow Visualization

```
┌─────────────────────────────────────────────────────────────────┐
│                    ORGANIZER DASHBOARD                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │ Total Events│  │Registrations│  │ CME Hours   │           │
│  │      8      │  │   1,247     │  │    114      │           │
│  └─────────────┘  └─────────────┘  └─────────────┘           │
│                                                                 │
│  [Create New Event Button]                                      │
│         │                                                        │
│         ▼                                                        │
│  ┌──────────────────────────────────────┐                      │
│  │     CREATE EVENT WIZARD              │                      │
│  │  1. Basic Info (Title, Date, Loc)    │                      │
│  │  2. Accreditation Details             │                      │
│  │  3. CME Hours                         │                      │
│  │  4. Sponsorship? ✓ [Checked]         │                      │
│  │  5. Review & Submit                   │                      │
│  └──────────────────────────────────────┘                      │
│         │                                                        │
│         ▼                                                        │
│  Event Status: "Pending Funding"                                │
│         │                                                        │
└─────────┼────────────────────────────────────────────────────────┘
          │
          │ Auto-switch to Vendor view
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    VENDOR DASHBOARD                             │
│                                                                 │
│  Marketplace Feed: Events Seeking Sponsorship                  │
│  ┌──────────────────────────────────────────────┐             │
│  │ [Event Card]                                   │             │
│  │ Title: مؤتمر الجراحة العامة                   │             │
│  │ Needs Sponsorship: ✓                          │             │
│  │ Package: Gold - 50,000 SAR                    │             │
│  │ [Sponsor This Event Button]                   │             │
│  └──────────────────────────────────────────────┘             │
│         │                                                        │
│         ▼                                                        │
│  ┌──────────────────────────────────────┐                      │
│  │     SPONSOR MODAL                    │                      │
│  │  Event Details                       │                      │
│  │  SFDA License: [Input]               │                      │
│  │  Terms: [✓ Checkbox]                 │                      │
│  │  [Confirm Sponsorship]               │                      │
│  └──────────────────────────────────────┘                      │
│         │                                                        │
│         ▼                                                        │
│  Event Status: "Pending Approval"                               │
│  Toast: "تم تأكيد الرعاية بنجاح"                                │
│         │                                                        │
└─────────┼────────────────────────────────────────────────────────┘
          │
          │ Event moves to Regulator queue
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                  REGULATOR DASHBOARD                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │   Pending   │  │  Approved   │  │ Total Hours │          │
│  │      2      │  │      4      │  │    114      │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
│                                                                 │
│  Approval Queue (Left)    │    National Report (Right)         │
│  ┌─────────────────────┐  │  ┌─────────────────┐              │
│  │ [Event Card]         │  │  │ Regional Dist.  │              │
│  │ Status: Pending     │  │  │ Riyadh: 45%     │              │
│  │ SFDA: MDS-REQ-...   │  │  │ Jeddah: 30%     │              │
│  │ [Approve & Publish] │  │  │ Eastern: 15%    │              │
│  └─────────────────────┘  │  └─────────────────┘              │
│         │                   │                                  │
│         ▼                   │                                  │
│  Loading Toast: "جاري المشاركة..."                            │
│         │                   │                                  │
│         ▼ (1.5s delay)      │                                  │
│  Success Toast: "تم الاعتماد بنجاح"                           │
│         │                   │                                  │
│         ▼                   │                                  │
│  Event Status: "Published"  │                                  │
│         │                   │                                  │
└─────────┼───────────────────┼──────────────────────────────────┘
          │                   │
          │ Event visible to HCPs
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      HCP DASHBOARD                              │
│  ┌──────────────────────────────────────────────────┐          │
│  │         CME TRACKING CARD                         │          │
│  │  Total Hours: 24    Progress: 60%                │          │
│  │  [Progress Bar]                                    │          │
│  │  Remaining: 16 hours                               │          │
│  └──────────────────────────────────────────────────┘          │
│                                                                 │
│  Tabs: [All Events] [My Tickets] [Tracking]                   │
│         │                                                        │
│         ▼                                                        │
│  ┌──────────────────────────────────────────────┐             │
│  │     DISCOVERY GRID                            │             │
│  │  [Search Bar]                                 │             │
│  │                                               │             │
│  │  ┌────────────────────┐  ┌─────────────────┐│             │
│  │  │ [Event Card]        │  │ [Event Card]    ││             │
│  │  │ Title: مؤتمر...    │  │ Title: ندوة...  ││             │
│  │  │ CME Accredited ✓    │  │ CME Accredited ✓││             │
│  │  │ 18 CME Hours        │  │ 8 CME Hours     ││             │
│  │  │ [Register Now]      │  │ [Register Now]  ││             │
│  │  └────────────────────┘  └─────────────────┘│             │
│  └──────────────────────────────────────────────┘             │
│         │                                                        │
│         ▼                                                        │
│  Click "Register Now"                                           │
│         │                                                        │
│         ▼                                                        │
│  Toast: "تم التسجيل في الفعالية بنجاح"                          │
│  Button: "تم التسجيل" (disabled)                               │
│         │                                                        │
│         ▼                                                        │
│  Switch to "My Tickets" tab                                     │
│         │                                                        │
│         ▼                                                        │
│  ┌──────────────────────────────────────────────┐             │
│  │     MY TICKETS                                │             │
│  │  ┌────────────────────┐                      │             │
│  │  │ [Event Card]        │                      │             │
│  │  │ Ticket Confirmed ✓  │                      │             │
│  │  │ [QR Code Display]   │                      │             │
│  │  │ [Check-in Button]   │                      │             │
│  │  └────────────────────┘                      │             │
│  └──────────────────────────────────────────────┘             │
│         │                                                        │
│         ▼                                                        │
│  Click "Check-in"                                               │
│         │                                                        │
│         ▼                                                        │
│  Toast: "تم تأكيد الحضور! تم رصد 18 ساعة في ممارس+"            │
│  Button: "تم التحضير ورصد الساعات" (disabled)                   │
│         │                                                        │
│         ▼                                                        │
│  CME Tracking Card Updates: +18 hours                           │
│  Progress: 60% → 105% (Goal achieved!)                          │
│         │                                                        │
│         ▼                                                        │
│  Switch to "Tracking" tab                                        │
│         │                                                        │
│         ▼                                                        │
│  ┌──────────────────────────────────────────────┐             │
│  │     TRACKING VIEW                             │             │
│  │  Event History:                               │             │
│  │  • مؤتمر الجراحة... +18 ساعة CME            │             │
│  │  • مؤتمر القلب... +24 ساعة CME              │             │
│  │  Total: 42 hours                              │             │
│  └──────────────────────────────────────────────┘             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Key Interaction Points

### 1. **Organizer → Vendor**
- Event creation with "Needs Sponsorship" checked
- Auto-switch to Vendor view (or manual navigation)
- Event appears in marketplace

### 2. **Vendor → Regulator**
- Sponsorship confirmation
- Event status: Pending Funding → Pending Approval
- Event moves to regulator queue

### 3. **Regulator → HCP**
- Approval action
- Event status: Pending Approval → Published
- Event visible in HCP discovery

### 4. **HCP Registration**
- One-click registration
- Event added to "My Tickets"
- CME tracking updates

### 5. **HCP Check-in**
- QR code check-in simulation
- Hours automatically tracked
- Real-time progress update

---

## Status Flow Diagram

```
Draft
  │
  │ (Submit)
  ▼
Pending Funding ────┐
  │                 │
  │ (Sponsor)       │
  ▼                 │
Pending Approval ──┤
  │                 │
  │ (Approve)       │
  ▼                 │
Published ◄─────────┘
  │
  │ (Event Complete)
  ▼
Completed
```

---

## Data Flow

```
Organizer Creates Event
    │
    ├─→ Mock Data: events[]
    │
    ├─→ Status: "Pending Funding"
    │
    └─→ Context Update: addEvent()

Vendor Sponsors Event
    │
    ├─→ Mock Data: events[].is_sponsored = true
    │
    ├─→ Status: "Pending Approval"
    │
    └─→ Context Update: sponsorEvent()

Regulator Approves Event
    │
    ├─→ Mock Data: events[].status = "Published"
    │
    ├─→ Visible to HCPs
    │
    └─→ Context Update: approveEvent()

HCP Registers
    │
    ├─→ Mock Data: myTickets[] += eventId
    │
    └─→ Context Update: registerForEvent()

HCP Checks In
    │
    ├─→ Mock Data: checkedInEvents[] += eventId
    │
    ├─→ CME Hours: totalCMEHours += event.cme_hours
    │
    └─→ Toast Notification
```

---

## Demo Sequence (5-7 minutes)

1. **Start:** Organizer Dashboard (30 sec)
   - Show statistics
   - Show existing events

2. **Create Event:** Wizard flow (1 min)
   - Fill form
   - Check "Needs Sponsorship"
   - Submit

3. **Sponsor Event:** Vendor view (1 min)
   - See new event
   - Click sponsor
   - Enter SFDA license
   - Confirm

4. **Approve Event:** Regulator view (1 min)
   - See pending event
   - Review details
   - Approve
   - Show success

5. **Discover & Register:** HCP view (1.5 min)
   - Show CME tracking
   - Browse events
   - Register for new event
   - Show ticket

6. **Check-in:** HCP My Tickets (1 min)
   - Show QR code
   - Simulate check-in
   - Show CME update

7. **Track Progress:** HCP Tracking (30 sec)
   - Show history
   - Show updated totals

---

## Critical Demo Points

✅ **Unified Platform:** All 4 personas in one system  
✅ **Real-Time Updates:** Status changes instantly  
✅ **Complete Lifecycle:** Creation → Sponsorship → Approval → Registration → Tracking  
✅ **Visual Polish:** Modern UI, statistics, progress bars  
✅ **Arabic RTL:** Full right-to-left support  
✅ **No Fragmentation:** Everything in one place  

---

**Ready for:** Final testing and polish  
**Meeting:** 26 November

