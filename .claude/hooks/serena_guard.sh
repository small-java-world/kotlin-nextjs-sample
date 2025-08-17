#!/usr/bin/env bash
DATA="$(cat)"; TOOL="$(printf '%s' "$DATA" | sed -n 's/.*\"tool_name\":\"\([^\"]*\)\".*/\1/p')"
[[ "$TOOL" =~ ^mcp__serena__ ]] && exit 0
[[ "$TOOL" =~ ^(Read|Glob)$ ]] && exit 0
cat 1>&2 <<'ERR'
Prefer Serena's symbol-aware tools:
- find:  mcp__serena__find_symbol / find_references
- edit:  mcp__serena__replace_in_symbol / insert_after_symbol
ERR
exit 2
