# ☕ STARLA Intelligence Platform

## Starbucks EMEA RTD Market Analytics
**Powered by OptiaData**

A multi-agent AI platform for analyzing Starbucks Ready-to-Drink (RTD) market data across EMEA markets.

---

## 🚀 Features

### Multi-Agent Intelligence System
| Agent | Role | Icon |
|-------|------|------|
| **Data Analyst** | Accurate numerical data retrieval | 📊 |
| **Competitive Intelligence** | Monster, Red Bull, Costa analysis | ⚔️ |
| **Market Analyst** | Trends, channels, opportunities | 📈 |
| **Sr Data Scientist** | Validates accuracy & statistics | 🔬 |
| **McKinsey Expert Partner** | Strategic validation & framing | 💼 |

### Anti-Hallucination Guarantees
- ✅ All data grounded in STARLA PDF reports
- ✅ Dual validation (Data Scientist + McKinsey)
- ✅ Confidence scoring on every insight
- ✅ Explicit "I don't know" when data unavailable
- ✅ Source citations for all metrics

### Dashboard Capabilities
- 🌍 Country & period selection (18 EMEA markets)
- 💬 Natural language Q&A interface
- ⚡ Auto-generated actionable insights
- 🎯 Strategic recommendations with validation
- 📊 Real-time agent workflow visualization

---

## 📦 Quick Start

### 1. Install Dependencies
```bash
cd starla-platform
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env and add your OpenAI API key
```

### 3. Start the Platform
```bash
npm start
```

### 4. Open Dashboard
Navigate to: **http://localhost:3000**

---

## 🔑 API Endpoints

### Ask a Question
```http
POST /api/ask
Content-Type: application/json

{
    "question": "What is our market share in Germany?",
    "country": "germany",
    "period": "p7-2025"
}
```

### Get Insights
```http
GET /api/insights/:country/:period
```

### Get Available Data
```http
GET /api/data/countries
GET /api/data/periods
```

---

## 📊 Data Sources

The platform analyzes **82 STARLA RTD PDF reports** covering:

| Period | Year | Markets |
|--------|------|---------|
| P11-P13 | 2024 | 18 EMEA |
| P1-P7 | 2025 | 18 EMEA |

### Covered Markets
Germany, UK, Italy, Spain, Netherlands, Poland, Sweden, Austria, Switzerland, Denmark, Norway, Greece, Croatia, Turkey, UAE, Saudi Arabia

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    STARLA Dashboard                     │
│         (Country Selector, Q&A, Insights, Recs)         │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                   Orchestrator Agent                     │
│              (Routes questions, synthesizes)             │
└────────────────────────┬────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│ Data Analyst  │ │ Competitive   │ │ Market        │
│ Agent 📊      │ │ Intel ⚔️      │ │ Analyst 📈    │
└───────┬───────┘ └───────┬───────┘ └───────┬───────┘
        └─────────────────┼─────────────────┘
                          ▼
        ┌─────────────────────────────────┐
        │   Sr Data Scientist Validator   │
        │            🔬                   │
        └─────────────────┬───────────────┘
                          ▼
        ┌─────────────────────────────────┐
        │   McKinsey Expert Validator     │
        │            💼                   │
        └─────────────────────────────────┘
```

---

## 🤖 Agent Personas

### Senior Data Scientist Validator
> *"You are a Senior Data Scientist at Starbucks with 15 years of retail analytics experience. Your job is to validate insights from other analysts - check mathematical accuracy, identify statistical significance, flag data quality issues, and rate confidence levels."*

### McKinsey Expert Partner
> *"You are a Senior Partner at McKinsey & Company, leading the Consumer Goods practice. You ensure recommendations are actionable, quantified, prioritized, and defensible for C-suite presentation."*

---

## 📋 Sample Questions

| Type | Question |
|------|----------|
| **Data** | "What is our market share in Germany P7 2025?" |
| **Competitive** | "How is Monster performing vs last period?" |
| **Trend** | "What's the growth trend in convenience channel?" |
| **Strategy** | "Where should we focus our investment?" |
| **Compare** | "Compare UK and Germany RTD performance" |

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express
- **AI**: OpenAI GPT-4 / GPT-4 Vision
- **PDF Processing**: pdf-parse, GPT-4 Vision
- **Styling**: Custom CSS (Starbucks brand guidelines)

---

## 📝 License

© 2025 OptiaData. All rights reserved.
Built for Starbucks EMEA RTD Analytics.
