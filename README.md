# ReFound

![Banner GitHub](https://i.imgur.com/t1e7imt.png)

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white" />
  <img src="https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Google_Maps-4285F4?style=for-the-badge&logo=googlemaps&logoColor=white" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
  <img src="https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" />
</p>

## Inspiration

Institutions often unknowingly contribute to the global waste crisis because lost or discarded goods lack a structured redistribution system. This systemic failure in circular consumption means that while institutions generate a high volume of reusable goods, they lack the necessary infrastructure to redirect them. **ReFound** addresses this problem by enabling institutions to convert lost goods into social value through an automated redistribution system, ensuring these items find a second life in local communities instead of ending up as waste.

## What It Does

### Flow 1: Donation Process (Donor)

**Goal:** Onboard items with automated consent for social redistribution.

1. **Trigger:** User scans QR code -> Redirect to `/donate`.

2. **Item Type Logic:**
   - `Small Item`: Description + Category text input.
   - `Big Item`: Requires `photo_front` and `photo_back` uploads.

3. **Consent:** Mandatory checkbox: `agreed_to_redistribution` (Boolean).
   - _Label:_ "I agree that if my item isn't claimed within 7 days, it will be donated to a local institution (orphanage/nursing home)."

4. **Auth:** Clerk `useUser()` hook to pull `fullName` and `primaryEmailAddress`.

5. **Success:** - Write to DB with `status: "AVAILABLE"`.
   - Trigger `issueReward()` (Digital badge/points).

### Flow 2: Claiming Process (Donee)

**Goal:** Peer-to-peer item matching with time-sensitive urgency.

1. **Discovery:** Browse Gallery where `status == "AVAILABLE"`.
   - **UI:** Countdown timer logic: `createdAt + 7 days`.

2. **Selection:** User clicks "Claim" -> Update `item.status` to `"CLAIMED"`.

3. **Fulfillment:** - `Delivery`: Input `shipping_address`.
   - `Pick-up Point`: Select from `predefined_locations` (e.g., "Canteen").

4. **Tracking:** User Dashboard displays: `Pending` -> `Ready for Pick-up` -> `Received`.

### Flow 3: Administrative Redistribution (Admin)

**Goal:** Automated management of stale inventory via Geolocation.

1. **Expiry Logic:** Cron job identifies items where `status == "AVAILABLE"` AND `age > 7 days`.
   - Action: Update to `status: "EXPIRED"`.

2. **Admin Guard:** Route `/admin` restricted to `user.publicMetadata.role === "admin"`.

3. **Geolocation Feature:**
   - **API:** Google Places `nearbySearch` (types: `orphanage`, `nursing_home`).
   - **UI:** Interactive Map with pins.

4. **Action:** Click pin -> View `name`, `address`, `formatted_phone_number`.

5. **Assignment:** - Admin selects expired items -> Clicks "Assign to [Institution Name]".
   - Update `item.status` to `"REDIRECTED"`.

6. **Notification:** Trigger automated email to donor: _"Your item has found a new home at [Institution Name]!"_

7. **Finalization:** Admin marks as `"COMPLETED"` once batch is dispatched.

## What's Next for ReFound

- **Enhanced IoT Camera**: Upgrade the camera module to replace the current low-quality optics.
- **Upgraded Donation Bin**: Increase the physical capacity of the bin to accommodate a larger volume of items.
- **Protective Enclosures**: Design and build durable housing for the camera and servo to ensure weather resistance and durability.
- **Improved Security**: Implement anti-vandalism and anti-theft measures to protect the physical bin and its electronic components.
- **Robust Backend Infrastructure**: Scale the backend system to efficiently handle high-resolution image data and increased user traffic.
