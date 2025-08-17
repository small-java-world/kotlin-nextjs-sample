#!/bin/bash

# Serena MCPサーバーとLSPを同居させるエントリポイントスクリプト

echo "🚀 Starting Serena MCP with LSP services..."

# 環境変数を設定
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
export PATH="/usr/local/bin:/usr/bin:/bin:$PATH"

# LSPプロセスをバックグラウンドで起動
echo "📝 Starting TypeScript Language Server..."
typescript-language-server --stdio &
TYPESCRIPT_LSP_PID=$!

echo "☕ Starting Java Language Server..."
java-language-server &
JAVA_LSP_PID=$!

# プロセスが起動するまで少し待機
sleep 2

# プロセスが起動しているか確認
if pgrep -f typescript-language-server > /dev/null; then
    echo "✅ TypeScript LSP is running (PID: $TYPESCRIPT_LSP_PID)"
else
    echo "❌ TypeScript LSP failed to start"
fi

if pgrep -f java-language-server > /dev/null; then
    echo "✅ Java LSP is running (PID: $JAVA_LSP_PID)"
else
    echo "❌ Java LSP failed to start"
fi

# Serena MCPサーバーを起動（フォアグラウンド）
echo "🤖 Starting Serena MCP Server..."
exec python serena-mcp-server.py
