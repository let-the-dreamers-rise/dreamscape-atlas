<p align="center">
  <img src="https://img.shields.io/badge/🧠_DreamOS-Cognitive_Architecture-blueviolet?style=for-the-badge&labelColor=1a1a2e" />
  <img src="https://img.shields.io/badge/PL__Genesis-Neurotech_%26_BCI_Track-blue?style=for-the-badge&labelColor=16213e" />
  <img src="https://img.shields.io/badge/Stack-React_•_Supabase_•_Gemini-00b894?style=for-the-badge&labelColor=0d1117" />
  <br/>
  <img src="https://img.shields.io/badge/Storacha-Filecoin_Storage-0099ff?style=for-the-badge&labelColor=0d1117" />
  <img src="https://img.shields.io/badge/Lit_Protocol-Encryption-8B5CF6?style=for-the-badge&labelColor=0d1117" />
  <img src="https://img.shields.io/badge/NEAR-Blockchain_Attestation-00C08B?style=for-the-badge&labelColor=0d1117" />
  <img src="https://img.shields.io/badge/Impulse_AI-ML_Inference-FF6B6B?style=for-the-badge&labelColor=0d1117" />
</p>

<h1 align="center">🧠 DreamOS</h1>
<h3 align="center">Neuro-Inspired Cognitive Architecture for Dream Intelligence</h3>

<p align="center">
  <em>A dream operating system that models hippocampal memory consolidation, enforces neural data sovereignty, and builds collective intelligence from human dream patterns — without centralized data collection.</em>
</p>

<p align="center">
  <a href="#-architecture"><strong>📐 Architecture</strong></a> &nbsp;·&nbsp;
  <a href="#-three-pillars"><strong>🧬 Three Pillars</strong></a>
</p>

<br/>

---

## 🎯 The Problem

> Current dream journaling apps treat dreams as isolated text entries. They miss a fundamental neuroscience insight: **the brain doesn't store dreams as discrete events — it consolidates them through hippocampal replay, forming associative memory clusters during sleep.**

Meanwhile, brain-computer interfaces collect intimate cognitive data without meaningful consent frameworks. Users have **no cognitive liberty** — no right to control, export, or delete their own neural data.

**DreamOS solves both.**

---

## 🧬 Three Pillars

### 1️⃣ Hippocampal Memory Consolidation Engine

**Neuroscience basis:** During sleep, the hippocampus replays recent experiences, strengthening shared neural patterns. This process — *memory consolidation* — transforms fragile short-term memories into stable long-term representations via **synaptic potentiation** (Hebb's rule: *"neurons that fire together wire together"*).

**Our algorithm:**

| Step | Process | Neuroscience Analogy |
|------|---------|---------------------|
| **1** | Build symbol co-occurrence matrix | Neurons co-activating during hippocampal replay |
| **2** | Graph-based clustering via BFS (threshold ≥ 2) | Synaptic potentiation forming memory traces |
| **3** | Consolidation strength scoring | Long-Term Potentiation (LTP) — more repetition = stronger encoding |
| **4** | Stage classification (Emerging → Deep Memory) | Sleep stage progression in memory formation |

```
strength = min(1, (dreamCount / totalDreams) × (symbolCount / 3))

Stages:
  Emerging      (< 0.3)  — Nascent pattern detected
  Encoding      (0.3–0.5) — Neural pathways forming
  Consolidating (0.5–0.7) — Active hippocampal replay
  Deep Memory   (≥ 0.7)  — Fully consolidated long-term memory
```

### 2️⃣ Neural Data Sovereignty Framework

**Principle:** Users must have the right to control what happens with their intimate cognitive data.

| Capability | Implementation | Enforced? |
|---|---|:---:|
| **Granular consent** | 4 independent toggles: AI Analysis, Image Gen, Pattern Detection, Cluster Formation | ✅ |
| **Immutable audit trail** | Every consent change logged to `data_consent_log` | ✅ |
| **Full data portability** | One-click JSON export of all data | ✅ |
| **Permanent deletion** | Cascade delete all user data (irreversible, logged) | ✅ |

> Consent is **enforced at the edge function level** — not cosmetic. If AI analysis consent is revoked, the analysis pipeline returns a minimal response.

### 3️⃣ Collective Intelligence Layer

Privacy-preserving aggregation of **anonymous** symbol frequencies and emotion correlations — a "collective unconscious" mapped to Jungian archetypes. **No individual data is ever exposed.**

---

## 📐 Architecture

```
┌───────────────────────────────────────────────────────────┐
│                    DreamOS Architecture                    │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────┐    ┌──────────────┐    ┌─────────────┐  │
│  │   Dream      │    │  Hippocampal  │    │  Neural     │  │
│  │   Capture    │───▶│  Consolidation│───▶│  Atlas      │  │
│  │   + AI       │    │  Engine       │    │  (Graph)    │  │
│  └─────────────┘    └──────────────┘    └─────────────┘  │
│        │                    │                    │         │
│        ▼                    ▼                    ▼         │
│  ┌─────────────┐    ┌──────────────┐    ┌─────────────┐  │
│  │  Consent     │    │  Memory      │    │  Collective │  │
│  │  Gateway     │◀──│  Clusters    │───▶│  Intelligence│ │
│  │  (enforced)  │    │  (scored)    │    │  (anonymous) │ │
│  └─────────────┘    └──────────────┘    └─────────────┘  │
│                                                           │
│  ┌───────────────────────────────────────────────────┐   │
│  │        Neural Data Sovereignty Layer               │   │
│  │  Consent Controls │ Audit Trail │ Export │ Delete   │   │
│  └───────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────┘
```

---

## 🛡️ Security Model

| Layer | Mechanism |
|-------|-----------|
| **Row-Level Security** | Every table enforces `auth.uid() = user_id` |
| **Consent enforcement** | Edge functions validate consent before processing |
| **Audit trail** | Append-only — no UPDATE/DELETE allowed via RLS |
| **JWT validation** | All AI pipeline calls require valid auth tokens |

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 · TypeScript · Vite |
| **Styling** | Tailwind CSS · Custom design tokens · Framer Motion |
| **Visualization** | React Flow (@xyflow/react) · Recharts |
| **Backend** | Supabase (Postgres · Auth · Edge Functions · RLS) |
| **AI** | Google Gemini · Impulse AI |
| **Storage** | Storacha (IPFS/Filecoin) |
| **Encryption** | Lit Protocol (Threshold Cryptography) |
| **Blockchain** | NEAR Protocol (Attestation Layer) |

---

## 🔗 Sponsor Bounty Integrations

DreamOS integrates **all four** sponsor APIs as core infrastructure — not bolted-on features.

### 1. Storacha / Filecoin — Decentralized Neural Data Storage
**Edge Function:** `storacha-store`  
**Page:** `/sovereignty` → "Store on Filecoin" button

- Exports user dream data as a content-addressed JSON bundle to IPFS/Filecoin via Storacha's w3up HTTP Bridge
- Each export includes a sovereignty manifest (owner ID, rights declaration, encryption status)
- Returns a CID for permanent, censorship-resistant retrieval
- Logged to immutable consent audit trail

### 2. Lit Protocol — Programmable Encryption for Cognitive Data
**Edge Function:** `lit-encrypt`  
**Page:** `/sovereignty` → "Encrypt with Lit Protocol" button

- Encrypts dream data using AES-256-GCM with Lit Protocol's threshold key management (Datil Network)
- Programmable access control conditions — only the dream owner can decrypt
- Implements true neural data sovereignty: encryption at the application layer, not just server ACLs
- Composable with Storacha: encrypt first, then store on Filecoin

### 3. NEAR Protocol — On-Chain Collective Intelligence Attestation
**Edge Function:** `near-attestation`  
**Page:** `/collective` → "Store Hash On-Chain" button

- Computes SHA-256 hash of collective pattern data (anonymous aggregates only)
- Stores attestation hash on NEAR Testnet — immutable proof of data integrity
- No individual dream data touches the blockchain — only aggregate pattern hashes
- Creates verifiable, trust-minimized record of humanity's collective dream archetypes

### 4. Impulse AI — Autonomous ML for Dream Cognition
**Edge Function:** `impulse-analyze`  
**Page:** `/capture` (called during dream submission)

- Jungian archetype classification (Hero, Shadow, Anima/Animus, Self, etc.)
- Continuous emotional valence scoring (−1.0 to +1.0)
- Memory consolidation likelihood prediction (0.0 to 1.0)
- 128-dimensional dream vector embeddings for cross-cultural symbol mapping

---

## 🚀 Demo Flow

| Step | Page | What to See |
|------|------|-------------|
| 1 | [`/landing`] | Architecture pitch & algorithm deep-dive |
| 2 | [`/`](https://dreamscape-atlas.vercel.app) | Dashboard with dream stats |
| 3 | `/clusters` | Hippocampal consolidation in action |
| 4 | `/atlas` | Interactive symbol graph visualization |
| 5 | `/sovereignty` | Toggle consent off → verify enforcement |
| 6 | `/collective` | Anonymous aggregate patterns |
| 7 | `/capture` | Record a dream → AI analysis → new clusters |

---

## 📚 References

- Buzsáki, G. (2015). *Hippocampal sharp wave-ripple.* Hippocampus, 25(10).
- Hebb, D.O. (1949). *The Organization of Behavior.* Wiley.
- Ienca, M. & Andorno, R. (2017). *Towards new human rights in the age of neuroscience.* Life Sciences, Society and Policy.
- Jung, C.G. (1968). *The Archetypes and the Collective Unconscious.* Princeton.
- Walker, M.P. & Stickgold, R. (2004). *Sleep-dependent learning and memory consolidation.* Neuron.

---

<p align="center">
  <strong>Built for PL_Genesis: Frontiers of Collaboration — Neurotech & BCI Track</strong>
  <br/><br/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />
</p>
