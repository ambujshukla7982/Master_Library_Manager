# Library Management System: Full Architecture Report

## 1. Executive Summary
The Library Management System (LMS) is a full-featured, enterprise-grade application designed to automate library operations. It provides a robust backend built with **Spring Boot 3** and **Java 24**, and a modern, interactive frontend using **React 19** and **Vite**. The system supports Role-Based Access Control (RBAC), fine management, automated seat booking, reading goals, and comprehensive analytics.

---

## 2. Technology Stack

### Backend Architecture
- **Framework**: Spring Boot 3.4.5
- **Language**: Java 24 (JDK 24)
- **Security**: Spring Security with JWT (JSON Web Token) and Refresh Tokens.
- **Data Access**: Spring Data JPA with support for MySQL, H2, and PostgreSQL.
- **Documentation**: OpenAPI/Swagger.
- **Utility**: Lombok (boilerplate reduction), MapStruct (object mapping), Apache POI (Excel reports), iText (PDF reports).

### Frontend Architecture
- **Framework**: React 19
- **Build Tool**: Vite 7
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4, Radix UI (Primitives), Framer Motion (Animations).
- **Data Fetching**: TanStack React Query 5.
- **Routing**: Wouter.
- **UI Architecture**: Component-based with shared libraries.

### Workspace Management
- **Tool**: PNPM Workspaces with `catalog:` dependency management.
- **Repository Pattern**: Monorepo containing frontend, backend, and shared libraries (`lib/`).

---

## 3. Directory Structure Map

```text
.
├── frontend/                 # React Frontend Application
│   ├── src/
│   │   ├── components/       # Reusable UI Components
│   │   ├── hooks/            # Custom React Hooks
│   │   ├── pages/            # Page-level Components (Login, Dashboard, etc.)
│   │   └── lib/              # Client-side utility functions
│   └── vite.config.ts        # Vite configuration with Backend Proxy
├── lms-backend/              # Spring Boot Backend Application
│   ├── src/main/java/com/lms/
│   │   ├── config/           # Application Configuration (Security, Web, etc.)
│   │   ├── controller/       # REST API Endpoints
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── model/            # JPA Entities (Database Models)
│   │   ├── repository/       # Data Access Layer
│   │   ├── security/         # JWT and Auth Logic
│   │   └── service/          # Core Business Logic (18 Services)
│   └── src/main/resources/
│       └── application.yml   # Backend configuration (DB, JWT, Mail)
├── lib/                      # Shared Workspace Libraries
│   ├── api-client-react/     # Generated/Shared API Client
│   ├── api-spec/             # OpenAPI Specifications (openapi.yaml)
│   ├── api-zod/              # Zod Schemas for Validation
│   └── db/                   # Database-related shared logic
├── attached_assets/          # Static assets/images for the frontend
├── scripts/                  # Workspace utility scripts
├── start-all.bat             # Unified Windows startup script
├── pnpm-workspace.yaml       # Workspace package definitions
└── tsconfig.base.json        # Shared TypeScript configuration
```

---

## 4. Core Features & Business Logic

### A. Authentication & Security
- **JWT Authentication**: Secure, stateless auth using JWTs.
- **RBAC**: Roles including ADMIN, LIBRARIAN, STUDENT, and MEMBER.
- **Audit Logging**: Every sensitive action is recorded in the `AuditLog` entity.

### B. Catalog & Inventory
- **Book Management**: Title, ISBN, Author, Category, and Inventory tracking.
- **Book Copies**: Individual tracking of book units for loans.
- **Reviews & Ratings**: User-contributed feedback for catalog items.

### C. Borrowing Lifecycle
- **Loans**: Checkout, Renewal, and Return logic with automated due-date calculation.
- **Reservations**: Queue system for high-demand items with automated expiry.
- **Fines**: Automatic fine calculation for overdue items via `ScheduledTaskService`.

### D. User Engagement
- **Reading Goals**: Users can set annual or monthly reading targets.
- **Recommendations**: Intelligent book suggestions based on user history.
- **Notifications**: Email reminders for due dates and reservation updates.

### E. Facility Management
- **Reading Rooms**: Physical room management within the library.
- **Seat Booking**: Time-slotted reservation system for study spaces.

### F. Analytics & Reporting
- **Dashboards**: Real-time stats for admins and users.
- **Export**: Generate Excel and PDF reports for loans, users, and fines.

---

## 5. Detailed File Inventory (Key Files)

### Backend Packages (`com.lms`)
- **Controllers**: `AuthController`, `BookController`, `LoanController`, `SeatBookingController`, etc.
- **Services**: `LoanService` (Managed checkout/return), `FineService` (Calculates penalties), `EmailService` (Sends notifications).
- **Models**: `Book.java`, `User.java`, `Loan.java`, `Fine.java`, `AuditLog.java`.

### Frontend Pages (`frontend/src/pages`)
- `dashboard.tsx`: Main user/admin overview.
- `books.tsx`: Searchable book catalog.
- `seat-booking.tsx`: Interactive seat selection UI.
- `analytics.tsx`: Visual charts and reports.

---

## 6. Startup & Integration Flow
1. **Frontend Proxy**: Vite proxies `/api` requests to `http://localhost:8080/api`.
2. **Backend**: Spring Boot listens on port `8080` with context path `/api`.
3. **Database**: Spring Boot initializes the schema (H2 or MySQL) on startup based on the active profile.
