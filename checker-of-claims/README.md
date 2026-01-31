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
We didn't just clone `gpt-4`. We engineered **5 distinct personas** to view the problem from different angles. This prevents "groupthink" and ensures every part of the claim is stress-tested.

| Juror | Role | Why we chose this |
|-------|------|-------------------|
| **🎭 The Skeptic** | Critical & Cynical | Challenges "technically true" claims that mislead. |
| **🧐 The Pedant** | Precision-Obsessed | catches slight number/date errors others miss. |
| **⚖️ The Pragmatist** | Common Sense Judge | Represents the "average reader's" interpretation. |
| **😈 Devil's Advocate** | Contrarian | Forces the group to consider the opposite view. |
| **🌐 Context Expert** | Big Picture | Checks if missing context changes the meaning. |

### 2. The Debate Architecture (Design Choice: Dynamic Consensus)
We rejected a simple "voting" system. We built a **deliberative process**:

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

## 🛠️ How It Works

The system is built on the **OpenAI Agents SDK** (lightweight wrapper).

### Directory Structure
*   `src/checker_of_facts/hackathon_agents.py`: Defines the personas, prompt engineering, and distinct roles.
*   `src/checker_of_facts/hackathon_engine.py`: The "game engine" that orchestrates rounds, shuffling, and reactions.
*   `src/checker_of_facts/hackathon_cli.py`: The command-line interface for running the system.

### The Flow
```mermaid
graph TD
    A[Input: Claim + Fact] --> B[Round 1: 5 Jurors Speak (Random Order)]
    B --> C[Moderator Summarizes Agreement/Disagreement]
    C --> D[Round 2: 5 Jurors Debate & Refine (Random Order)]
    D --> E[Final Judge Reviews Transcript]
    E --> F[Output: Verdict + Explanation]
```

---

## 🚀 Running the System

### Prerequisites
*   Python 3.10+
*   OpenAI API Key (exported as `OPENAI_API_KEY`)

### Installation
```bash
python -m venv .venv
source .venv/bin/activate
pip install -e .
```

### Usage

**1. Run a Single Debate**
Test a specific claim/truth pair to see the agents in action.
```bash
python -m checker_of_facts.hackathon_cli \
    --claim "Germany had less than 13,200 cases..." \
    --truth "As of 19 March 2020, Germany has reported 13,083 cases..."
```

**2. Run the Hackathon Dataset (Polaris.csv)**
Run the jury on the provided dataset. Good for bulk evaluation.
```bash
python -m checker_of_facts.hackathon_cli \
    --csv ../cambridge-dis-hackathon/Polaris.csv \
    --count 5
```

**3. Demo Mode (High Quality)**
For the final presentation, use the premium model (`gpt-4o`) for better reasoning.
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
