#!/usr/bin/env node

/**
 * Language Server Test Script
 * 言語サーバーの動作確認用スクリプト
 */

const { spawn } = require('child_process');
const readline = require('readline');

function testLanguageServer() {
    console.log('Testing Language Server...');
    
    // 言語サーバーを起動
    const process = spawn('node', ['language-server.js', '--stdio'], {
        stdio: ['pipe', 'pipe', 'pipe']
    });
    
    const rl = readline.createInterface({
        input: process.stdout,
        terminal: false
    });
    
    // 初期化リクエスト
    const initRequest = {
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
            processId: null,
            rootUri: null,
            capabilities: {},
            clientInfo: {
                name: 'test-client',
                version: '1.0.0'
            }
        }
    };
    
    console.log('Sending initialize request...');
    process.stdin.write(JSON.stringify(initRequest) + '\n');
    
    // レスポンスを読み取り
    rl.on('line', (line) => {
        try {
            const response = JSON.parse(line);
            console.log('Response:', JSON.stringify(response, null, 2));
            
            if (response.id === 1) {
                // 初期化完了後、補完リクエストを送信
                const completionRequest = {
                    jsonrpc: '2.0',
                    id: 2,
                    method: 'textDocument/completion',
                    params: {
                        textDocument: {
                            uri: 'file:///test.ts'
                        },
                        position: {
                            line: 0,
                            character: 0
                        }
                    }
                };
                
                console.log('Sending completion request...');
                process.stdin.write(JSON.stringify(completionRequest) + '\n');
            }
        } catch (e) {
            console.log('Raw response:', line);
        }
    });
    
    // エラーハンドリング
    process.stderr.on('data', (data) => {
        console.error('Error:', data.toString());
    });
    
    process.on('close', (code) => {
        console.log(`Process exited with code ${code}`);
    });
    
    // 5秒後にプロセスを終了
    setTimeout(() => {
        process.kill();
    }, 5000);
}

testLanguageServer();
