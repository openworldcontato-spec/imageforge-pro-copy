import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Hexagon, Box, Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import CategoryCard from '@/components/forge/CategoryCard';
import AgentForm from '@/components/forge/AgentForm';
import AgentConfigDisplay from '@/components/forge/AgentConfigDisplay';

const CATEGORIES = [
  {
    id: 'realistic',
    icon: Camera,
    title: 'Realistic Image AI',
    description: 'High-detail photographic images. Ideal for portraits, nature, products, and lifelike scenes.',
    gradient: 'bg-gradient-to-br from-blue-500 to-cyan-500'
  },
  {
    id: 'logo',
    icon: Hexagon,
    title: 'Logo & Branding AI',
    description: 'Clean, vector-style, minimalistic branding visuals. Perfect for logos, icons, and brand marks.',
    gradient: 'bg-gradient-to-br from-violet-500 to-purple-500'
  },
  {
    id: 'product',
    icon: Box,
    title: 'Product Render AI',
    description: 'Studio-quality product images. White backgrounds, dramatic lighting, commercial excellence.',
    gradient: 'bg-gradient-to-br from-orange-500 to-rose-500'
  }
];

export default function Home() {
  const [step, setStep] = useState('select'); // select, describe, result
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [generatedConfig, setGeneratedConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleContinue = () => {
    if (selectedCategory) {
      setStep('describe');
    }
  };

  const handleBack = () => {
    if (step === 'describe') {
      setStep('select');
    } else if (step === 'result') {
      setStep('describe');
    }
  };

  const handleGenerate = async (description) => {
    setIsLoading(true);
    
    const categoryNames = {
      realistic: 'Realistic Image AI',
      logo: 'Logo & Branding AI',
      product: 'Product Render AI'
    };

    const categoryBehaviors = {
      realistic: `You are a specialized Realistic Image AI agent. Your purpose is to generate high-detail, photographic-quality images.

CORE PRINCIPLES:
- Always produce photorealistic imagery with accurate lighting and shadows
- Maintain natural textures and materials
- Create proper depth of field and perspective
- Ensure anatomically correct proportions for living subjects
- Use realistic color grading and tones

QUALITY STANDARDS:
- Sharp focus on primary subjects
- Natural bokeh for backgrounds when appropriate
- Accurate environmental lighting (golden hour, studio, ambient)
- No visible artifacts, distortions, or AI hallucinations
- Consistent style across generations

INTERPRETATION RULES:
- Default to natural, documentary-style photography when style is unspecified
- Add cinematic quality for dramatic requests
- Maintain subject integrity - no surreal distortions unless explicitly requested
- Consider composition rules (rule of thirds, leading lines, framing)`,

      logo: `You are a specialized Logo & Branding AI agent. Your purpose is to generate clean, professional, vector-style branding visuals.

CORE PRINCIPLES:
- Produce clean, sharp geometric shapes
- Maintain vector-like quality with crisp edges
- Use minimalist compositions with purposeful negative space
- Ensure high contrast and readability at all sizes
- Create scalable designs that work from favicon to billboard

QUALITY STANDARDS:
- No gradients unless specifically requested
- Limited color palettes (2-4 colors maximum)
- Perfect symmetry when applicable
- No photorealistic elements unless explicitly requested
- Text integration must be clean and balanced

INTERPRETATION RULES:
- Default to modern, minimal aesthetics
- Consider brand personality in shape language
- Circular/rounded for friendly brands, angular for bold/tech brands
- Always ensure the design is memorable and distinctive
- Create logos that work in both color and monochrome`,

      product: `You are a specialized Product Render AI agent. Your purpose is to generate studio-quality commercial product images.

CORE PRINCIPLES:
- Create clean, distraction-free compositions
- Use professional studio lighting setups
- Maintain white or neutral gradient backgrounds
- Ensure products are the absolute focal point
- Produce e-commerce and catalog-ready imagery

QUALITY STANDARDS:
- Sharp edge definition on all products
- Professional three-point lighting or dramatic accent lighting
- Subtle shadows and reflections for grounding
- No environmental clutter or distracting elements
- Color-accurate product representation

INTERPRETATION RULES:
- Default to clean white background unless specified
- Add lifestyle context only when explicitly requested
- Use hero angles that showcase product best features
- Consider material properties (matte, glossy, metallic, transparent)
- Multiple products should be arranged with commercial precision`
    };

    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are creating an image-generation AI agent configuration.

Category: ${categoryNames[selectedCategory]}
User's Description: ${description}

Generate a complete agent configuration with these exact fields:

1. Agent Name - A short, professional, creative name (2-4 words max)
2. Description - A clear explanation of what this agent does (2-3 sentences)
3. AI Behavior Prompt - A detailed behavior guide combining the base behavior below with the user's specialization

BASE BEHAVIOR FOR THIS CATEGORY:
${categoryBehaviors[selectedCategory]}

SPECIALIZATION FROM USER:
${description}

Create a comprehensive AI Behavior Prompt that:
- Incorporates the base category behaviors
- Adds specific rules for the user's described specialization
- Includes quality guidelines specific to the use case
- Provides interpretation rules for ambiguous prompts
- Is detailed and professional (at least 300 words)`,
        response_json_schema: {
          type: 'object',
          properties: {
            agentName: { type: 'string' },
            description: { type: 'string' },
            behaviorPrompt: { type: 'string' }
          },
          required: ['agentName', 'description', 'behaviorPrompt']
        }
      });

      setGeneratedConfig({
        name: result.agentName,
        description: result.description,
        capabilities: 'Image Generator',
        model: 'Best for Images',
        behaviorPrompt: result.behaviorPrompt
      });
      setStep('result');
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStep('select');
    setSelectedCategory(null);
    setGeneratedConfig(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-violet-600/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-900/10 rounded-full blur-[200px]" />
      </div>

      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '64px 64px'
        }}
      />

      <div className="relative z-10 px-6 py-12 md:py-20">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 mb-6 shadow-lg shadow-violet-500/25">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            ImageForge Pro
          </h1>
          <p className="text-lg text-white/60 max-w-xl mx-auto">
            Create specialized AI agents for image generation. Define the perfect visual creator for your needs.
          </p>
        </motion.header>

        {/* Back button */}
        <AnimatePresence>
          {step !== 'select' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto mb-8"
            >
              <Button
                onClick={handleBack}
                variant="ghost"
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content */}
        <AnimatePresence mode="wait">
          {step === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-10">
                <h2 className="text-2xl font-semibold text-white mb-2">Choose Specialization</h2>
                <p className="text-white/50">Select the type of image AI you want to create</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-10">
                {CATEGORIES.map((category) => (
                  <CategoryCard
                    key={category.id}
                    icon={category.icon}
                    title={category.title}
                    description={category.description}
                    gradient={category.gradient}
                    selected={selectedCategory === category.id}
                    onClick={() => handleCategorySelect(category.id)}
                  />
                ))}
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={handleContinue}
                  disabled={!selectedCategory}
                  className="h-14 px-10 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-lg font-medium border-0 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'describe' && (
            <motion.div
              key="describe"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AgentForm
                category={selectedCategory}
                onGenerate={handleGenerate}
                isLoading={isLoading}
              />
            </motion.div>
          )}

          {step === 'result' && generatedConfig && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AgentConfigDisplay
                config={generatedConfig}
                onReset={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}