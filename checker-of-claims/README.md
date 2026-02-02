# FactTrace: The Agentic Jury ⚖️
## Cambridge DIS Hackathon Submission

> "A single AI can answer. A jury explains."

**FactTrace** is a multi-agent debate system designed to tackle the **"Faithful or Mutated?"** challenge. Instead of a black-box "True/False" output, we built a **diverse jury of 5 AI agents** that argue, negotiate, and react to each other to reach a nuanced verdict on whether an external claim faithfully represents a ground truth.

---

## 🚩 The Challenge
We were tasked with a subtle problem: given an **Internal Fact** (source truth) and an **External Claim** (tweet/headline), determine if the claim is a **Faithful Representation** or a **Mutation** (distorted, exaggerated, or missing context).

"Technically true" isn't enough. We needed a system that understands context, tone, and implication.

---

## 🧠 Our Solution: The Agentic Jury

We chose a **multi-agent approach** because truth is often a matter of perspective. A single prompt can be biased; a debate reveals the edges of the truth.

### 1. The Cast of Characters (Design Choice: Cognitive Diversity)
We engineered **5 distinct personas** using the OpenAI Agents SDK. This prevents "groupthink" and ensures every part of the claim is stress-tested.

| Juror | Role | Why we chose this |
|-------|------|-------------------|
| **🎭 The Skeptic** | Critical & Cynical | Challenges "technically true" claims that mislead. |
| **🧐 The Pedant** | Precision-Obsessed | catches slight number/date errors others miss. |
| **⚖️ The Pragmatist** | Common Sense Judge | Represents the "average reader's" interpretation. |
| **😈 Devil's Advocate** | Contrarian | Forces the group to consider the opposite view. |
| **🌐 Context Expert** | Big Picture | Checks if missing context changes the meaning. |

### 2. The Debate Architecture (Design Choice: Dynamic Consensus)
We built a custom orchestration engine (`HackathonDebateEngine`) that manages the flow:

*   **Round 1 (Discovery):** Jurors speak in a **random order**. This prevents the "First Speaker Bias" (where everyone just agrees with the first agent).
*   **The Moderator's Interlude:** A separate neutral agent summarizes the points of friction. This "resets" the room and focuses the debate on what actually matters.
*   **Round 2 (Convergence):** Jurors speak again (new random order), reacting to previous arguments and the moderator's summary. They can change their minds.
*   **Live Reactions:** As one juror speaks, others "react" (👍/👎) in real-time. This captures consensus without cluttering the conversation.

### 3. The Verdict (Design Choice: Explainability)
The final output isn't just a label. A specialized **Final Judge Agent** (separate from the Moderator) reviews the entire transcript to deliver:
*   **Verdict:** Faithful / Mutated / Unclear
*   **Confidence Score:** (0-100%)
*   **Rationale:** A detailed breakdown of *why* the jury decided this way.

---

## 🏗️ Technical Implementation

Our solution is built using the **OpenAI Agents SDK (`openai-agents`)** for structured agent definition and orchestration.

### The Stack
*   **OpenAI Agents SDK:** Used to define the agents (`Agent`) and execute their turns (`Runner`). We rely on the SDK's ability to enforce structured outputs (using Pydantic models) so every juror turn and verdict is machine-parseable.
*   **Python 3.10+:** Core language.
*   **Pydantic:** Used to strictly define the shape of the debate (turns, verdicts, summaries).

### Key Components
1.  **`hackathon_agents.py`**:
    *   **Registry Pattern**: We use a `HackathonAgentRegistry` to initialize our 5 jurors + moderator + judge.
    *   **Prompt Engineering**: specific system instructions for each persona (e.g., "You are The Pedant... focus on exact numbers").
2.  **`hackathon_engine.py`**:
    *   **Orchestration Loop**: This is the "brain". It doesn't just let agents chat randomly. It enforces the 2-round structure.
    *   **State Management**: It passes the full transcript (history of turns) to the next speaker so they have context.
    *   **Async/Parallel Execution**: Reactions are fetched in parallel (`asyncio.gather`) to keep the debate fast.
3.  **Structured Outputs**:
    *   We don't parse strings. The `Final Judge` returns a `ModeratorFinalVerdict` object, guaranteeing we always get a valid JSON result with confidence scores and bullet points.

---

## 🚀 Setup & Usage

### 1. Prerequisites
*   Python 3.11 or higher
*   An OpenAI API Key (needs access to `gpt-4o` or `gpt-4.1-mini`)

### 2. Installation
```bash
# Clone the repo (if you haven't already)
# cd facttrace/checker-of-claims

# Create a virtual environment
python -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -e .
```

### 3. Configuration
Set your API key. You can do this in your terminal or create a `.env` file.
```bash
export OPENAI_API_KEY="sk-..."
```

### 4. Running the Debate
We provide a simple CLI to interact with the system.

**A. Single Pair Test (Good for debugging)**
```bash
python -m checker_of_facts.hackathon_cli \
    --claim "Germany had less than 13,200 cases..." \
    --truth "As of 19 March 2020, Germany has reported 13,083 cases..."
```

**B. Bulk Run (The Polaris Dataset)**
Run on the provided hackathon CSV file.
```bash
python -m checker_of_facts.hackathon_cli \
    --csv ../cambridge-dis-hackathon/Polaris.csv \
    --count 5
```

**C. Demo Mode (Premium)**
For the final presentation, use the `--premium` flag to switch all agents to `gpt-4o` (slower but deeper reasoning).
```bash
python -m checker_of_facts.hackathon_cli \
    --csv ../cambridge-dis-hackathon/Polaris.csv \
    --indices 1 3 5 \
    --premium
```

---

## 📊 Example Output

```text
🎭 The Skeptic (Round 1):
"Technically the number is correct, but saying 'less than' implies it was small. It wasn't."
[Reactions: 🧐👍 ⚖️👎]

...

⚖️ FINAL VERDICT: Mutated ❌
Confidence: 85%
Summary: While the numbers are accurate, the claim strips out the critical context of the casualty rate, altering the public perception of the event.
```
