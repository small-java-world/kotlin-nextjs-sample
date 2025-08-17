#!/usr/bin/env bash
# Serena MCP優先ガードスクリプト（Windows用・jq不要）
# 素朴な編集をブロックし、Serenaのシンボル編集ツールに誘導

# hook入力(JSON)を読み取り、ツール名を取得（jqを使わない方法）
DATA="$(cat)"
TOOL=$(echo "$DATA" | grep -o '"tool_name"[[:space:]]*:[[:space:]]*"[^"]*"' | cut -d'"' -f4)

# SerenaのMCPツールは mcp__serena__<tool> という命名
if [[ "$TOOL" =~ ^mcp__serena__ ]]; then
  exit 0  # Serenaの操作は許可
fi

# 読み取り系やグロブは許可
if [[ "$TOOL" =~ ^(Read|Glob)$ ]]; then
  exit 0
fi

# それ以外（素朴な全文編集/grep等）はブロックし、Serena使用を促す
cat 1>&2 <<'ERR'
🚫 Prefer Serena's symbol-aware tools instead of naive edits:

🔍 For finding symbols:
- mcp__serena__find_symbol (or find_definition equivalent)
- mcp__serena__find_references

✏️ For editing:
- mcp__serena__replace_in_symbol
- mcp__serena__insert_after_symbol (or insert_before_symbol)

🧪 For testing:
- Use Bash to run project's test commands

🛟 Fallback steps if Serena tools fail:
1. Try Serena's range API (target symbol/file) again
2. Modify search queries for find_symbol/find_references
3. Limited text replacement with explicit scope
4. Manual edit as last resort (document reason and test plan)

💡 Serena provides better code understanding and safer refactoring!
ERR
exit 2
