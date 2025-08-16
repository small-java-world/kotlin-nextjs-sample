package com.tsumiki.service

import com.tsumiki.dto.FeatureDto
import com.tsumiki.dto.HomeContentDto
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

/**
 * ホーム画面のコンテンツを生成するサービス
 */
@Service
class HomeService {

    /**
     * ホーム画面の静的コンテンツを生成
     */
    fun generateHomeContent(): HomeContentDto {
        val features = listOf(
            FeatureDto(
                id = "kotlin-backend",
                title = "Kotlin Backend",
                description = "Spring Boot + Kotlinで構築された高性能なバックエンドAPI",
                icon = "⚡"
            ),
            FeatureDto(
                id = "nextjs-frontend",
                title = "Next.js Frontend",
                description = "React + Next.jsで構築されたモダンなフロントエンド",
                icon = "🚀"
            ),
            FeatureDto(
                id = "docker-support",
                title = "Docker Support",
                description = "Docker ComposeとDevContainerで簡単な開発環境",
                icon = "🐳"
            ),
            FeatureDto(
                id = "testing",
                title = "Testing",
                description = "Kotest + Vitestによる包括的なテスト環境",
                icon = "🧪"
            )
        )

        return HomeContentDto(
            title = "Tsumiki Sample App",
            subtitle = "Kotlin + Next.js アプリケーション",
            description = "Docker ComposeとDevContainerで起動できる、KotlinバックエンドとNext.jsフロントエンドのサンプルアプリケーションです。",
            features = features,
            generatedAt = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
        )
    }
}
