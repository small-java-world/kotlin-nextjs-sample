FROM openjdk:17-jdk-slim

WORKDIR /app

# Gradle wrapperをコピー
COPY gradlew .
COPY gradle gradle
COPY build.gradle.kts .
COPY settings.gradle.kts .

# 依存関係をダウンロード
RUN ./gradlew dependencies --no-daemon

# ソースコードをコピー
COPY src src

# アプリケーションをビルド
RUN ./gradlew build --no-daemon

# 実行可能JARを抽出
RUN mkdir -p build/libs && \
    find . -name "*.jar" -exec cp {} build/libs/ \;

EXPOSE 8080

CMD ["java", "-jar", "build/libs/tsumiki_sample-0.0.1-SNAPSHOT.jar"]
