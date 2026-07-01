# Contract

## 1. Parties and Term

- This is a contract between Chad Hage ("Me", "I", "Mine") and GitHub Copilot ("You", "Your"), its agents, skills, and extensions.
- The contract will remain in effect until I terminate it.

## 2. Agents to Be Implemented

### 2.1 Deming — Agent of Agents (`../deming`)
- You will implement an agent of agents under `../deming`.
- It will act as an ASQ Certified Master Black Belt to `ci-csa-agent` and to `ci-csam-agent`.

### 2.2 ci-csa-agent (`ci-csa-agent/`)
- You will implement an agent that combines Lean Six Sigma Black Belt expertise with Microsoft Azure, M365, and Dynamics L400-level expertise under the `ci-csa-agent` directory.
- It will hold expert-level competency in the list of topics that each tile on `Certification-Poster_en-us.pdf` encompasses.

### 2.3 ci-csam-agent (`ci-csam-agent/`)
- You will implement an agent that combines Lean Six Sigma Black Belt level continuous improvement expertise, a basic level understanding of GAAP, and Microsoft Foundations-level competencies in the topics expressed in `Certification-Poster_en-us.pdf` under the `ci-csam-agent` directory.

## 3. Hosting and Cloud Environment

- All agents will run on Azure in the following tenant: `16b3c013-d300-468d-ac64-7eda0820b6d3` and under the following subscription: `474c40eb-d385-40d8-baa2-06883dbdca2d`.
- Ring-based deployment for canary, private, public, and general availability must be implemented via logical segmentation and across a geo-redundant infrastructure.

## 4. Architecture and Technology Preferences

- Favor Function Apps Flex Consumption wherever containers are needed.
- Favor Static Web Apps (SWA) wherever SPA and front-end choices permit, and maximize the use of SWAs as much as possible to optimize for cost.
- Favor Azure Tables and Azure Queues wherever possible for persistent store, caching, and event queuing.
- Favor a responsive and progressive web app experience wherever possible, and maximize the use of both edge and hub resources, especially for offline mode.
- Favor MS Teams for embedded agent interactions, and Web/SMS for non-embedded interactions, with phone numbers in North America/US. Send the the user a link via SMS for example to launch the MS Teams chat, or use Web chat if they prefer to avoid using MS Teams for whatever reason.

## 5. Process and Governance

- You must ask for clarification on any topics that are unclear or ambiguous.
- You must update a lessons-learned markdown file after every iteration, and consult the lessons-learned file before proceeding with any subsequent tasks or invocations.
- You must maintain a `backlog.md` and a `roadmap.md` to capture demand and map out future work, and update them with every iteration.
- CD3 (Cost of Delay Divided by Duration) and WSJF (Weighted Shortest Job First) will be used to determine priority and to force-rank backlog items.
- IINVEST — Independent, Immediate, Negotiated, Valuable, Estimated, Sized, and Testable — must be met to an absolute pass/fail for any work item to be committed for delivery during an iteration.
- Internal design docs must be maintained and updated with each iteration, and must remain audit-proof and defensible with each iteration.

## 6. Iteration Cadence

- Whenever I say "start iteration", you will show me the top 3 highest-priority items based on the roadmap and ask me whether I want to capture net new demand.
- The default sequence for each iteration is: retrospective, followed by backlog harvesting and refinement, followed by tech debt mitigation, followed by net new value-add creation.
- The retrospective will always be allocated 5 minutes.
- A maximum of 10% of any iteration's duration will be allocated to backlog harvesting.
- The default duration for backlog harvesting will be 5 minutes. When 4.5 minutes are reached, you must prompt me to confirm whether I want additional time to complete the activity or conclude it right there and then, so that the tech debt buffer and the net new value creation work can begin.
- The duration of the subsequent activities (tech debt mitigation and net new value-add creation) will be relative to the duration of backlog harvesting and refinement.
- Each iteration will end by declaring "ready for canary", which will then trigger a demo.

## 7. Quality and Engineering Standards

- You must implement TDD with 80% test coverage as a minimum at all times.
- Compile and build must complete in less than 180 seconds; otherwise, refactoring stories and work must be prioritized for subsequent iterations until the target of 180 seconds per full end-to-end build is reached.
- The tech debt buffer must not exceed 10% of the total work completed per iteration.

## 8. Deployment and Demos

- Approved demos must automatically be deployed to the canary stage by default, unless the demo and approval specify which stage the approval feedback was conducted at; in that case, the build should be deployed to the next logical stage.
