# Crypto Risk Guardian AI — BTC RSI + 200 MA Trading Agent

> **Bitget Trading Infrastructure Hackathon Submission**

An autonomous Bitcoin trading agent that combines a momentum filter (200-day Moving Average) with a contrarian timing signal (RSI 14). It only buys oversold dips inside a confirmed uptrend and always defines its exit before it enters — a hard stop loss, a take-profit target, and a ratcheting trailing stop. Every trade risks no more than 2% of the account, and every decision is explained in plain English.

---
## Live Demo

Experience the BTC RSI + 200 MA Trading Agent here:

https://szcsaazb.mule.page/

This trading agent combines the Relative Strength Index (RSI) with the 200-period Moving Average (MA) to identify high-probability Bitcoin trading opportunities. The strategy follows the trend by only taking long positions when BTC trades above the 200 MA and uses RSI to detect potential entry points during momentum reversals.

Key Features:
- RSI-based entry signals
- 200 MA trend confirmation
- Automated trade logic
- Risk management rules
- Real-time market monitoring
- Transparent decision-making

The goal is to reduce emotional trading and provide a simple, disciplined, and data-driven approach to Bitcoin trading.

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [APIs Used](#apis-used)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Strategy Rules](#strategy-rules)
- [Backtest Performance](#backtest-performance)
- [Screenshots](#screenshots)
- [Future Roadmap](#future-roadmap)
- [Disclaimer](#disclaimer)

---

## Overview

| Field | Value |
|---|---|
| **Project Name** | Crypto Risk Guardian AI |
| **Hackathon Track** | Bitget Trading Infrastructure |
| **Symbol** | BTC/USDT |
| **Timeframe** | Daily candles |
| **Backtest Period** | 2023-09-14 → 2026-06-09 (1000 bars) |
| **Initial Balance** | $10,000 |
| **Risk per Trade** | 2% |
| **Stop Loss / Take Profit / Trailing** | 5% / 15% / 3% |

---

## Problem Statement

Retail crypto traders face three persistent problems:

1. **Emotional decision-making** — buying at tops, panic-selling at bottoms.
2. **No systematic risk management** — oversized positions, missing stops, no trailing exits.
3. **Information overload** — too many indicators, news feeds, and sentiment signals with no unified decision framework.

Existing trading bots are either too rigid (single-indicator grid bots) or too opaque (black-box ML models). Traders need a transparent, rule-based agent that combines technical analysis, market sentiment, and hard risk limits into a single explainable decision loop.

---

## Solution

Crypto Risk Guardian AI is a self-contained trading agent that runs a full perception → decision → execution → risk management loop:

1. **Perceive** — ingest OHLC data, compute RSI(14), MA(200), ATR(14), Fear & Greed Index, news sentiment.
2. **Decide** — apply the adaptive strategy rules (oversold + uptrend + sentiment confluence).
3. **Execute** — emit MARKET_BUY / MARKET_SELL with protective STOP_LOSS, TAKE_PROFIT, and trailing stop orders.
4. **Manage Risk** — check stop / TP / trailing fill on every bar; halt entries if drawdown > 7%; enforce 10-bar cooldown after losses.

The agent is exchange-agnostic. The current build ships with a paper broker (deterministic fills at the simulated price). Swapping in Bitget, Binance, or any CCXT-supported venue is a single adapter.

---

## Key Features

### Core Trading Engine
- **RSI(14) + MA(200) dual-filter strategy** — only buys oversold dips in confirmed uptrends
- **Adaptive RSI bands** — thresholds tighten in high-volatility regimes (ATR%-rank > 80th percentile)
- **Position sizing** — fixed 2% risk per trade with Kelly-compatible sizing
- **Triple exit system** — hard stop loss (5%), take profit (15%), ratcheting trailing stop (3%)
- **Drawdown circuit breaker** — halts new entries if drawdown exceeds 7%
- **Post-loss cooldown** — 10-bar pause after a losing trade

### Market Intelligence
- **Fear & Greed Index** — live confluence filter (blocks buys when F&G ≥ 60, boosts size 1.25× during Extreme Fear < 25)
- **News sentiment scoring** — 21 negative + 16 positive crypto-context keywords scored across 50 live headlines from CoinDesk, CoinTelegraph, Decrypt, BitcoinMagazine, TheBlock
- **Volatility regime detection** — ATR(14) percentile ranking classifies market as LOW / NORMAL / HIGH volatility

### Interactive Dashboard
- **Live signal card** — current BUY / SELL / HOLD with plain-English explanation
- **Real-time charts** — BTC price + MA200, RSI(14) with overbought/oversold bands, equity curve, F&G sparkline
- **AI chat agent** — deterministic intent-matching chatbot that answers questions about signals, risk, sentiment, backtest, trades
- **Agent controls** — live position-sizing calculator with adjustable balance, risk %, stop loss %, take profit %
- **Execution engine** — paper trading simulator with step/auto-run/pause/reset, order lifecycle log, and Bitget adapter stub

### Backtest Engine
- **Walk-forward simulation** — no look-ahead bias, bar-by-bar replay
- **Exit priority** — stop → take-profit → signal (worst-case ordering)
- **Full performance report** — total return, win rate, profit factor, expectancy, max drawdown, gross profit/loss

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML5, CSS3 (CSS Grid, CSS Variables), Vanilla JavaScript (ES6+) |
| **Charts** | Chart.js 4.4.1 |
| **Data Source** | Binance Spot API (BTCUSDT daily klines) |
| **Indicators** | RSI(14), SMA(200), ATR(14) — computed via pandas-ta |
| **Sentiment** | Custom keyword scorer (37 crypto-context keywords) |
| **Server** | Node.js + Express (static file server) |
| **Broker Interface** | Pluggable adapter pattern (PaperBroker → BitgetBroker) |

---

## APIs Used

| API | Purpose |
|---|---|
| **Binance Spot API** | BTCUSDT daily OHLCV klines (1000 bars) |
| **Alternative.me Fear & Greed Index** | Daily crypto market sentiment (0–100) |
| **CoinDesk RSS** | News headline ingestion |
| **CoinTelegraph RSS** | News headline ingestion |
| **Decrypt RSS** | News headline ingestion |
| **Bitcoin Magazine RSS** | News headline ingestion |
| **The Block RSS** | News headline ingestion |
| **Bitget API v2** | Trading infrastructure (adapter stub included) |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (index.html)                   │
│                                                           │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │ Perception   │  │ Decision     │  │ Execution      │  │
│  │ Engine       │──│ Engine       │──│ Engine         │  │
│  │ (RSI, MA,   │  │ (Strategy    │  │ (Paper/Broker  │  │
│  │  ATR, F&G,  │  │  Rules +     │  │  Adapter)      │  │
│  │  News)      │  │  Filters)    │  │                │  │
│  └─────────────┘  └──────────────┘  └────────────────┘  │
│         │                  │                    │         │
│         └──────────────────┴────────────────────┘         │
│                            │                              │
│                    ┌───────▼───────┐                      │
│                    │ Risk Manager  │                      │
│                    │ (DD breaker,  │                      │
│                    │  cooldown,    │                      │
│                    │  sizing)      │                      │
│                    └───────────────┘                      │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ Dashboard: Charts · Chat · Controls · Order Log     │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites
- Node.js 18+ (for the Express server)
- OR any static file server / direct browser open

### Install & Run

```bash
# Clone the repository
git clone https://github.com/your-org/crypto-risk-guardian-ai.git
cd crypto-risk-guardian-ai

# Install dependencies
npm install

# Start the server
npm start

# Open in browser
# http://localhost:3000
```

### Without Node.js

Simply open `index.html` in any modern browser. All data is embedded — no build step required.

---

## Usage

### Dashboard
1. **Signal Card** — shows the current BUY / SELL / HOLD signal with explanation
2. **Position Sizing** — auto-calculated based on 2% risk rule
3. **Headline Metrics** — total return, win rate, max drawdown, profit factor
4. **Market Intelligence** — Fear & Greed Index, news sentiment, adaptive RSI thresholds
5. **Charts** — BTC price + MA200, RSI(14), equity curve
6. **Trade History** — full backtest trade journal
7. **Decision Log** — plain-English reasoning for each bar

### Chat Agent
Type questions or use quick-action buttons:
- "Should I buy BTC?" — live trade decision
- "Explain current signal" — plain-English reasoning
- "Run backtest" — replay strategy on 1000 bars
- "Show risk analysis" — drawdown, sizing, R/R
- "Sentiment" — Fear & Greed analysis
- "News" — aggregated headline sentiment
- "Adaptive" — volatility regime + RSI bands
- "Trades" — closed-trade journal

### Execution Engine
1. Click **Step 1 bar** to advance one candle
2. Click **Auto-run** to replay all bars (select speed: Slow / Normal / Fast / Instant)
3. Watch the order lifecycle log for MARKET_BUY, STOP_LOSS, TAKE_PROFIT, TRAILING events
4. Click **Reset** to restart the simulation

### Agent Controls
Adjust balance, risk %, stop loss %, take profit % — the position-sizing calculator updates in real time.

---

## Strategy Rules

| Rule | Condition |
|---|---|
| **BUY (base)** | RSI(14) < 30 AND price > MA(200) AND MA200 rising |
| **BUY (high vol)** | RSI(14) < 25, size × 0.7 |
| **SELL** | RSI(14) > 70 (or 75 in high vol) |
| **Sentiment gate** | Block if F&G ≥ 60; boost 1.25× if F&G < 25 |
| **News filter** | Block if net polarity < −40%; reduce if < −15% |
| **Cooldown** | No new entry 10 bars after a loss |
| **DD guard** | Halt entries if drawdown > 7% |
| **Stop / TP / Trail** | 5% / 15% / 3% (tightened 30% in high vol) |

---

## Backtest Performance

| Metric | Value |
|---|---|
| Initial Balance | $10,000 |
| Final Equity | $9,880.58 |
| Total Return | −1.19% |
| Total Trades | 2 |
| Wins / Losses | 1W / 1L |
| Win Rate | 50.0% |
| Profit Factor | 0.41 |
| Expectancy / Trade | −$59.70 |
| Max Drawdown | −2.46% |
| Backtest Period | 2023-09-14 → 2026-06-09 |
| Bars | 1000 daily candles |

---

## Screenshots

Screenshots are located in the `screenshots/` folder:

- `01-dashboard-overview.png` — Full dashboard with signal card, metrics, and charts
- `02-market-intelligence.png` — Fear & Greed, news sentiment, adaptive thresholds
- `03-execution-engine.png` — Paper trading engine with order lifecycle log
- `04-chat-agent.png` — AI chat agent with quick-action buttons
- `05-trade-history.png` — Backtest trade journal and decision log

---

## Future Roadmap

### Phase 1 — Exchange Integration
- [ ] Bitget live trading adapter (REST + WebSocket)
- [ ] Multi-exchange support via CCXT (Binance, OKX, Bybit)
- [ ] API key management with encrypted vault

### Phase 2 — Advanced Strategies
- [ ] Multi-timeframe confirmation (4H + 1D)
- [ ] Volume-weighted RSI (VWAP confluence)
- [ ] Options-based hedging (protective puts)
- [ ] Cross-asset correlation filter (DXY, SPX, gold)

### Phase 3 — AI Enhancements
- [ ] LLM-powered natural language strategy builder
- [ ] Reinforcement learning for dynamic position sizing
- [ ] Anomaly detection for flash crash protection
- [ ] Personalized risk profiles based on user behavior

### Phase 4 — Infrastructure
- [ ] Real-time WebSocket data pipeline
- [ ] PostgreSQL trade journal with analytics
- [ ] Telegram / Discord alert bot
- [ ] Mobile-responsive PWA

---

## Disclaimer

This project is for **educational and research purposes only**. It is not investment advice. Past performance does not guarantee future results. Cryptocurrency trading involves substantial risk of loss. Never trade with money you cannot afford to lose.

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

**Built with MuleRun** · Bitget Trading Infrastructure Hackathon 2026
