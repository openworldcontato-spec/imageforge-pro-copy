import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Sparkles, Image, Cpu, Wand2, Loader2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

export default function AgentConfigDisplay({ config, onReset }) {
  const [copiedField, setCopiedField] = useState(null);
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const copyAll = () => {
    const fullConfig = `Agent Name: ${config.name}

Description: ${config.description}

Capabilities: ${config.capabilities}

Model: ${config.model}

AI Behavior Prompt:
${config.behaviorPrompt}`;
    
    navigator.clipboard.writeText(fullConfig);
    toast.success('Full configuration copied!');
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }
    
    setIsGenerating(true);
    setGeneratedImage(null);
    
    try {
      const fullPrompt = `${config.behaviorPrompt}

USER REQUEST: ${imagePrompt}

Generate exactly what the user requested following all the behavior guidelines above.`;

      const result = await base44.integrations.Core.GenerateImage({
        prompt: fullPrompt
      });
      
      setGeneratedImage(result.url);
      toast.success('Image generated successfully!');
    } catch (error) {
      console.error('Image generation failed:', error);
      toast.error('Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  const ConfigSection = ({ label, value, field, large = false }) => (
    <div className="group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-violet-400 uppercase tracking-wider">{label}</span>
        <button
          onClick={() => copyToClipboard(value, field)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"
        >
          {copiedField === field ? (
            <Check className="w-3.5 h-3.5 text-green-400" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-white/50" />
          )}
        </button>
      </div>
      <div className={`bg-black/30 rounded-xl p-4 border border-white/5 ${large ? 'max-h-64 overflow-y-auto' : ''}`}>
        <p className={`text-white/90 ${large ? 'text-sm whitespace-pre-wrap' : 'text-base'}`}>{value}</p>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center"
        >
          <Sparkles className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">Agent Created Successfully</h2>
        <p className="text-white/60">Your image-generation AI agent is ready</p>
      </div>

      {/* Config Card */}
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 space-y-6">
        <ConfigSection label="Agent Name" value={config.name} field="name" />
        <ConfigSection label="Description" value={config.description} field="description" />
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black/30 rounded-xl p-4 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                <Image className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <p className="text-xs text-white/50 uppercase tracking-wider">Capabilities</p>
                <p className="text-white font-medium">{config.capabilities}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-black/30 rounded-xl p-4 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-fuchsia-500/20 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-fuchsia-400" />
              </div>
              <div>
                <p className="text-xs text-white/50 uppercase tracking-wider">Model</p>
                <p className="text-white font-medium">{config.model}</p>
              </div>
            </div>
          </div>
        </div>

        <ConfigSection 
          label="AI Behavior Prompt" 
          value={config.behaviorPrompt} 
          field="prompt" 
          large 
        />

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <Button
            onClick={copyAll}
            className="flex-1 h-12 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0 rounded-xl font-medium"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Full Configuration
          </Button>
          <Button
            onClick={onReset}
            variant="outline"
            className="h-12 px-6 bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl"
          >
            Create Another
          </Button>
        </div>
      </div>

      {/* Live Image Generation Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 backdrop-blur-xl rounded-3xl border border-violet-500/20 p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <Wand2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Test Your Agent</h3>
            <p className="text-sm text-white/50">Generate a real image using {config.name}</p>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <Input
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            className="flex-1 h-12 bg-black/30 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-violet-500/50"
            onKeyDown={(e) => e.key === 'Enter' && !isGenerating && handleGenerateImage()}
          />
          <Button
            onClick={handleGenerateImage}
            disabled={isGenerating || !imagePrompt.trim()}
            className="h-12 px-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0 rounded-xl font-medium disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Image
              </>
            )}
          </Button>
        </div>

        {/* Generated Image Display */}
        {(isGenerating || generatedImage) && (
          <div className="relative">
            {isGenerating && !generatedImage && (
              <div className="aspect-square max-w-md mx-auto bg-black/30 rounded-2xl border border-white/10 flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-violet-400 animate-spin mb-4" />
                <p className="text-white/60">Creating your image...</p>
                <p className="text-white/40 text-sm mt-1">This may take 5-10 seconds</p>
              </div>
            )}
            
            {generatedImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative max-w-md mx-auto"
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
    </motion.div>
  );
}