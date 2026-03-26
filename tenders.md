# Tenders Flow

This document explains the intended tender application flow once full authentication and role-based access are implemented.

## Current State (Hackathon MVP)

Public users can **browse and read** tenders without authentication. The tender listing page shows all open, closed, awarded, and cancelled tenders. Users can click through to view full details including descriptions, documents, addenda, contact information, and award results.

**No application submission** is currently supported — only read access.

## Intended Full Flow

### 1. Browse Tenders (Public)
- Any visitor can view the tenders listing at `/tenders`
- Filter by category, status, or search by keyword
- View tender details including reference number, dates, budget range

### 2. Register / Login
- To apply for a tender, the user must create an account and log in
- Registration captures: name, email, phone, company/organization details
- Email verification is required before proceeding

### 3. View Tender Details (Authenticated)
- Authenticated users see additional options: "Apply for this Tender" button
- Users can download tender documents (RFPs, terms of reference, etc.)
- Users can view any addenda or amendments published by BOCRA

### 4. Prepare Application
- User clicks "Apply" on an open tender
- A multi-step form is presented:
  - **Company Information**: Legal name, registration number, address, contact details
  - **Technical Proposal**: Description of approach, methodology, team qualifications
  - **Financial Proposal**: Itemized budget, pricing breakdown
  - **Supporting Documents**: Upload certificates, financial statements, references, compliance docs
- Application is saved as a **Draft** so the user can return and complete it later

### 5. Submit Application
- User reviews all sections and submits
- Application status changes from `DRAFT` to `SUBMITTED`
- User receives a confirmation email with a reference number
- Application is timestamped — must be submitted before the tender closing date

### 6. Application Review (Staff/Admin Side)
- BOCRA staff see submitted applications in the admin portal
- Applications can be moved through review stages:
  - `SUBMITTED` → `UNDER_REVIEW` → `SHORTLISTED` / `REJECTED`
- Staff can request additional information from applicants (`INFO_REQUESTED` status)
- Evaluation criteria and scoring are managed internally

### 7. Award
- Once evaluation is complete, BOCRA awards the tender
- Tender status changes to `AWARDED`
- Award details (awardee name, amount, date, summary) are published
- All applicants are notified of the outcome

### 8. Notifications
- Email notifications are sent at key stages:
  - Application received confirmation
  - Information requested
  - Tender awarded
  - Tender closing date reminders (7 days, 1 day before)

## API Endpoints (Backend Ready)

The backend already supports the following tender endpoints:

| Endpoint | Method | Description |
|---|---|---|
| `/api/v1/tenders/` | GET | List all public tenders |
| `/api/v1/tenders/{id}/` | GET | Tender detail |
| `/api/v1/tenders/categories/` | GET | List tender categories |
| `/api/v1/tenders/{id}/documents/{docId}/download/` | GET | Download tender document |
| `/api/v1/staff/tenders/` | GET/POST | Staff: list/create tenders |
| `/api/v1/staff/tenders/{id}/` | GET/PUT/DELETE | Staff: manage tender |
| `/api/v1/staff/tenders/{id}/documents/` | POST | Staff: upload document |
| `/api/v1/staff/tenders/{id}/addenda/` | POST | Staff: add addendum |
| `/api/v1/staff/tenders/{id}/award/` | POST | Staff: award tender |

## What Remains To Build

1. **User authentication on the frontend** (registration, login, profile)
2. **Tender application form** (multi-step with document uploads)
3. **Application dashboard** for users to track their submissions
4. **Role-based UI** showing "Apply" button only to authenticated users on open tenders
5. **Email notification integration** with the backend Celery tasks
