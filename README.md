# NextTrack_AI_Project
# AI Proposal Generator – Phase 2

## Features
- React/Vite project workspace and proposal history
- Express + MySQL project and proposal persistence
- Optional Gemini proposal drafting with template fallback
- PDF, DOCX, XLSX/XLS, CSV and TXT text extraction
- Editable proposal sections
- DOCX and PDF export

## Setup
1. MySQL Workbench: run `database/schema.sql`. If you already have the original tables, run the CREATE TABLE statement for `project_documents` and the proposals updated_at ALTER statement in the schema file.
2. Backend: `cd backend`, copy `.env.example` to `.env`, set your MySQL credentials and port (your setup uses 3307), then run `npm install` and `npm run dev`.
3. Frontend in a second terminal: `cd frontend`, run `npm install` and `npm run dev`. Open http://localhost:5173.
4. Optional AI: add a valid Gemini API key to `backend/.env` as `GEMINI_API_KEY=...`, then restart backend. Without it, template mode works.

## API
- GET `/api/health`
- GET/POST `/api/projects`
- GET `/api/projects/:id`
- POST `/api/projects/:id/documents` (multipart field `documents`)
- GET `/api/projects/:id/documents`
- POST `/api/proposals/generate`
- GET `/api/proposals`, GET `/api/proposals/:id`, PUT `/api/proposals/:id`
- GET `/api/proposals/:id/export/docx` and `/pdf`

## Notes
- Text extraction works for text-based PDFs. Scanned PDFs need OCR and are not processed in this version.
- Extracted document text is retained in MySQL. Do not upload confidential documents unless you are authorized.
- Gemini receives project fields and extracted document text when enabled.
- AI output is a draft. Verify all technical and commercial information before issuing.
- BOQ pricing engine, OCR, authentication/roles, antivirus scanning and production deployment are planned next, not included in this build.
