<p align="center">
  <img src="https://img.shields.io/badge/PL__Genesis-Neurotech%20%26%20BCI-blueviolet?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Track-Frontiers%20of%20Collaboration-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Stack-React%20%2B%20Supabase%20%2B%20Gemini-green?style=for-the-badge" />
</p>

<h1 align="center">🧠 DreamOS — Neuro-Inspired Cognitive Architecture</h1>

<p align="center">
  <strong>A dream operating system that models hippocampal memory consolidation, enforces neural data sovereignty, and builds collective intelligence from human dream patterns — without centralized data collection.</strong>
</p>

<p align="center">
  <a href="https://somnia-atlas.lovable.app/landing">🔗 Live Demo</a> · 
  <a href="https://somnia-atlas.lovable.app">🧠 Enter DreamOS</a>
</p>

---

## 🎯 Problem Statement

Current dream journaling apps treat dreams as isolated text entries. They miss the fundamental insight from neuroscience: **the brain doesn't store dreams as discrete events — it consolidates them through hippocampal replay, forming associative memory clusters during sleep.**

Meanwhile, brain-computer interfaces and neurotech platforms collect intimate cognitive data without meaningful consent frameworks. Users have no cognitive liberty — no right to control, export, or delete their own neural data.

**DreamOS solves both problems.**

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    DreamOS Architecture                   │
├─────────────────────────────────────────────────────────┤
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
└─────────────────────────────────────────────────────────┘
```

---

## 🧬 Three Pillars

### 1. Hippocampal Memory Consolidation Engine

**Neuroscience basis:** During sleep, the hippocampus replays recent experiences, strengthening shared neural patterns across memories. This process — *memory consolidation* — transforms fragile short-term memories into stable long-term representations through **synaptic potentiation** (Hebb's rule: "neurons that fire together wire together").

**Our implementation:**

```
Algorithm: computeMemoryClusters(dreams[])
├── Step 1: Build symbol co-occurrence matrix
│   └── For each dream, count how often symbol pairs appear together
│       (analogous to neurons co-activating during hippocampal replay)
│
├── Step 2: Graph-based clustering via BFS
│   └── Traverse co-occurrence graph, connecting symbols with
│       association count ≥ 2 (threshold for synaptic potentiation)
│   └── Connected components become memory clusters
│
├── Step 3: Consolidation strength scoring
│   └── strength = min(1, (dreamCount / totalDreams) × (symbolCount / 3))
│   └── Models Long-Term Potentiation (LTP) — more repetition = stronger encoding
│
└── Step 4: Stage classification
    ├── Emerging   (< 0.3) — Nascent pattern detected
    ├── Encoding   (0.3-0.5) — Neural pathways forming
    ├── Consolidating (0.5-0.7) — Active hippocampal replay
    └── Deep Memory (≥ 0.7) — Fully consolidated into long-term memory
```

### 2. Neural Data Sovereignty Framework

**Cognitive liberty principle:** Users must have the right to control what happens with their intimate cognitive data.

| Capability | Implementation | Enforced? |
|---|---|---|
| **Granular consent** | 4 independent toggles: AI Analysis, Image Gen, Pattern Detection, Cluster Formation | ✅ Edge function checks `user_consent` before processing |
| **Immutable audit trail** | Every consent change logged to `data_consent_log` | ✅ Append-only (no UPDATE/DELETE RLS) |
| **Full data portability** | One-click JSON export of all data | ✅ Client-side export |
| **Permanent deletion** | Cascade delete all user data | ✅ Irreversible, logged |

### 3. Collective Intelligence Layer

Privacy-preserving aggregation of anonymous symbol frequencies and emotion correlations — a "collective unconscious" mapped to Jungian archetypes. **No individual data exposed.**

---

## 🛡️ Security

- **Row-Level Security** on every table (`auth.uid() = user_id`)
- **Consent enforcement** in edge functions (not cosmetic)
- **Audit trail** is append-only
- **JWT validation** on all AI pipeline calls

---

## 🧰 Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + custom design tokens |
| Animation | Framer Motion |
| Graph | React Flow (@xyflow/react) |
| Backend | Supabase (Postgres + Auth + Edge Functions + RLS) |
| AI | Google Gemini 2.5 Flash |

---

## 🚀 Judge Demo Flow

1. Visit [/landing](https://somnia-atlas.lovable.app/landing) → architecture pitch
2. "Enter DreamOS" → dashboard with demo dreams
3. **Memory Clusters** → hippocampal consolidation in action
4. **Neural Atlas** → interactive symbol graph
5. **Sovereignty** → toggle consent off → verify enforcement
6. **Collective** → anonymous aggregate patterns
7. **Record a dream** → AI analysis → new clusters

**Demo:** Click "Try Demo" on auth page (`demo@dreamos.app`)

---

## 📚 References

- Buzsáki, G. (2015). *Hippocampal sharp wave-ripple.* Hippocampus, 25(10).
- Hebb, D.O. (1949). *The Organization of Behavior.* Wiley.
- Ienca, M. & Andorno, R. (2017). *Towards new human rights in the age of neuroscience.* Life Sciences, Society and Policy.
- Jung, C.G. (1968). *The Archetypes and the Collective Unconscious.* Princeton.
- Walker, M.P. & Stickgold, R. (2004). *Sleep-dependent learning and memory consolidation.* Neuron.

---

<p align="center"><strong>Built for PL_Genesis: Frontiers of Collaboration — Neurotech & BCI Track</strong></p>

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
