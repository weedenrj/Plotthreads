---
name: Component
description: Create, fix, update, or refactor components using ShadCN
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, Task
argument-hint: <action> <component-name> [details]
---

Use the **component-library** agent (via the Task tool with `subagent_type: "component-library"`) to handle component-related work.

Arguments provided: `$ARGUMENTS`

## Argument Patterns

The arguments may specify:

- **Create**: "add button", "create ThreadCard", "new dialog component"
- **Fix**: "fix Icon sizing", "bug in ThreadCard", "dialog won't close"
- **Update**: "add hover state to card", "button needs loading prop"
- **Refactor**: "clean up ThreadCard", "consolidate button variants"

## Examples

```
/component add button
/component fix Icon className not applying
/component update ThreadCard add edit mode
/component refactor consolidate card components
```

If no arguments provided, ask what component work is needed.
