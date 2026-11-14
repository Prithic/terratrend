# Security Policy for TerraTrend

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

---

## Reporting a Vulnerability

Security and data integrity are top priorities for TerraTrend.

If you discover a security vulnerability or credential leak within this repository, please do **NOT** disclose it publicly via GitHub Issues.

Instead, please submit a confidential vulnerability report to:
- **Project Lead:** CODEVERSE Core Engineering
- **Email:** `security@codeverse-terratrend.org` (or directly via private repository security advisory)

Please include:
- A description of the vulnerability.
- Steps to reproduce or proof-of-concept.
- Potential impact on services or data.

We will acknowledge receipt within 48 hours and work with you to remediate the issue promptly.

---

## Secret Management

- This repository uses environment variables for all environment-specific configurations.
- `.env` files and API cache artifacts are strictly ignored via `.gitignore`.
- If an API token or private key is accidentally committed, it must be revoked and rotated immediately.
