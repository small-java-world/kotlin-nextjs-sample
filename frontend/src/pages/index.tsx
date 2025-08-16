import Head from 'next/head'
import { useState, useEffect } from 'react'

export default function HomePage() {
  const [currentTime, setCurrentTime] = useState<string>('')

  useEffect(() => {
    setCurrentTime(new Date().toLocaleString('ja-JP'))
  }, [])

  return (
    <>
      <Head>
        <title>Tsumiki Sample App</title>
        <meta name="description" content="Kotlin + Next.js アプリケーション" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Tsumiki Sample App
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Kotlin + Next.js アプリケーション
            </p>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Docker ComposeとDevContainerで起動できる、KotlinバックエンドとNext.jsフロントエンドのサンプルアプリケーションです。
            </p>
          </header>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
              主な機能
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
                <div className="text-center">
                  <div className="text-4xl mb-4">⚡</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Kotlin Backend
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Spring Boot + Kotlinで構築された高性能なバックエンドAPI
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
                <div className="text-center">
                  <div className="text-4xl mb-4">🚀</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Next.js Frontend
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    React + Next.jsで構築されたモダンなフロントエンド
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
                <div className="text-center">
                  <div className="text-4xl mb-4">🐳</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Docker Support
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Docker ComposeとDevContainerで簡単な開発環境
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
                <div className="text-center">
                  <div className="text-4xl mb-4">🧪</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Testing
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Kotest + Vitestによる包括的なテスト環境
                  </p>
                </div>
              </div>
            </div>
          </section>

          <footer className="text-center text-gray-500 text-sm">
            <p>生成時刻: {currentTime || '読み込み中...'}</p>
          </footer>
        </div>
      </div>
    </>
  )
}
