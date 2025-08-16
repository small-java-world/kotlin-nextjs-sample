#!/usr/bin/env node

/**
 * Language Server for TODO App Development
 * TypeScript, JavaScript, Kotlin対応の言語サーバー
 */

const {
  createConnection,
  TextDocuments,
  ProposedFeatures,
  InitializeParams,
  DidChangeConfigurationNotification,
  CompletionItem,
  CompletionItemKind,
  TextDocumentPositionParams,
  TextDocumentSyncKind,
  InitializeResult,
} = require('vscode-languageserver/node');

const { TextDocument } = require('vscode-languageserver-textdocument');
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

// 接続を作成
const connection = createConnection(ProposedFeatures.all);

// ドキュメントマネージャーを作成
const documents = new TextDocuments(TextDocument);

let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
let hasDiagnosticRelatedInformationCapability = false;

connection.onInitialize((params) => {
  const capabilities = params.capabilities;

  // 設定機能の確認
  hasConfigurationCapability = !!(
    capabilities.workspace && !!capabilities.workspace.configuration
  );
  hasWorkspaceFolderCapability = !!(
    capabilities.workspace && !!capabilities.workspace.workspaceFolders
  );
  hasDiagnosticRelatedInformationCapability = !!(
    capabilities.textDocument &&
    capabilities.textDocument.publishDiagnostics &&
    capabilities.textDocument.publishDiagnostics.relatedInformation
  );

  const result = {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      // 補完機能
      completionProvider: {
        resolveProvider: true,
        triggerCharacters: ['.', ':', '"', "'", '`', '/', '\\', '@', '#', '$', '%', '&', '*', '+', '-', '=', '|', '~', '!', '?', '<', '>', '(', ')', '[', ']', '{', '}', ';', ','],
      },
      // 定義ジャンプ
      definitionProvider: true,
      // 参照検索
      referencesProvider: true,
      // シンボル検索
      documentSymbolProvider: true,
      // ワークスペースシンボル検索
      workspaceSymbolProvider: true,
      // ホバー情報
      hoverProvider: true,
      // コードアクション
      codeActionProvider: {
        codeActionKinds: ['quickfix', 'refactor', 'source'],
      },
      // フォーマット
      documentFormattingProvider: true,
      // リネーム
      renameProvider: true,
    },
  };

  if (hasWorkspaceFolderCapability) {
    result.capabilities.workspace = {
      workspaceFolders: {
        supported: true,
      },
    };
  }

  return result;
});

connection.onInitialized(() => {
  if (hasConfigurationCapability) {
    // 設定変更の監視を登録
    connection.client.register(DidChangeConfigurationNotification.type, undefined);
  }
  if (hasWorkspaceFolderCapability) {
    connection.workspace.onDidChangeWorkspaceFolders((_event) => {
      connection.console.log('Workspace folder change event received.');
    });
  }
});

// 設定変更の処理
connection.onDidChangeConfiguration((change) => {
  if (hasConfigurationCapability) {
    // 設定変更時の処理
    connection.console.log('Configuration changed');
  }
});

// ドキュメントの変更を監視
documents.onDidClose((e) => {
  connection.console.log(`Document closed: ${e.document.uri}`);
});

// ドキュメントの内容変更を監視
documents.onDidChangeContent((change) => {
  validateTextDocument(change.document);
});

// 補完機能
connection.onCompletion(
  (textDocumentPosition) => {
    const document = documents.get(textDocumentPosition.textDocument.uri);
    if (!document) {
      return [];
    }

    const position = textDocumentPosition.position;
    const text = document.getText();
    const lines = text.split('\n');
    const currentLine = lines[position.line] || '';
    const currentChar = currentLine[position.character - 1] || '';

    // ファイル拡張子に基づいて補完アイテムを生成
    const fileExtension = path.extname(document.uri);
    return generateCompletionItems(fileExtension, currentLine, position);
  }
);

// 補完アイテムの解決
connection.onCompletionResolve((item) => {
  if (item.data === 1) {
    item.detail = 'TypeScript details';
    item.documentation = 'TypeScript documentation';
  } else if (item.data === 2) {
    item.detail = 'JavaScript details';
    item.documentation = 'JavaScript documentation';
  } else if (item.data === 3) {
    item.detail = 'Kotlin details';
    item.documentation = 'Kotlin documentation';
  }
  return item;
});

// 定義ジャンプ
connection.onDefinition((params) => {
  const document = documents.get(params.textDocument.uri);
  if (!document) {
    return null;
  }

  // 定義の場所を検索
  return findDefinition(document, params.position);
});

// 参照検索
connection.onReferences((params) => {
  const document = documents.get(params.textDocument.uri);
  if (!document) {
    return [];
  }

  // 参照を検索
  return findReferences(document, params.position);
});

// ホバー情報
connection.onHover((params) => {
  const document = documents.get(params.textDocument.uri);
  if (!document) {
    return null;
  }

  // ホバー情報を生成
  return generateHoverInfo(document, params.position);
});

// コードアクション
connection.onCodeAction((params) => {
  const document = documents.get(params.textDocument.uri);
  if (!document) {
    return [];
  }

  // コードアクションを生成
  return generateCodeActions(document, params);
});

// ドキュメントフォーマット
connection.onDocumentFormatting((params) => {
  const document = documents.get(params.textDocument.uri);
  if (!document) {
    return [];
  }

  // フォーマットを実行
  return formatDocument(document, params);
});

// リネーム
connection.onRenameRequest((params) => {
  const document = documents.get(params.textDocument.uri);
  if (!document) {
    return null;
  }

  // リネームを実行
  return performRename(document, params);
});

// 補完アイテムの生成
function generateCompletionItems(fileExtension, currentLine, position) {
  const items = [];

  // TypeScript/JavaScript用の補完
  if (fileExtension === '.ts' || fileExtension === '.tsx' || fileExtension === '.js' || fileExtension === '.jsx') {
    items.push(
      CompletionItem.create('console.log', CompletionItemKind.Function),
      CompletionItem.create('function', CompletionItemKind.Keyword),
      CompletionItem.create('const', CompletionItemKind.Keyword),
      CompletionItem.create('let', CompletionItemKind.Keyword),
      CompletionItem.create('var', CompletionItemKind.Keyword),
      CompletionItem.create('if', CompletionItemKind.Keyword),
      CompletionItem.create('for', CompletionItemKind.Keyword),
      CompletionItem.create('while', CompletionItemKind.Keyword),
      CompletionItem.create('try', CompletionItemKind.Keyword),
      CompletionItem.create('catch', CompletionItemKind.Keyword),
      CompletionItem.create('async', CompletionItemKind.Keyword),
      CompletionItem.create('await', CompletionItemKind.Keyword),
      CompletionItem.create('Promise', CompletionItemKind.Class),
      CompletionItem.create('Array', CompletionItemKind.Class),
      CompletionItem.create('Object', CompletionItemKind.Class),
      CompletionItem.create('String', CompletionItemKind.Class),
      CompletionItem.create('Number', CompletionItemKind.Class),
      CompletionItem.create('Boolean', CompletionItemKind.Class),
      CompletionItem.create('Date', CompletionItemKind.Class)
    );
  }

  // Kotlin用の補完
  if (fileExtension === '.kt') {
    items.push(
      CompletionItem.create('fun', CompletionItemKind.Keyword),
      CompletionItem.create('val', CompletionItemKind.Keyword),
      CompletionItem.create('var', CompletionItemKind.Keyword),
      CompletionItem.create('if', CompletionItemKind.Keyword),
      CompletionItem.create('for', CompletionItemKind.Keyword),
      CompletionItem.create('while', CompletionItemKind.Keyword),
      CompletionItem.create('try', CompletionItemKind.Keyword),
      CompletionItem.create('catch', CompletionItemKind.Keyword),
      CompletionItem.create('suspend', CompletionItemKind.Keyword),
      CompletionItem.create('class', CompletionItemKind.Keyword),
      CompletionItem.create('object', CompletionItemKind.Keyword),
      CompletionItem.create('interface', CompletionItemKind.Keyword),
      CompletionItem.create('data', CompletionItemKind.Keyword),
      CompletionItem.create('sealed', CompletionItemKind.Keyword),
      CompletionItem.create('enum', CompletionItemKind.Keyword),
      CompletionItem.create('String', CompletionItemKind.Class),
      CompletionItem.create('Int', CompletionItemKind.Class),
      CompletionItem.create('Long', CompletionItemKind.Class),
      CompletionItem.create('Double', CompletionItemKind.Class),
      CompletionItem.create('Boolean', CompletionItemKind.Class),
      CompletionItem.create('List', CompletionItemKind.Class),
      CompletionItem.create('Map', CompletionItemKind.Class),
      CompletionItem.create('Set', CompletionItemKind.Class)
    );
  }

  return items;
}

// 定義の検索
function findDefinition(document, position) {
  // 簡易的な定義検索
  const text = document.getText();
  const lines = text.split('\n');
  const currentLine = lines[position.line] || '';
  
  // 関数定義やクラス定義を検索
  const functionMatch = currentLine.match(/(?:function|fun)\s+(\w+)/);
  const classMatch = currentLine.match(/class\s+(\w+)/);
  
  if (functionMatch || classMatch) {
    return {
      uri: document.uri,
      range: {
        start: { line: position.line, character: 0 },
        end: { line: position.line, character: currentLine.length }
      }
    };
  }
  
  return null;
}

// 参照の検索
function findReferences(document, position) {
  // 簡易的な参照検索
  const text = document.getText();
  const lines = text.split('\n');
  const currentLine = lines[position.line] || '';
  
  // 現在の行のシンボルを抽出
  const symbolMatch = currentLine.match(/\b(\w+)\b/);
  if (symbolMatch) {
    const symbol = symbolMatch[1];
    const references = [];
    
    // 同じファイル内でシンボルを検索
    lines.forEach((line, index) => {
      if (line.includes(symbol)) {
        references.push({
          uri: document.uri,
          range: {
            start: { line: index, character: line.indexOf(symbol) },
            end: { line: index, character: line.indexOf(symbol) + symbol.length }
          }
        });
      }
    });
    
    return references;
  }
  
  return [];
}

// ホバー情報の生成
function generateHoverInfo(document, position) {
  const text = document.getText();
  const lines = text.split('\n');
  const currentLine = lines[position.line] || '';
  
  // 簡易的なホバー情報
  return {
    contents: {
      kind: 'markdown',
      value: `**${currentLine.trim()}**\n\nファイル: ${path.basename(document.uri)}\n行: ${position.line + 1}`
    }
  };
}

// コードアクションの生成
function generateCodeActions(document, params) {
  const actions = [];
  
  // クイックフィックスの例
  actions.push({
    title: 'Add missing import',
    kind: 'quickfix',
    edit: {
      changes: {
        [document.uri]: [{
          range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
          newText: 'import React from "react";\n'
        }]
      }
    }
  });
  
  return actions;
}

// ドキュメントのフォーマット
function formatDocument(document, params) {
  const text = document.getText();
  const lines = text.split('\n');
  const formattedLines = lines.map(line => line.trim());
  
  return [{
    range: {
      start: { line: 0, character: 0 },
      end: { line: lines.length - 1, character: lines[lines.length - 1].length }
    },
    newText: formattedLines.join('\n')
  }];
}

// リネームの実行
function performRename(document, params) {
  const text = document.getText();
  const lines = text.split('\n');
  const currentLine = lines[params.position.line] || '';
  
  // 現在のシンボルを抽出
  const symbolMatch = currentLine.match(/\b(\w+)\b/);
  if (symbolMatch) {
    const oldSymbol = symbolMatch[1];
    const newSymbol = params.newName;
    
    // リネームの変更を生成
    const changes = [];
    lines.forEach((line, index) => {
      if (line.includes(oldSymbol)) {
        changes.push({
          range: {
            start: { line: index, character: line.indexOf(oldSymbol) },
            end: { line: index, character: line.indexOf(oldSymbol) + oldSymbol.length }
          },
          newText: newSymbol
        });
      }
    });
    
    return {
      changes: {
        [document.uri]: changes
      }
    };
  }
  
  return null;
}

// テキストドキュメントの検証
function validateTextDocument(textDocument) {
  const diagnostics = [];
  const text = textDocument.getText();
  const lines = text.split('\n');
  
  // 簡易的な構文チェック
  lines.forEach((line, index) => {
    // 未閉じの括弧チェック
    const openBrackets = (line.match(/[\(\[\{]/g) || []).length;
    const closeBrackets = (line.match(/[\)\]\}]/g) || []).length;
    
    if (openBrackets !== closeBrackets) {
      diagnostics.push({
        severity: 2, // Warning
        range: {
          start: { line: index, character: 0 },
          end: { line: index, character: line.length }
        },
        message: 'Unmatched brackets',
        source: 'language-server'
      });
    }
  });
  
  // 診断情報を送信
  connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}

// ドキュメントの監視を開始
documents.listen(connection);

// 接続をリッスン
connection.listen();

console.log('Language Server started on port 8081');
