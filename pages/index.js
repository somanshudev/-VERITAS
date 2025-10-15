import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Zap, 
  CheckCircle, 
  Upload, 
  ArrowRight, 
  Building2, 
  FileText, 
  Camera, 
  Users,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import ICChipLogo from '../components/ICChipLogo';
import AnimatedBackground from '../components/AnimatedBackground';

export default function Home() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  const phases = [
    {
      id: 1,
      title: 'Manufacturer Registration',
      subtitle: 'One-Time Setup & Onboarding',
      icon: Building2,
      color: 'from-blue-500 to-blue-600',
      description: 'Secure registration and BHEL approval process for trusted manufacturers',
      features: [
        'Secure manufacturer portal registration',
        'BHEL manager verification & approval',
        'Trusted entity certification',
        'Credential validation system'
      ]
    },
    {
      id: 2,
      title: 'Pre-Inspection Setup',
      subtitle: 'Golden Reference Upload',
      icon: FileText,
      color: 'from-green-500 to-green-600',
      description: 'Manufacturers upload marking data before shipping IC batches',
      features: [
        'Golden reference data upload',
        'Purchase Order (PO) linking',
        'Batch-specific marking data',
        'Operator job configuration'
      ]
    },
    {
      id: 3,
      title: 'Automated Inspection',
      subtitle: 'Real-Time Scanning & Sorting',
      icon: Camera,
      color: 'from-purple-500 to-purple-600',
      description: 'Machine automatically scans and sorts ICs based on marking verification',
      features: [
        'Automated IC feeding system',
        'High-resolution camera scanning',
        'Instant marking comparison',
        'Physical sorting into PASS/FAIL bins'
      ]
    },
    {
      id: 4,
      title: 'QA Team Review',
      subtitle: 'Expert Verification & Reporting',
      icon: Users,
      color: 'from-orange-500 to-orange-600',
      description: 'Quality assurance team reviews failed components and generates reports',
      features: [
        'Detailed comparison interface',
        'Expert decision making',
        'Counterfeit identification',
        'Supplier performance tracking'
      ]
    }
  ];

  useEffect(() => {
    if (!isAnimating) return;
    
    const interval = setInterval(() => {
      setCurrentPhase((prev) => (prev + 1) % phases.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAnimating, phases.length]);

  const quickActions = [
    {
      title: 'Manufacturer Portal',
      description: 'Register and upload golden reference data',
      icon: Building2,
      href: '/manufacturer',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'Scanning Interface',
      description: 'Start automated inspection process',
      icon: Camera,
      href: '/operator',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'Quality Control',
      description: 'Review and verify failed components',
      icon: Users,
      href: '/qa',
      color: 'bg-purple-600 hover:bg-purple-700'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Animated IC Chip */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden min-h-screen flex items-center">
        {/* Enhanced Animated Background */}
        <AnimatedBackground variant="home" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <ICChipLogo className="h-20 w-20" animate={true} />
                <div>
                  <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                    VERITAS
                  </h1>
                  <p className="text-xl text-blue-200 mt-2">
                    Verification Engine for Reliable Integrated Circuits
                  </p>
                  <p className="text-lg text-blue-300 mt-1">
                    & Trusted Assembly Systems
                  </p>
                </div>
              </div>
              
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl">
                Comprehensive 4-phase workflow to detect counterfeit integrated circuits 
                and protect your supply chain with AI-powered verification technology.
              </p>
              
              {/* Quick Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                {quickActions.map((action, index) => (
                  <Link 
                    key={index}
                    href={action.href} 
                    className={`inline-flex items-center justify-center gap-2 px-6 py-4 ${action.color} text-white rounded-xl font-semibold hover:scale-105 transform transition-all duration-200 shadow-lg`}
                  >
                    <action.icon className="h-5 w-5" />
                    <span className="hidden sm:inline">{action.title}</span>
                    <span className="sm:hidden">{action.title.split(' ')[0]}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right side - Animated Phase Display */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                {/* Phase Controls */}
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Workflow Phases</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsAnimating(!isAnimating)}
                      className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                    >
                      {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => setCurrentPhase(0)}
                      className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Phase Indicators */}
                <div className="flex justify-between mb-6">
                  {phases.map((phase, index) => (
                    <button
                      key={phase.id}
                      onClick={() => setCurrentPhase(index)}
                      className={`flex flex-col items-center gap-2 p-2 rounded-lg transition-all duration-300 ${
                        currentPhase === index ? 'bg-white/20 scale-110' : 'hover:bg-white/10'
                      }`}
                    >
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${phase.color} ${
                        currentPhase === index ? 'animate-pulse' : ''
                      }`}>
                        <phase.icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-xs text-center">{phase.id}</span>
                    </button>
                  ))}
                </div>

                {/* Current Phase Content */}
                <div className="space-y-4 min-h-[200px]">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${phases[currentPhase].color}`}>
                      {React.createElement(phases[currentPhase].icon, { className: "h-6 w-6 text-white" })}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold">{phases[currentPhase].title}</h4>
                      <p className="text-blue-200 text-sm">{phases[currentPhase].subtitle}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300">{phases[currentPhase].description}</p>
                  
                  <ul className="space-y-2">
                    {phases[currentPhase].features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Overview Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Complete Verification Workflow
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From manufacturer registration to final quality assurance, 
              our system ensures comprehensive IC authenticity verification.
            </p>
          </div>

          {/* Phase Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {phases.map((phase, index) => (
              <div 
                key={phase.id}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-l-4 border-transparent hover:border-blue-500 group"
              >
                {/* Phase Number */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold text-gray-300 group-hover:text-blue-500 transition-colors">
                    {phase.id.toString().padStart(2, '0')}
                  </span>
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${phase.color} group-hover:scale-110 transition-transform`}>
                    <phase.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {phase.title}
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  {phase.subtitle}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {phase.description}
                </p>

                {/* Arrow for flow */}
                {index < phases.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ICChipLogo className="h-16 w-16 mx-auto mb-6" animate={true} />
          <h2 className="text-4xl font-bold mb-4">
            Ready to Secure Your Supply Chain?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join VERITAS - BHEL's advanced verification system and protect your operations 
            from counterfeit components with cutting-edge technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/manufacturer" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-blue-50 hover:scale-105 transform transition-all duration-200 shadow-lg"
            >
              <Building2 className="h-5 w-5" />
              Manufacturer Portal
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link 
              href="/admin" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-200"
            >
              Admin Access
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
