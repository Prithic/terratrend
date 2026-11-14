# Contributing to TerraTrend

Thank you for your interest in contributing to **TerraTrend**, developed by CODEVERSE for the **2026 NASA Space Apps Challenge** ("Be an Earth System Trend Detective").

We welcome scientific contributions, UI enhancements, and new Earth-science data pipeline connectors.

---

## Code of Conduct

We are dedicated to providing a collaborative, scientifically rigorous, and inclusive environment. Please treat all contributors and researchers with respect.

---

## Development Workflow

### 1. Prerequisites
- **Python 3.10+** (Python 3.11 recommended)
- **Node.js 18+** (Node.js 20+ recommended)
- **Git**

### 2. Local Setup
```bash
# Clone the repository
git clone https://github.com/codeverse/terratrend.git
cd terratrend

# Backend setup
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate
pip install -r requirements.txt

# Frontend setup
cd ../frontend
npm install
```

### 3. Running Services Locally
```bash
# Terminal 1: Backend
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

# Terminal 2: Frontend
cd frontend
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## Scientific Rigor & Contribution Standards

1. **No Synthetic Demonstration Data:** Never substitute synthetic or fabricated figures in the core analytical workflow. All historical Earth observations must trace back to authenticated NASA endpoints or published open scientific sources.
2. **Statistical Soundness:** Any proposed statistical additions (e.g., Pettitt change-point test, Seasonal Mann-Kendall) must include unit tests verified against published analytical test vectors or standard R/Python packages.
3. **Automated Testing:** All PRs must pass the test suite:
   ```bash
   # From root:
   $env:PYTHONPATH="backend"   # Windows Powershell
   python -m pytest backend/tests -v
   cd frontend && npm run build
   ```
4. **Clean Commits:** Write clear, conventional commit messages (`feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`).
5. **No Secrets:** Never commit `.env` files, API credentials, or large local cache bundles.

---

## Pull Request Process

1. Fork the repo and create your branch from `master` (`git checkout -b feature/your-feature-name`).
2. Implement your changes with accompanying tests and documentation.
3. Verify that tests pass and the frontend build succeeds.
4. Submit a Pull Request describing your changes, motivation, and verification steps.
