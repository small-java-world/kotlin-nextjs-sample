package com.tsumiki

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class TsumikiApplication

fun main(args: Array<String>) {
    runApplication<TsumikiApplication>(*args)
}
