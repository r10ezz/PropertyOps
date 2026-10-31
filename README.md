# PropertyOps — Multi-Tenant Property Management SaaS

PropertyOps is a production-grade property management application designed for real estate operators, property managers, and residents. It streamlines property & unit tracking, resident lease management, and maintenance ticket workflows with organization-level multi-tenancy and role-based access control (RBAC).

---

## 🛠️ Tech Stack

- **Backend:** Node.js, [AdonisJS v6](https://adonisjs.com) (TypeScript)
- **ORM & Migrations:** [Lucid ORM](https://lucid.adonisjs.com)
- **Validation:** [VineJS](https://vinejs.dev)
- **Database:** PostgreSQL (v18+)
- **Frontend:** React 19, TypeScript, [Vite](https://vite.dev)
- **Styling:** Tailwind CSS (Custom SaaS Design System)
- **Icons:** Lucide React

---

## 🏗️ Architecture & Multi-Tenancy

- **Row-Level Organization Isolation:** Every core entity (`users`, `properties`, `residents`, `maintenance_requests`) belongs to an `organization_id`. All queries are scoped to the authenticated tenant.
- **Role-Based Access Control (RBAC):**
  - **Admin:** Full organization management, property deletion, staff assignments.
  - **Property Manager:** Daily operational CRUD for properties, units, leases, and maintenance workflows.
  - **Resident:** Self-service portal to submit and track maintenance requests for their unit.
- **Modular Monorepo Structure:**
  - `backend/`: AdonisJS v6 REST API
  - `frontend/`: React SPA

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v22+)
- PostgreSQL (v14+) running locally on port `5432`

### 1. Database Setup
Create the local development database:
```sql
CREATE DATABASE propertyops_dev;
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Ensure DB credentials in .env match your local PostgreSQL
node ace migration:run
npm run dev
```
Backend API will start at `http://localhost:3333`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend development server will start at `http://localhost:5173`.

---

## 📋 Implementation Roadmap

- [x] **Phase 1: Planning and Setup** (Architecture, schema design, dual-app setup, PostgreSQL connection)
- [x] **Phase 2: Database and Backend Foundation** (Organizations, Properties & Units schema, seeders, CRUD APIs)
- [x] **Phase 3: Frontend Foundation** (App layout, Sidebar, Dashboard metrics, Property/Unit views)
- [x] **Phase 4: Authentication & Authorization** (Access tokens, Tenant isolation middleware, RBAC guards)
- [ ] **Phase 5: Residents & Maintenance Management** (Lease rosters, interactive ticket Kanban, status workflows)
- [ ] **Phase 6: Testing & Polish** (API integration tests, loading skeletons, error boundaries, empty states)
- [ ] **Phase 7: Final Review & Interview Prep** (Walkthrough, trade-off analysis, portfolio documentation)
