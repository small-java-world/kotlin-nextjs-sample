package com.tsumiki

import com.tsumiki.controller.HomeController
import com.tsumiki.dto.FeatureDto
import com.tsumiki.dto.HomeContentDto
import com.tsumiki.service.HomeService
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import io.mockk.every
import io.mockk.mockk
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*
import org.springframework.test.web.servlet.setup.MockMvcBuilders

/**
 * HomeControllerのテスト
 */
class HomeControllerTest : FunSpec({

    lateinit var mockMvc: MockMvc
    lateinit var homeService: HomeService
    lateinit var homeController: HomeController

    beforeEach {
        homeService = mockk()
        homeController = HomeController(homeService)
        mockMvc = MockMvcBuilders.standaloneSetup(homeController).build()
    }

    test("GET /api/home/content should return home content") {
        // Given
        val expectedContent = HomeContentDto(
            title = "Test Title",
            subtitle = "Test Subtitle",
            description = "Test Description",
            features = listOf(
                FeatureDto(
                    id = "test-feature",
                    title = "Test Feature",
                    description = "Test Feature Description",
                    icon = "🎯"
                )
            ),
            generatedAt = "2024-01-01T00:00:00"
        )

        every { homeService.generateHomeContent() } returns expectedContent

        // When & Then
        mockMvc.perform(get("/api/home/content"))
            .andExpect(status().isOk)
            .andExpect(content().contentType("application/json"))
            .andExpect(jsonPath("$.title").value("Test Title"))
            .andExpect(jsonPath("$.subtitle").value("Test Subtitle"))
            .andExpect(jsonPath("$.description").value("Test Description"))
            .andExpect(jsonPath("$.features").isArray)
            .andExpect(jsonPath("$.features[0].id").value("test-feature"))
            .andExpect(jsonPath("$.features[0].title").value("Test Feature"))
            .andExpect(jsonPath("$.features[0].description").value("Test Feature Description"))
            .andExpect(jsonPath("$.features[0].icon").value("🎯"))
            .andExpect(jsonPath("$.generatedAt").value("2024-01-01T00:00:00"))
    }

    test("HomeController should be properly initialized") {
        homeController shouldNotBe null
    }

    test("HomeService should be injected") {
        homeController::class.java.getDeclaredField("homeService").apply {
            isAccessible = true
            get(homeController) shouldNotBe null
        }
    }
})
