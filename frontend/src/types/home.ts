export interface Feature {
  id: string
  title: string
  description: string
  icon: string
}

export interface HomeContent {
  title: string
  subtitle: string
  description: string
  features: Feature[]
  generatedAt: string
}
