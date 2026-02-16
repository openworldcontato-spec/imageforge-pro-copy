import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function AgentForm({ category, onGenerate, isLoading }) {
  const [description, setDescription] = useState('');

  const categoryInfo = {
    realistic: {
      title: 'Realistic Image AI',
      placeholder: 'Describe what your AI should specialize in...\n\nExample: "A portrait photographer AI that creates stunning headshots with natural lighting, perfect for professional LinkedIn photos and actor portfolios."',
      hint: 'Think about subjects, lighting styles, moods, and use cases'
    },
    logo: {
      title: 'Logo & Branding AI',
      placeholder: 'Describe what your AI should specialize in...\n\nExample: "A tech startup logo creator that generates minimalist, geometric logos with bold colors, perfect for SaaS companies and mobile apps."',
      hint: 'Consider industries, styles, color preferences, and brand personalities'
    },
    product: {
      title: 'Product Render AI',
      placeholder: 'Describe what your AI should specialize in...\n\nExample: "A luxury watch photographer AI that creates studio-quality product shots with dramatic lighting and reflections, ideal for e-commerce and catalogs."',
      hint: 'Think about product types, backgrounds, lighting, and commercial contexts'
    }
  };

  const info = categoryInfo[category];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (description.trim()) {
      onGenerate(description);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/20 border border-violet-500/30 mb-4"
        >
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-medium text-violet-300">{info.title}</span>
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">Define Your Agent</h2>
        <p className="text-white/60">{info.hint}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={info.placeholder}
            className="min-h-[200px] bg-black/30 border-white/10 text-white placeholder:text-white/30 resize-none rounded-xl focus:border-violet-500/50 focus:ring-violet-500/20"
          />
          
          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              disabled={!description.trim() || isLoading}
              className="h-12 px-8 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  Generate Agent
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}