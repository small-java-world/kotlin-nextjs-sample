#!/usr/bin/env python3
"""
MCP Server Test Script
Serena MCPサーバーの動作確認用スクリプト
"""

import json
import subprocess
import time

def test_mcp_server():
    """MCPサーバーのテスト"""
    print("Testing Serena MCP Server...")
    
    # MCPサーバーを起動
    process = subprocess.Popen(
        ["python", "serena-mcp-server.py"],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    try:
        # 初期化リクエスト
        init_request = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "initialize",
            "params": {
                "protocolVersion": "2024-11-05",
                "capabilities": {},
                "clientInfo": {
                    "name": "test-client",
                    "version": "1.0.0"
                }
            }
        }
        
        print("Sending initialize request...")
        process.stdin.write(json.dumps(init_request) + "\n")
        process.stdin.flush()
        
        # レスポンスを読み取り
        response = process.stdout.readline()
        print(f"Response: {response}")
        
        # ツール一覧リクエスト
        tools_request = {
            "jsonrpc": "2.0",
            "id": 2,
            "method": "tools/list",
            "params": {}
        }
        
        print("Sending tools/list request...")
        process.stdin.write(json.dumps(tools_request) + "\n")
        process.stdin.flush()
        
        # レスポンスを読み取り
        response = process.stdout.readline()
        print(f"Response: {response}")
        
        # ツール呼び出しリクエスト
        call_request = {
            "jsonrpc": "2.0",
            "id": 3,
            "method": "tools/call",
            "params": {
                "name": "serena_analyze_code",
                "arguments": {
                    "file_path": "test.py",
                    "analysis_type": "quality"
                }
            }
        }
        
        print("Sending tools/call request...")
        process.stdin.write(json.dumps(call_request) + "\n")
        process.stdin.flush()
        
        # レスポンスを読み取り
        response = process.stdout.readline()
        print(f"Response: {response}")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        # プロセスを終了
        process.terminate()
        process.wait()

if __name__ == "__main__":
    test_mcp_server()
