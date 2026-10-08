---
name: voc
description: Capture the voice of the customer through an adaptive questionnaire and save the result as a numbered VOC card. Use when the user wants to interview a customer, capture a customer need, create a VOC item, or turn customer feedback into a user story and acceptance criteria.
---

# Voice of the Customer

Capture a customer's problem, desired outcome, and evidence of success without prematurely prescribing a solution. Use `.docs/voc/voc-10001.md` as the card template.

## Questionnaire

Ask one question at a time. Ask at least 3 and no more than 10 questions in total.

Start with these three subjects, adapting the wording to the conversation:

1. What is the customer trying to accomplish, and in what situation?
2. What makes that difficult today, and why does it matter?
3. What observable outcome would make the customer say the need has been met?

After the third answer, ask only questions needed to remove material ambiguity. Potential follow-up subjects include:

- Who experiences the need and how often?
- What does the customer do today?
- Which details, constraints, or exceptions are essential?
- What must never happen?
- How should errors or interruptions be handled?
- What examples or evidence confirm the expected outcome?

Do not ask about information the user already provided. Prefer open, neutral questions that do not steer the customer toward a specific feature. When practical, use multiple-choice answers based on facts already supplied, while always allowing the respondent to provide their own answer.

Stop questioning when there is enough evidence to write a specific card, or after the tenth question. If essential ambiguity remains at the limit, record it transparently under `Confirmations` as an open confirmation rather than inventing an answer.

## Synthesis rules

- Preserve the customer's terminology and intent.
- Include a short first-person quotation under `Voice of the customer`. Use a direct quotation only when those words were supplied by the respondent. Otherwise, label it `Paraphrased from the interview`.
- Write one user story in the form: `As a [customer/persona], I want [capability or outcome], so that [customer value].`
- Describe the customer's need rather than an implementation.
- Make acceptance criteria observable, testable, solution-neutral, and traceable to interview answers.
- Put explicitly validated expectations under `Confirmations`.
- Mark assumptions and unresolved matters as open confirmations. Never present inferred details as customer-confirmed facts.
- Keep one primary customer outcome per card. If the interview reveals independent needs, create separate cards only with the user's approval.

## Store the VOC card

1. Read `.docs/voc/voc-10001.md` before writing to confirm the current template.
2. Inspect `.docs/voc/voc-*.md` and select the next unused numeric ID after the highest existing ID.
3. Create `.docs/voc/voc-<ID>.md` with this structure:

```markdown
# <Customer-focused outcome>

## Voice of the customer

"<Customer quotation>"

## User Story

As a <customer/persona>, I want <capability or outcome>, so that <customer value>.

## Acceptance criteria

- <Observable criterion>

## Confirmations

- <Confirmed expectation or open confirmation>
```

4. Add the new card to `.docs/voc/index.md`, preserving numeric order and the index's existing style.
5. Show the completed card to the user and identify any open confirmations.

Do not overwrite an existing VOC card. Do not update backlogs, Kanban boards, or implementation plans unless the user asks.
