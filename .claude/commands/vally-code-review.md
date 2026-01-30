---
name: Code Vally Review
description: Senior Lead review for bugs and pattern drift (Rob/Nick/Tim authority).
allowed-tools: Read, Glob, Grep, Bash
argument-hint: [linear-id|scope] [scope]
---

# CODE VALLY REVIEW

**Core Principle:** The existing codebase is the style guide. If it doesn't match a **Rob, Nick, or Tim** pattern, it is a bug.
**Goal:** Find "fix before ship" bugs that break features or violate architectural integrity.
**Scope:** Parse `$ARGUMENTS` - supports Linear ID (VAL-123), `unstaged`, `staged`, `HEAD~N`, `main..HEAD`, branch names, file/directory paths.

## AGENT DELEGATION (PREFERRED)

If subagent tools are available (Task tool, agent invocation), delegate to the **code-reviewer** agent (`vally-reviewer`). Pass all arguments. Use the agent's report as final output. If delegation succeeds, stop here.

## FALLBACK REVIEW PROTOCOL

If agent delegation is unavailable, run this condensed 6-phase review directly.

### Phase 1: Ground

1. `git rev-parse --abbrev-ref HEAD` - get branch name
2. Parse Linear ID from arguments (regex `VAL-?\d+` or standalone integer). Normalize to `VAL-XXX`.
3. If issue ID found and not on develop/main: `npx tsx apps/scripts/src/scripts/linear/Linear.ts getIssue VAL-XXX` - use ACs to define correctness
4. **Diff fallback chain** (first match wins):
   - Explicit scope in arguments
   - Unstaged: `git diff` + `git ls-files --others --exclude-standard`
   - Staged: `git diff --cached`
   - Branch: `git diff origin/develop...HEAD`
   - Last commit: `git diff HEAD~1`
   - Empty: report "nothing to review" and halt
5. Authority mapping: **Rob** (UI/UX, Tailwind, features), **Nick** (architecture, data modeling), **Tim** (architecture, API/DI)
6. Risk: HIGH (services, models, money, auth) vs LOW (new files, pure UI, tests)
7. Drive-by detection: `git diff --name-status` - flag out-of-scope files

### Phase 2: Scan (Hard Stops)

Flag as **Fix Before Ship**:

**Readability:** nested ternaries, IIFEs, unclear/obscured intent, clever code, fallacious method names, uncommunicative names

**Pattern Matching:** pattern drift, doesn't match Rob/Nick/Tim patterns, newly invented patterns, inconsistent patterns

**Style:** semicolons, `any` types, `as unknown` casts, mutations in domain logic, wrapped/mixed imports, fails Linear intent, immutability violations

### Phase 3: Investigate

For each changed function/type/component:

1. **Readability** - Understand at a glance? If not, Fix Before Ship
2. **Pattern match** - Find 3+ analogs. Matches lead patterns? If not, Fix Before Ship
3. **Grep usages** - Call sites, not imports. Who depends on this?
4. **Reason about each usage** - Still works? Needs updating?
5. **Trace data flow** - Models in `packages/core/model/`. Entry -> transform -> exit
6. **Verify correctness** - Edge cases, business rules, data handling
7. **Cross-check consistency** - Same logic applied consistently?
8. **Scenario reasoning** - Concrete values, boundary cases
9. **Trace render path** (UI) - Props -> calculations -> JSX branches
10. **Mathematical reasoning** (calculations) - Formulas with real values
11. **Code removal verification** - Grep before deleting
12. **Type checking and linting** - `turbo run check-types --affected` and `turbo run lint --affected`
13. **Data fetching patterns** (React) - Infinite queries, virtualization, query hooks
14. **Code smells** - 18 checks: Uncommunicative Name, Fallacious Method Name, Type Embedded in Name, Binary Operator in Name, Long Method, Long Parameter List, Conditional Complexity, Combinatorial Explosion, Callback Hell, Duplicated Code, Oddball Solution, Inconsistent Names, Pattern Drift, Feature Envy, Speculative Generality, Dead Code, Magic Number, Primitive Obsession

### Phase 4: Red Team

Adversarial analysis - genuinely new checks, not re-verification:

1. **Bouncer Pattern** - Public functions reject bad input at the door?
2. **Design by Contract** - Implementation fulfills its type signature contract?
3. **Total Functions** - Missing switch cases, unhandled union arms?
4. **Shell/Core Separation** - Side effects separated from pure logic?
5. **Linear Flow** - Top-to-bottom without unnecessary indirection?
6. **Error Semantics** - Errors carry enough context to be actionable?
7. **3am Failure Test** - External deps fail? Timeouts? Stale data?

### Phase 5: Synthesize

1. Collect all findings from Phases 2-4
2. Deduplicate - same issue from multiple checks -> keep most specific
3. Drop false positives - re-examine against actual code and Vally conventions
4. Cross-file verification - bug in file A compensated in file B?
5. Classify: **Fix Before Ship** / **Needs Verification** / **Suggestion**
6. Verdict: **APPROVED** (zero issues) or **NEEDS ATTENTION** (one or more)

### Phase 6: Report

```
## Verdict: APPROVED | NEEDS ATTENTION

## Context
What this accomplishes (1-2 sentences).

| Field | Value |
|-------|-------|
| **Issue** | [VAL-123](url) - title |
| **Assignee** | Name |
| **Priority** | Urgent |
| **Authority Domain** | Rob/Nick/Tim |

## Risk Level
High/Medium/Low - justification.

## Investigation
- Summary of what was grepped, traced, verified
- Type checking and linting results
- Red team analysis performed

## Findings

### Fix Before Ship
1. **[file:line]** - **Issue title**
   Explanation. **Impact**: what breaks. **Fix**: how to fix.

### Needs Verification
1. **[file:line]** - Description. **Verify**: what to check.

### Looking Good
- Positive observations

## Side Effects Summary
| Issue | Severity | Status | Blocking? |
|-------|----------|--------|-----------|

<details>
<summary>Checks Performed (Phase 2, Phase 3: 14 steps, Phase 4: 7 red team)</summary>
Phase 2: Hard stops, Phase 3: Investigation steps, Phase 4: Red team checks
</details>
```

If zero findings, state what was checked and why it's clean. Verdict is APPROVED.