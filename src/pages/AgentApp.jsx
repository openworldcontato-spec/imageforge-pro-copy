import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Loader2, Download, Sparkles, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function AgentApp() {
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);

  const urlParams = new URLSearchParams(window.location.search);
  const agentSlug = urlParams.get('slug');

  useEffect(() => {
    const loadAgent = async () => {
      if (!agentSlug) {
        setLoading(false);
        return;
      }
      try {
        const agents = await base44.entities.AIAgent.filter({ slug: agentSlug });
        if (agents.length > 0) {
          setAgent(agents[0]);
        }
      } catch (error) {
        console.error('Failed to load agent:', error);
      } finally {
        setLoading(false);
      }
    };
    loadAgent();
  }, [agentSlug]);

  const handleGenerate = async () => {
    if (!prompt.trim() || !agent) return;
    
    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const fullPrompt = `${agent.behavior_prompt}

USER REQUEST: ${prompt}

Generate exactly what the user requested following all the behavior guidelines above.`;

      const result = await base44.integrations.Core.GenerateImage({
        prompt: fullPrompt
      });
      
      setGeneratedImage(result.url);
      toast.success('Image generated!');
    } catch (error) {
      console.error('Generation failed:', error);
      toast.error('Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <ImageIcon className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Agent Not Found</h1>
          <p className="text-white/50">The requested AI agent doesn't exist.</p>
        </div>
      </div>
    );
  }

  const categoryColors = {
    realistic: 'from-blue-500 to-cyan-500',
    logo: 'from-violet-500 to-purple-500',
    product: 'from-orange-500 to-rose-500'
  };

  const gradient = categoryColors[agent.category] || 'from-violet-500 to-fuchsia-500';

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 -left-32 w-96 h-96 bg-gradient-to-br ${gradient} opacity-20 rounded-full blur-[128px]`} />
        <div className={`absolute bottom-1/4 -right-32 w-96 h-96 bg-gradient-to-br ${gradient} opacity-20 rounded-full blur-[128px]`} />
      </div>

      <div className="relative z-10 px-6 py-12 max-w-4xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${gradient} mb-6 shadow-lg`}>
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{agent.name}</h1>
          <p className="text-lg text-white/60 max-w-xl mx-auto">{agent.description}</p>
        </motion.header>

        {/* Generator Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8"
        >
          <div className="mb-6">
            <label className="block text-sm font-medium text-white/70 mb-3">
              Describe what you want to create
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your image description..."
              className="min-h-[120px] bg-black/30 border-white/10 text-white placeholder:text-white/30 rounded-xl resize-none focus:border-violet-500/50"
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className={`w-full h-14 bg-gradient-to-r ${gradient} hover:opacity-90 text-white text-lg font-medium border-0 rounded-xl disabled:opacity-50`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 mr-2" />
                Generate Image
              </>
            )}
          </Button>

          {/* Output Area */}
          {(isGenerating || generatedImage) && (
            <div className="mt-8">
              {isGenerating && !generatedImage && (
                <div className="aspect-square max-w-lg mx-auto bg-black/30 rounded-2xl border border-white/10 flex flex-col items-center justify-center">
                  <Loader2 className="w-12 h-12 text-violet-400 animate-spin mb-4" />
                  <p className="text-white/60">Creating your image...</p>
                  <p className="text-white/40 text-sm mt-1">This may take 5-10 seconds</p>
                </div>
              )}

              {generatedImage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative max-w-lg mx-auto"
                >
                  <img
                    src={generatedImage}
                    alt="Generated image"
                    className="w-full rounded-2xl border border-white/10 shadow-2xl"
                  />
                  <a
                    href={generatedImage}
                    download="generated-image.png"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-4 right-4 p-3 bg-black/60 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-black/80 transition-colors"
                  >
                    <Download className="w-5 h-5 text-white" />
                  </a>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <p className="text-center text-white/30 text-sm mt-8">
          Powered by {agent.name} • Image Generator
        </p>
      </div>
    </div>
  );
}