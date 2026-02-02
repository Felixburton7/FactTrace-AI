# FactTrace: The Agentic Consensus Jury ⚖️

> **🏆 3rd Place Winner** at the Cambridge DIS Hackathon (Team Polaris)  
> *Developed by Felix Burton, Dhruv Gupta, and Uras Asil*

---

## 📖 Overview

**FactTrace** is a sophisticated multi-agent system designed to solve the "Faithful or Mutated?" challenge. Instead of a single "black box" AI determining truth, we built a **living, breathing jury of AI agents** with distinct personalities, biases, and roles. 

These agents debate, argue, and negotiate to determine if an external claim (e.g., a tweet) faithfully represents an internal ground truth (e.g., a report) or if it has been "mutated" through distortion, exaggeration, or missing context.

---

## 🚀 The Challenge: "Faithful or Mutated?"

**The Consensus Challenge:** We were given pairs of statements—an **Internal Fact** (source truth) and an **External Claim** (derived statement). 

The goal wasn't just to check if the claim was "technically true," but to detect subtle shifts in meaning. Is the headline sensationalized? Did the tweet strip away vital nuance? 

A single LLM calling "True" or "False" is opaque. To solve this, we needed a system that could **explain its reasoning** through dialectic debate.

---

## 💡 The Solution: An Agentic Jury

We engineered a **Multi-Agent Jury Debate System** where 5 unique AI agents (Jurors) review the evidence, debate amongst themselves, and reach a verdict.

### 🧠 The Agents Breakdown

We utilized a modular agentic architecture to create a diverse ecosystem of reasoning:

| Agent Persona | Role | Personality |
|--------------|------|-------------|
| **The Skeptic** 🤨 | **Critic** | Challenges every assumption, looks for logical fallacies. |
| **The Pedantic Fact-Checker** 🧐 | **Analyst** | Obsessed with precision, numbers, dates, and exact wording. |
| **The Common Sense Judge** 🤷‍♂️ | **Pragmatist** | Considers how the "average reader" would interpret the claim. |
| **The Devil's Advocate** 😈 | **Contrarian** | Deliberately argues the opposite view to stress-test the consensus. |
| **The Context Expert** 🌐 | **Synthesizer** | Zooms out to identify what key context was left out. |

### 🤖 Advanced AI Integration

Our system goes beyond simple prompting. We implemented a complex orchestration layer:

*   **Recursive Debate Structure:** Agents don't just speak once. They listen, react, and refine their arguments in a multi-round format.
*   **Reactor Agents:** Dedicated "Reactor" sub-agents monitor the debate in real-time, providing "👍" or "👎" feedback on specific arguments, simulating a live audience or peer review.
*   **Moderator & Judge Separation:** To ensure fairness, we separated the **Moderator** (who guides the conversation) from the **Final Judge** (who delivers the verdict), preventing bias accumulation.
*   **Voice Integration (ElevenLabs):** We integrated **ElevenLabs** to give each juror a distinct, realistic voice, turning the text-based terminal output into a live, audible courtroom drama.

### ⚡ System Architecture

```mermaid
graph TD
    Data[Data Input (Claim vs Truth)] --> Moderator
    Moderator --> Round1[Round 1: Initial Arguments]
    
    subgraph Jury Room
        Round1 --> Agent1[The Skeptic]
        Round1 --> Agent2[The Pedantic]
        Round1 --> Agent3[Common Sense]
        Round1 --> Agent4[Devil's Advocate]
        Round1 --> Agent5[Context Expert]
        
        Agent1 -.-> Reactors[Reactor Agents 👍/👎]
        Agent2 -.-> Reactors
        
        Reactors --> Summary[Moderator Summary]
        Summary --> Round2[Round 2: Rebuttal & Refinement]
        Round2 --> Agent1
        Round2 --> Agent2
        Round2 --> ...
    end
    
    ... --> FinalJudge[Final Judge Agent]
    FinalJudge --> Verdict{Final Verdict: Faithful or Mutated?}
    FinalJudge --> Report[Detailed Confidence & Reasoning]
```

---

## 📸 Demo & Gallery

We designed the system to be visually and audibly impressive. Below are snapshots of the agents in action.

<div align="center">
  <img src="images/image.png" width="45%" alt="Jury Debate Trace" />
  <img src="images/image%20copy.png" width="45%" alt="Agent Reasoning" />
</div>

<br/>

<div align="center">
  <img src="images/image%20copy%202.png" width="45%" alt="Terminal Interface" />
  <img src="images/image%20copy%203.png" width="45%" alt="Verdict Screen" />
</div>

---

## 🛠️ Tech Stack

*   **Core Logic:** Python 3.12+
*   **AI Engine:** OpenAI GPT-4o (Premium Demo) / GPT-4o-mini (Dev)
*   **Orchestration:** Custom `checker_of_facts` Agent Framework
*   **Voice Synthesis:** ElevenLabs API
*   **Interface:** Rich Terminal UI with Color-Coded Personas

---

## 🏃‍♂️ How to Run

1.  **Clone and Setup**:
    ```bash
    git clone https://github.com/FactTrace-Ltd/checker-of-claims.git
    cd checker-of-claims
    ```

2.  **Environment Setup**:
    ```bash
    # Create virtual environment and install dependencies
    ./run_hackathon.sh --help
    ```

3.  **Run a Debate**:
    ```bash
    # Run the full jury system on specific claims
    python -m checker_of_facts.hackathon_cli \
        --csv data/Polaris.csv \
        --count 1 \
        --premium
    ```

---

*Made with ❤️ by Team Polaris for the Cambridge DIS Hackathon 2025.*
