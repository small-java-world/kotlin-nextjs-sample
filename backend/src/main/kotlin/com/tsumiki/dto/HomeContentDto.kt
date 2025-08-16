package com.tsumiki.dto

import com.fasterxml.jackson.annotation.JsonProperty

/**
 * ホーム画面のコンテンツを表すDTO
 */
data class HomeContentDto(
    @JsonProperty("title")
    val title: String,
    
    @JsonProperty("subtitle")
    val subtitle: String,
    
    @JsonProperty("description")
    val description: String,
    
    @JsonProperty("features")
    val features: List<FeatureDto>,
    
    @JsonProperty("generatedAt")
    val generatedAt: String
)

/**
 * 機能を表すDTO
 */
data class FeatureDto(
    @JsonProperty("id")
    val id: String,
    
    @JsonProperty("title")
    val title: String,
    
    @JsonProperty("description")
    val description: String,
    
    @JsonProperty("icon")
    val icon: String
)
