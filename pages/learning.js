import { CheckCircle, XCircle, AlertTriangle, BookOpen, Lightbulb, Eye, Microscope } from 'lucide-react';

export default function Learning() {
  const comparisonFeatures = [
    {
      feature: 'Logo Quality',
      authentic: 'Sharp, clear, and well-defined edges',
      counterfeit: 'Blurry, pixelated, or poorly reproduced',
    },
    {
      feature: 'Font Style',
      authentic: 'Consistent, professional typography',
      counterfeit: 'Irregular spacing, wrong font family',
    },
    {
      feature: 'Print Quality',
      authentic: 'Laser-etched or high-quality printing',
      counterfeit: 'Ink-based, smudged, or uneven',
    },
    {
      feature: 'Date Codes',
      authentic: 'Follows manufacturer format standards',
      counterfeit: 'Invalid format or inconsistent placement',
    },
    {
      feature: 'Surface Finish',
      authentic: 'Uniform, professional finish',
      counterfeit: 'Rough, scratched, or re-marked surface',
    },
    {
      feature: 'Package Dimensions',
      authentic: 'Precise measurements per datasheet',
      counterfeit: 'Slight variations in size or shape',
    },
  ];

  const warningsSigns = [
    {
      icon: AlertTriangle,
      title: 'Pricing Too Good to Be True',
      description: 'Significantly lower prices than authorized distributors may indicate counterfeit parts.',
    },
    {
      icon: Eye,
      title: 'Visual Inconsistencies',
      description: 'Misaligned text, poor print quality, or unusual markings are red flags.',
    },
    {
      icon: Microscope,
      title: 'Surface Irregularities',
      description: 'Signs of sanding, re-marking, or blacktopping indicate tampering.',
    },
    {
      icon: XCircle,
      title: 'Unverified Suppliers',
      description: 'Always purchase from authorized distributors or verified sources.',
    },
  ];

  const bestPractices = [
    'Always verify IC markings before accepting shipments',
    'Maintain relationships with authorized distributors',
    'Document and report suspicious components',
    'Implement incoming quality inspection procedures',
    'Train staff to recognize counterfeit indicators',
    'Use automated verification tools for high-volume operations',
    'Keep records of all verification results',
    'Stay updated on manufacturer anti-counterfeiting measures',
  ];

  return (
    <div className="min-h-screen bg-tech-light py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <BookOpen className="h-16 w-16 text-primary-600" />
          </div>
          <h1 className="section-title">Learning Center</h1>
          <p className="section-subtitle">
            Learn to identify authentic vs counterfeit IC markings
          </p>
        </div>

        {/* Introduction */}
        <div className="card mb-12 bg-gradient-to-r from-primary-50 to-blue-50 border-2 border-primary-200">
          <div className="flex items-start gap-4">
            <Lightbulb className="h-8 w-8 text-primary-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-3 text-primary-900">
                Why IC Verification Matters
              </h2>
              <p className="text-tech-gray leading-relaxed mb-3">
                Counterfeit integrated circuits pose serious risks to electronic systems, including 
                reduced reliability, safety hazards, and potential system failures. The global 
                semiconductor industry loses billions annually to counterfeit components.
              </p>
              <p className="text-tech-gray leading-relaxed">
                Understanding how to identify authentic IC markings is crucial for maintaining 
                supply chain integrity and ensuring product quality.
              </p>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Authentic vs Counterfeit Comparison</h2>
          <div className="card overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-tech-dark">Feature</th>
                    <th className="px-6 py-4 text-left font-semibold text-green-700">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Authentic
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-red-700">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-5 w-5" />
                        Counterfeit
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {comparisonFeatures.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-tech-dark">
                        {item.feature}
                      </td>
                      <td className="px-6 py-4 text-tech-gray bg-green-50/50">
                        {item.authentic}
                      </td>
                      <td className="px-6 py-4 text-tech-gray bg-red-50/50">
                        {item.counterfeit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Warning Signs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Warning Signs of Counterfeit ICs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {warningsSigns.map((warning, index) => (
              <div key={index} className="card border-l-4 border-yellow-500">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <warning.icon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{warning.title}</h3>
                    <p className="text-tech-gray">{warning.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Examples Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Visual Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Authentic Example */}
            <div className="card border-2 border-green-200">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <h3 className="text-xl font-semibold text-green-700">Authentic IC</h3>
              </div>
              <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center text-gray-500">
                  <Microscope className="h-16 w-16 mx-auto mb-2" />
                  <p className="text-sm">High-quality marking example</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Sharp, laser-etched markings</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Consistent font and spacing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Clear manufacturer logo</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Proper date code format</span>
                </li>
              </ul>
            </div>

            {/* Counterfeit Example */}
            <div className="card border-2 border-red-200">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="h-6 w-6 text-red-600" />
                <h3 className="text-xl font-semibold text-red-700">Counterfeit IC</h3>
              </div>
              <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center text-gray-500">
                  <AlertTriangle className="h-16 w-16 mx-auto mb-2" />
                  <p className="text-sm">Poor quality marking example</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Blurry or ink-based printing</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Irregular spacing and alignment</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Distorted or missing logo</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Invalid or inconsistent codes</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Best Practices */}
        <div className="card bg-primary-50 border-2 border-primary-200">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <CheckCircle className="h-7 w-7 text-primary-600" />
            Best Practices for IC Verification
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bestPractices.map((practice, index) => (
              <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-lg">
                <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  {index + 1}
                </div>
                <p className="text-tech-gray">{practice}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
