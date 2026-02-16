import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Sparkles, Image, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AgentConfigDisplay({ config, onReset }) {
  const [copiedField, setCopiedField] = useState(null);

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
    </motion.div>
  );
}