import { Feature } from '@/types/home'

interface FeatureCardProps {
  feature: Feature
}

export function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
      <div className="text-center">
        <div className="text-4xl mb-4">{feature.icon}</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {feature.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {feature.description}
        </p>
      </div>
    </div>
  )
}
