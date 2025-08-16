package com.tsumiki.controller

import com.tsumiki.dto.HomeContentDto
import com.tsumiki.service.HomeService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/**
 * ホーム画面のコンテンツを提供するコントローラー
 */
@RestController
@RequestMapping("/api/home")
class HomeController(
    private val homeService: HomeService
) {

    /**
     * トップ画面の静的コンテンツを取得
     */
    @GetMapping("/content")
    fun getHomeContent(): HomeContentDto {
        return homeService.generateHomeContent()
    }
}
