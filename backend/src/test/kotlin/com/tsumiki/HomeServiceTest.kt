package com.tsumiki

import com.tsumiki.service.HomeService
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe

/**
 * HomeServiceのテスト
 */
class HomeServiceTest : FunSpec({

    lateinit var homeService: HomeService

    beforeEach {
        homeService = HomeService()
    }

    test("generateHomeContent should return valid home content") {
        // When
        val result = homeService.generateHomeContent()

        // Then
        result shouldNotBe null
        result.title shouldBe "Tsumiki Sample App"
        result.subtitle shouldBe "Kotlin + Next.js アプリケーション"
        result.features shouldNotBe null
        result.features.size shouldBe 4
        result.generatedAt shouldNotBe null
    }

    test("features should contain expected items") {
        // When
        val result = homeService.generateHomeContent()

        // Then
        val featureIds = result.features.map { it.id }
        featureIds.size shouldBe 4

        val kotlinBackend = result.features.find { it.id == "kotlin-backend" }
        kotlinBackend shouldNotBe null
        kotlinBackend!!.title shouldBe "Kotlin Backend"
        kotlinBackend.icon shouldBe "⚡"

        val nextjsFrontend = result.features.find { it.id == "nextjs-frontend" }
        nextjsFrontend shouldNotBe null
        nextjsFrontend!!.title shouldBe "Next.js Frontend"
        nextjsFrontend.icon shouldBe "🚀"

        val dockerSupport = result.features.find { it.id == "docker-support" }
        dockerSupport shouldNotBe null
        dockerSupport!!.title shouldBe "Docker Support"
        dockerSupport.icon shouldBe "🐳"

        val testing = result.features.find { it.id == "testing" }
        testing shouldNotBe null
        testing!!.title shouldBe "Testing"
        testing.icon shouldBe "🧪"
    }


})
