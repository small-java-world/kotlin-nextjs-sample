#!/usr/bin/env bash
# ツール使用状況デバッグログ
# PreToolUseで実行されるツール名を記録

# hook入力(JSON)を読み取り
DATA="$(cat)"

# タイムスタンプ付きでログに記録
echo "$(date '+%Y-%m-%d %H:%M:%S') - Tool Usage: $DATA" >> "$CLAUDE_PROJECT_DIR/.claude/tool-usage.log"

# ツール名のみを抽出して別ファイルに記録
TOOL=$(echo "$DATA" | grep -o '"tool_name"[[:space:]]*:[[:space:]]*"[^"]*"' | cut -d'"' -f4)
echo "$(date '+%Y-%m-%d %H:%M:%S') - Tool: $TOOL" >> "$CLAUDE_PROJECT_DIR/.claude/tool-names.log"

# 元のJSONデータも保存（詳細分析用）
echo "$DATA" > "$CLAUDE_PROJECT_DIR/.claude/last-tool.json"

exit 0
