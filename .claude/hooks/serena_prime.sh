#!/usr/bin/env bash
# Serena MCP初期化スクリプト
# セッション開始時にSerena使用を促す

cat <<'TXT'
🚀 [Serena Prime] Session initialized with Serena MCP

✅ REQUIRED: Activate project indexing before editing
- Run: /mcp__serena__activate_project
- Or say: "Activate this repository in Serena and index symbols before working"

📋 Guidelines:
- Prefer MCP tools from Serena for code navigation & edits
- Use symbol-aware tools instead of naive text edits
- Follow TDD workflow: Analyze → Edit → Test → Refactor

🔧 Available Serena Tools (examples - names may vary):
- mcp__serena__find_symbol / find_definition: Find symbol definitions
- mcp__serena__find_references: Find symbol references
- mcp__serena__replace_in_symbol: Safe symbol replacement
- mcp__serena__insert_after_symbol / insert_before_symbol: Insert near symbol
- mcp__serena__analyze_code: Code analysis
- mcp__serena__execute_shell_command: Test runner

🧪 Quality Gates:
- TypeScript: npx tsc --noEmit | npx eslint --fix
- Kotlin: ./gradlew test | ./gradlew build

💡 For Kotlin/Spring Boot projects:
- Ensure Java/Kotlin LSP is available in the container
- Use Serena for Kotlin-specific code navigation

🎯 Remember: Serena provides better code understanding and safer refactoring!
TXT
exit 0
