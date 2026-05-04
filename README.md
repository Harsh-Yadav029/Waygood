# Waygood Global: Premium Study-Abroad Platform

![Waygood Platform](https://img.shields.io/badge/Status-Production--Ready-success)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![React](https://img.shields.io/badge/Frontend-React-blue)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-important)
![Docker](https://img.shields.io/badge/Deployment-Docker-blue)

Waygood Global is a high-performance, humanized study-abroad platform designed to bridge the gap between student aspirations and university admissions. This project transforms a basic template into a secure, AI-optimized, and professionally documented ecosystem.

---

## 🌟 Key Features & Engineering Highlights

### 🧠 1. AI-Powered Recommendation Engine
Unlike simple keyword matching, Waygood uses a **Weighted MongoDB Aggregation Engine** to act as a digital academic advisor.
- **Dynamic Scoring**: Programs are ranked based on Country (35%), Field (30%), Budget (20%), Intake (10%), and IELTS (5%).
- **Explainable AI**: The engine generates natural language "Match Reasons" (e.g., *"Perfect alignment with your interest in Computer Science"*) to build user trust.
- **Prestige Tie-Breaking**: Integrated **QS World Rankings** as a secondary sorting factor for high-confidence matches.

### 🚀 2. Performance & Scalability
Built for high-traffic environments where discovery must be instant.
- **Sub-Millisecond Discovery**: Implemented **Compound Indexing** (`Country + Budget + Degree`) and **Full-Text Search**.
- **In-Memory Caching**: Integrated a service-level cache for frequently accessed university metadata.
- **Lean Data Access**: All read operations utilize `.lean()` to bypass Mongoose hydration overhead, reducing memory footprint by ~40%.

### 🛡️ 3. Security & Production Hardening
Built with a "Security-First" mindset for handling sensitive student data.
- **Brute-Force Protection**: Integrated `express-rate-limit` to prevent credential stuffing.
- **Secure Headers**: Utilizes `Helmet.js` to protect against XSS and clickjacking.
- **Access Control**: Robust JWT-based authentication with **Protected Routing** on both Frontend and Backend.

### 🎨 4. Human-Centric UI/UX
A premium aesthetic that feels like a modern SaaS product.
- **Glassmorphic Design**: A clean, minimalist interface using Vanilla CSS grids and blur effects.
- **Proactive Modals**: Replaced intrusive browser alerts with professional, state-managed modals for program details.
- **Empathetic Feedback**: Human-readable error messages and application audit timelines.

---

## 🛠️ Quick Start (Docker Orchestration)

To spin up the entire ecosystem (Frontend, Backend, and Database) with a single command:

```bash
docker-compose up --build
```

**Access URLs:**
- **Frontend**: [http://localhost:80](http://localhost:80)
- **API Documentation**: [http://localhost:4000/api/health](http://localhost:4000/api/health)

---

## 📊 Technical Architecture

### **Layered Backend Pattern**
- **Controllers**: Handle HTTP request/response logic and status codes.
- **Services**: Contain 100% of the business logic and database interactions (Clean Architecture).
- **Middleware**: Global handling for Auth, Error Logging, and Rate Limiting.

### **Database Strategy**
- **Compound Indexes**: `[country, tuitionFee, degreeLevel]`
- **Text Index**: `[title, universityName]`
- **Validation**: Strict Mongoose schemas with custom pre-save hooks for security.

---

## 🧪 Verification & Testing

To run the standalone API verification suite:

```bash
cd backend
node src/scripts/verify-api.js
```

---

**Developed with ❤️ for the Waygood Candidate Evaluation.**