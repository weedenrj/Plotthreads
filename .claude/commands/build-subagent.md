---
name: Build Subagent
description: Build a new subagent from the current conversation context
allowed-tools: Read, Write, Bash, Glob, Grep, Task
argument-hint: <agent-name or description>
---

Use the **subagent-builder** agent (via the Task tool with `subagent_type: "subagent-builder"` and `run_in_background: true`) to create a new subagent definition based on the conversation context.

Arguments provided: `$ARGUMENTS`

The subagent-builder will create a new agent definition at `.claude/agents/<name>.md` based on the conversation context.

The arguments `$ARGUMENTS` may contain:
- A suggested name for the agent (e.g., "worktree-setup")
- A brief description of what it should do
- Both name and description

If no arguments provided, infer the best name from the conversation topic.
