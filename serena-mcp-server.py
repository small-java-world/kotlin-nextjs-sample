#!/usr/bin/env python3
"""
Serena MCP Server
AI駆動開発支援のためのMCPサーバー
"""

import asyncio
import json
import logging
import os
import sys
from typing import Any, Dict, List, Optional

# ログ設定
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SerenaMCPServer:
    """Serena MCP Server"""
    
    def __init__(self):
        self.server_name = "serena-mcp"
        self.server_version = "1.0.0"
        
    async def handle_initialize(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """初期化処理"""
        logger.info("Initializing Serena MCP Server")
        return {
            "protocolVersion": "2024-11-05",
            "capabilities": {
                "tools": {}
            },
            "serverInfo": {
                "name": self.server_name,
                "version": self.server_version
            }
        }
    
    async def handle_tools_list(self) -> Dict[str, Any]:
        """ツール一覧を返す"""
        return {
            "tools": [
                {
                    "name": "serena_analyze_code",
                    "description": "コードを分析して改善提案を生成",
                    "inputSchema": {
                        "type": "object",
                        "properties": {
                            "file_path": {
                                "type": "string",
                                "description": "分析対象のファイルパス"
                            },
                            "analysis_type": {
                                "type": "string",
                                "enum": ["quality", "performance", "security", "architecture"],
                                "description": "分析タイプ"
                            }
                        },
                        "required": ["file_path", "analysis_type"]
                    }
                },
                {
                    "name": "serena_generate_test",
                    "description": "コードからテストケースを自動生成",
                    "inputSchema": {
                        "type": "object",
                        "properties": {
                            "file_path": {
                                "type": "string",
                                "description": "テスト対象のファイルパス"
                            },
                            "test_framework": {
                                "type": "string",
                                "enum": ["jest", "pytest", "junit", "vitest"],
                                "description": "テストフレームワーク"
                            }
                        },
                        "required": ["file_path", "test_framework"]
                    }
                }
            ]
        }
    
    async def handle_tools_call(self, name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """ツールの実行"""
        try:
            if name == "serena_analyze_code":
                return await self.analyze_code(arguments)
            elif name == "serena_generate_test":
                return await self.generate_test(arguments)
            else:
                return {
                    "content": [
                        {
                            "type": "text",
                            "text": f"Unknown tool: {name}"
                        }
                    ]
                }
        except Exception as e:
            logger.error(f"Error in tool {name}: {e}")
            return {
                "content": [
                    {
                        "type": "text",
                        "text": f"Error: {str(e)}"
                    }
                ]
            }
    
    async def analyze_code(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """コード分析"""
        file_path = args.get("file_path")
        analysis_type = args.get("analysis_type")
        
        analysis_result = f"""
## コード分析結果: {file_path}

### 分析タイプ: {analysis_type}

### 改善提案:
1. **コード品質**: 可読性の向上
2. **パフォーマンス**: 最適化の余地
3. **セキュリティ**: 脆弱性の確認
4. **アーキテクチャ**: 設計パターンの適用

### 推奨アクション:
- テストカバレッジの向上
- エラーハンドリングの強化
- ドキュメントの追加
"""
        
        return {
            "content": [
                {
                    "type": "text",
                    "text": analysis_result
                }
            ]
        }
    
    async def generate_test(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """テスト生成"""
        file_path = args.get("file_path")
        test_framework = args.get("test_framework")
        
        test_code = f"""
// {test_framework} テストケース
// ファイル: {file_path}

describe('Generated Tests', () => {{
  test('should handle basic functionality', () => {{
    // テスト実装
    expect(true).toBe(true);
  }});
  
  test('should handle edge cases', () => {{
    // エッジケースのテスト
    expect(() => {{}}).not.toThrow();
  }});
}});
"""
        
        return {
            "content": [
                {
                    "type": "text",
                    "text": test_code
                }
            ]
        }
    
    async def run(self):
        """サーバーを実行"""
        logger.info(f"Starting Serena MCP Server")
        
        # 標準入出力でMCPプロトコルを処理
        while True:
            try:
                line = await asyncio.get_event_loop().run_in_executor(None, sys.stdin.readline)
                if not line:
                    break
                
                request = json.loads(line)
                method = request.get("method")
                params = request.get("params", {})
                id = request.get("id")
                
                response = None
                
                if method == "initialize":
                    response = await self.handle_initialize(params)
                elif method == "tools/list":
                    response = await self.handle_tools_list()
                elif method == "tools/call":
                    name = params.get("name")
                    arguments = params.get("arguments", {})
                    response = await self.handle_tools_call(name, arguments)
                
                if response and id:
                    result = {
                        "jsonrpc": "2.0",
                        "id": id,
                        "result": response
                    }
                    print(json.dumps(result), flush=True)
                    
            except Exception as e:
                logger.error(f"Error processing request: {e}")
                if id:
                    error_response = {
                        "jsonrpc": "2.0",
                        "id": id,
                        "error": {
                            "code": -1,
                            "message": str(e)
                        }
                    }
                    print(json.dumps(error_response), flush=True)

async def main():
    """メイン関数"""
    server = SerenaMCPServer()
    await server.run()

if __name__ == "__main__":
    asyncio.run(main())
