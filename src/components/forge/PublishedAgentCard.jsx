import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Camera, Hexagon, Box, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createPageUrl } from '@/utils';

export default function PublishedAgentCard({ agent, onDelete }) {
  const categoryIcons = {
    realistic: Camera,
    logo: Hexagon,
    product: Box
  };

  const categoryColors = {
    realistic: 'from-blue-500 to-cyan-500',
    logo: 'from-violet-500 to-purple-500',
    product: 'from-orange-500 to-rose-500'
  };

  const categoryNames = {
    realistic: 'Imagem Realista',
    logo: 'Logo e Branding',
    product: 'Render de Produto'
  };

  const Icon = categoryIcons[agent.category] || Camera;
  const gradient = categoryColors[agent.category] || 'from-violet-500 to-fuchsia-500';

  const appUrl = createPageUrl('AgentApp') + `?slug=${agent.slug}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
          Publicado
        </Badge>
      </div>

      <h3 className="text-lg font-semibold text-white mb-2">{agent.name}</h3>
      <p className="text-sm text-white/50 mb-4 line-clamp-2">{agent.description}</p>
      
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="outline" className="text-white/60 border-white/20">
          {categoryNames[agent.category]}
        </Badge>
      </div>

      <div className="flex gap-2">
        <Button
          asChild
          className={`flex-1 h-10 bg-gradient-to-r ${gradient} hover:opacity-90 text-white border-0 rounded-xl text-sm`}
        >
          <a href={appUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 mr-2" />
            Abrir App
          </a>
        </Button>
        <Button
          onClick={() => onDelete(agent.id)}
          variant="outline"
          className="h-10 px-3 bg-white/5 border-white/10 hover:bg-red-500/20 hover:border-red-500/30 text-white/60 hover:text-red-400 rounded-xl"
          aria-label="Excluir app publicado"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
