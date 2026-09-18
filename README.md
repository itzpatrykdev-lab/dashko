# Dashko

**Vehicle ownership, organized.**

Dashko is a personal vehicle-management dashboard for keeping a garage organized in one place. It helps drivers track vehicles, review maintenance activity, log service work, and stay aware of what needs attention.

## Features

- Email/password authentication with Supabase Auth
- Add and manage vehicles in a personal garage
- Dedicated **Vehicles** tab for browsing and managing saved vehicles
- Dashboard overview for the currently selected vehicle
- Service-record logging
- Vehicle-specific service history
- Maintenance and upcoming-service visibility
- Empty states for new users with no vehicles
- Responsive dashboard layout
- Collapsible sidebar navigation
- Protected, user-scoped data through Supabase Row Level Security

## Tech Stack

| Area           | Technology              |
| -------------- | ----------------------- |
| Frontend       | React + TypeScript      |
| Build tool     | Vite                    |
| Styling        | Tailwind CSS            |
| Backend        | Supabase                |
| Authentication | Supabase Auth           |
| Database       | PostgreSQL via Supabase |
| Icons          | Lucide React            |

## Getting Started

### Prerequisites

Install the following before running the app locally:

- Node.js 18 or newer
- npm
- A Supabase project

### Installation

Clone the repository:

```bash
git clone [https://github.com/itzpatrykdev-lab/dashko.git](https://github.com/itzpatrykdev-lab/dashko.git)
cd dashko
```

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

If you are using Windows PowerShell and do not have `cp` available:

```powershell
Copy-Item .env.example .env.local
```

Add your Supabase values to `.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Start the development server:

```bash
npm run dev
```

Open the local URL shown by Vite, typically `http://localhost:5173`.

## Environment Variables

Dashko uses Vite environment variables for its Supabase browser client.

| Variable                 | Description                        |
| ------------------------ | ---------------------------------- |
| `VITE_SUPABASE_URL`      | Your Supabase project URL          |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase public anonymous key |

Never commit `.env.local`, private database credentials, or a Supabase `service_role` key. The service-role key bypasses Row Level Security and must never be exposed in browser code.

## Database

The application currently uses Supabase tables for vehicle and service-record data.

### `vehicles`

Each vehicle belongs to the authenticated user.

Common fields include:

```text
id
user_id
year
make
model
trim
vin
license_plate
mileage
created_at
```

### `service_records`

Each service record is associated with a vehicle and its owner.

Common fields include:

```text
id
vehicle_id
user_id
service_type
service_date
mileage
cost
notes
created_at
```

Enable Row Level Security on application tables and create policies that limit reads and writes to the authenticated owner:

```sql
auth.uid() = user_id
```

## Available Commands

| Command           | Description                           |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Starts the Vite development server    |
| `npm run build`   | Creates a production build            |
| `npm run preview` | Previews the production build locally |
| `npm run lint`    | Runs ESLint                           |

## Project Structure

```text
src/
├── components/
│   └── ui/
│       ├── Modal.tsx
│       └── SectionHeader.tsx
├── features/
│   └── garage/
│       └── components/
│           ├── AddServiceRecord.tsx
│           ├── AddVehicle.tsx
│           ├── GarageDashboard.tsx
│           ├── ServiceHistory.tsx
│           └── VehicleList.tsx
├── lib/
│   └── supabaseClient.ts
├── types/
│   ├── serviceRecord.ts
│   └── vehicle.ts
├── App.tsx
├── Auth.tsx
├── DashboardLayout.tsx
└── Sidebar.tsx
```

## Roadmap

- [x] Authentication and session handling
- [x] Vehicle management
- [x] Service-record logging
- [x] Dashboard and vehicle navigation
- [ ] Dedicated full service-history page
- [ ] Maintenance reminders and due-soon calculations
- [ ] Vehicle editing and deletion confirmation
- [ ] Fuel logging
- [ ] Expense tracking
- [ ] Reports and ownership-cost insights
- [ ] Vehicle photo uploads
- [ ] Mobile navigation improvements

## Security Notes

- `.env.local` is intentionally excluded from Git.
- Only use the Supabase anonymous key in the frontend.
- Do not expose a `service_role` key in client code.
- Enforce user ownership in Supabase with Row Level Security policies.
- Validate user input before writing it to the database.

## License

This project is currently private to its owner. Add a license file before distributing or accepting outside contributions.
