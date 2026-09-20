# Custom Template RSVP Integration Guide

This guide outlines the standard operating procedure (SOP) for enabling full RSVP and Dashboard functionality on manually created (hardcoded) custom templates that are bypassing the standard Template Builder flow.

## 1. Frontend Configuration

### 1.1 `data.js` Constraints
When defining your static data for the custom template, you must assign it a unique tracking code. 
> [!WARNING]
> **Database Constraint:** The PostgreSQL database explicitly restricts the `code` column to a **MAXIMUM of 10 characters** (`VARCHAR(10)`). If your code exceeds this, the backend will silently fail and return a `400 Bad Request`.

```javascript
export const customData = {
  // MUST BE 10 CHARACTERS OR LESS
  code: 'SHORTCODE', 
  eventsData: [
    { id: "pooja", title: "Pooja", date: "13th Dec, 2026", time: "11:30 AM" },
    { id: "wedding", title: "Wedding", date: "20th Dec, 2026", time: "5:00 PM" }
  ],
  // ...
};
```

### 1.2 `App.jsx` Routing
Create the dashboard routes explicitly in your `App.jsx` and pass the **exact same short code** to the `CustomRsvpDashboard` component.

```javascript
<Route 
  path="/template/theme-name/client-slug/rsvp" 
  element={<CustomRsvpDashboard weddingCode="SHORTCODE" coupleName="Client Names" />} 
/>
```

### 1.3 `InviteQRSVP` Component Integration
When rendering the `InviteQRSVP` component on the custom template, you must pass the events data directly to it. This prevents the component from attempting to fetch an unavailable Builder configuration from the backend.

```javascript
<InviteQRSVP 
  savedData={customData} 
  events={customData.eventsData} // Crucial for static templates
/>
```

### 1.4 Dashboard "Public" Fetching (Production Ready)
> [!CAUTION]
> **NEVER HARDCODE ADMIN CREDENTIALS!** Earlier prototypes used an "invisible login" that hardcoded the master admin password in the frontend. This is a critical security vulnerability and must **never** be used in production.

For customized templates, the client usually wants their dashboard to be easily accessible via a public URL without requiring an InviteQue user account. 

To achieve this securely, the Java backend has been permanently updated with dedicated **Public Endpoints**. When building your `CustomRsvpDashboard`, you must fetch the data from the `/api/public/rsvp/` routes, which require absolutely no authentication:

```javascript
// ✅ Correct: Fetching from the public endpoint (No login required)
const rsvpRes = await fetch(`${API_URL}/api/public/rsvp/weddings/${code}/rsvps`);
const summaryRes = await fetch(`${API_URL}/api/public/rsvp/weddings/${code}/rsvp-summary`);
const exportUrl = `${API_URL}/api/public/rsvp/weddings/${code}/rsvps/export`;
```

*Note: You do not need to modify any backend Java code for future templates. The public endpoints are already set up to serve any valid wedding code globally.*

---

## 2. Production Database Registration

Because static custom templates are not created via the frontend Builder, the backend PostgreSQL database has no record of them. If the database has no record of the Invite or its Events, RSVP submissions will either fail or drop event-level data.

> [!IMPORTANT]
> **Production Syncing:** Any time you deploy a new custom template to production, you MUST execute the SQL scripts below on your production PostgreSQL database instance.

### 2.1 The Registration SQL Script
We have provided a template script located at `register-custom-template.sql`. You can copy and execute this in pgAdmin or your production terminal:

```sql
-- 1. Create the Invite Record
INSERT INTO invites (id, user_id, template_id, code, status, created_at, updated_at) 
SELECT gen_random_uuid(), id, 'TEMPLATE_ID', 'SHORTCODE', 'PAID', now(), now() 
FROM users WHERE email = 'admin@inviteque.com'
ON CONFLICT (code) DO NOTHING;

-- 2. Create the Event Records (Add/Remove as needed)
-- The "name" field MUST EXACTLY match the "title" string in data.js
INSERT INTO wedding_events (id, wedding_id, name, event_date, event_time, created_at, updated_at)
SELECT gen_random_uuid(), i.id, 'Pooja', '13th Dec, 2026', '11:30 AM', now(), now()
FROM invites i WHERE i.code = 'SHORTCODE';

INSERT INTO wedding_events (id, wedding_id, name, event_date, event_time, created_at, updated_at)
SELECT gen_random_uuid(), i.id, 'Wedding', '20th Dec, 2026', '5:00 PM', now(), now()
FROM invites i WHERE i.code = 'SHORTCODE';
```

---

## 3. (Optional) Multi-Variant Link Setup
If a client requests multiple links that show/hide certain events (e.g., Link 1 = All events, Link 2 = Wedding only), you can dynamically parse the URL and filter the events in your template's `index.jsx`:

1. Add parameterized routes to `App.jsx`:
   `<Route path="/template/theme/client/:variant" element={<CustomTemplate />} />`
2. In the template, grab the parameter and filter the events array:
   ```javascript
   const { variant } = useParams();
   const filteredEvents = allEvents.filter(e => {
       if (variant === '2') return ['wedding'].includes(e.id);
       return true; // default all
   });
   ```
3. Pass `filteredEvents` down to your layout and to the `<InviteQRSVP events={filteredEvents} />` component. The RSVPs will seamlessly map back to the same backend tracking code.
