import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Hexagon, Box, Sparkles, ArrowLeft, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import CategoryCard from '@/components/forge/CategoryCard';
import AgentForm from '@/components/forge/AgentForm';
import AgentConfigDisplay from '@/components/forge/AgentConfigDisplay';
import PublishedAgentCard from '@/components/forge/PublishedAgentCard';

const CATEGORIES = [
  {
    id: 'realistic',
    icon: Camera,
    title: 'IA de Imagens Realistas',
    description: 'Imagens fotográficas com alto nível de detalhe. Ideal para retratos, natureza, produtos e cenas realistas.',
    gradient: 'bg-gradient-to-br from-blue-500 to-cyan-500'
  },
  {
    id: 'logo',
    icon: Hexagon,
    title: 'IA para Logo e Branding',
    description: 'Visuais limpos, vetoriais e minimalistas para marcas. Perfeito para logos, ícones e identidade visual.',
    gradient: 'bg-gradient-to-br from-violet-500 to-purple-500'
  },
  {
    id: 'product',
    icon: Box,
    title: 'IA para Render de Produto',
    description: 'Imagens comerciais de produto com qualidade de estúdio, fundos limpos, iluminação forte e acabamento profissional.',
    gradient: 'bg-gradient-to-br from-orange-500 to-rose-500'
  }
];

export default function Home() {
  const [step, setStep] = useState('select');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [generatedConfig, setGeneratedConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [publishedAgents, setPublishedAgents] = useState([]);
  const [showPublished, setShowPublished] = useState(false);

  useEffect(() => {
    loadPublishedAgents();
  }, []);

  const loadPublishedAgents = async () => {
    try {
      const agents = await base44.entities.AIAgent.list('-created_date');
      setPublishedAgents(agents);
    } catch (error) {
      console.error('Falha ao carregar agentes:', error);
    }
  };

  const handleDeleteAgent = async (id) => {
    try {
      await base44.entities.AIAgent.delete(id);
      setPublishedAgents(prev => prev.filter(a => a.id !== id));
      toast.success('Agente excluído');
    } catch (error) {
      console.error('Falha ao excluir agente:', error);
      toast.error('Não foi possível excluir o agente');
    }
  };

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
      realistic: 'IA de Imagens Realistas',
      logo: 'IA para Logo e Branding',
      product: 'IA para Render de Produto'
    };

    const categoryBehaviors = {
      realistic: `Você é um agente especializado em IA de Imagens Realistas. Seu objetivo é gerar imagens com qualidade fotográfica, alto nível de detalhe e aparência natural.

PRINCÍPIOS CENTRAIS:
- Sempre produza imagens fotorrealistas com iluminação e sombras coerentes
- Mantenha texturas e materiais naturais
- Crie profundidade de campo, perspectiva e enquadramento corretos
- Garanta proporções anatômicas corretas para pessoas, animais e seres vivos
- Use gradação de cor realista e tons naturais

PADRÕES DE QUALIDADE:
- Foco nítido nos elementos principais
- Bokeh natural em fundos quando fizer sentido
- Iluminação ambiental precisa, como golden hour, estúdio ou luz natural
- Sem artefatos visíveis, distorções ou alucinações de IA
- Estilo consistente entre gerações

REGRAS DE INTERPRETAÇÃO:
- Quando o estilo não for especificado, use fotografia natural e documental
- Adicione qualidade cinematográfica em pedidos dramáticos
- Preserve a integridade do assunto, sem distorções surreais, a menos que o usuário peça
- Considere regras de composição, como regra dos terços, linhas guia e enquadramento`,

      logo: `Você é um agente especializado em IA para Logo e Branding. Seu objetivo é gerar visuais de marca limpos, profissionais e com aparência vetorial.

PRINCÍPIOS CENTRAIS:
- Produza formas geométricas limpas e bem definidas
- Mantenha qualidade semelhante a vetor, com bordas nítidas
- Use composições minimalistas com espaço negativo intencional
- Garanta alto contraste e boa leitura em qualquer tamanho
- Crie designs escaláveis, do favicon ao outdoor

PADRÕES DE QUALIDADE:
- Evite gradientes, salvo quando forem solicitados
- Use paletas limitadas, com no máximo 2 a 4 cores
- Aplique simetria perfeita quando fizer sentido
- Evite elementos fotorrealistas, salvo quando forem solicitados
- Integração de texto precisa ser limpa, equilibrada e legível

REGRAS DE INTERPRETAÇÃO:
- Quando o estilo não for especificado, use estética moderna e minimalista
- Considere a personalidade da marca na linguagem das formas
- Use formas circulares e arredondadas para marcas amigáveis; formas angulares para marcas ousadas ou tecnológicas
- Garanta que o design seja memorável e distintivo
- Crie logos que funcionem tanto coloridos quanto monocromáticos`,

      product: `Você é um agente especializado em IA para Render de Produto. Seu objetivo é gerar imagens comerciais de produto com qualidade de estúdio.

PRINCÍPIOS CENTRAIS:
- Crie composições limpas, sem distrações
- Use iluminação profissional de estúdio
- Mantenha fundos brancos ou gradientes neutros
- Garanta que o produto seja o foco absoluto da imagem
- Produza imagens prontas para e-commerce, catálogo e anúncios

PADRÕES DE QUALIDADE:
- Bordas nítidas em todos os produtos
- Iluminação profissional, com três pontos de luz ou acentos dramáticos
- Sombras e reflexos sutis para dar presença ao produto
- Sem poluição visual ou elementos que distraiam
- Representação fiel de cores, materiais e acabamento

REGRAS DE INTERPRETAÇÃO:
- Quando o fundo não for especificado, use fundo branco limpo
- Adicione contexto lifestyle apenas quando for solicitado
- Use ângulos hero que valorizem os melhores atributos do produto
- Considere propriedades de material: fosco, brilhante, metálico, transparente
- Em cenas com múltiplos produtos, organize tudo com precisão comercial`
    };

    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Você está criando a configuração de um agente de IA para geração de imagens.

Categoria: ${categoryNames[selectedCategory]}
Descrição do usuário: ${description}

Gere uma configuração completa em português do Brasil com estes campos exatos:

1. Nome do Agente - Nome curto, profissional e criativo, com no máximo 2 a 4 palavras
2. Descrição - Explicação clara do que o agente faz, em 2 a 3 frases
3. Prompt de Comportamento da IA - Guia detalhado de comportamento combinando a base abaixo com a especialização do usuário

COMPORTAMENTO BASE DESTA CATEGORIA:
${categoryBehaviors[selectedCategory]}

ESPECIALIZAÇÃO INFORMADA PELO USUÁRIO:
${description}

Crie um Prompt de Comportamento da IA que:
- Incorpore os comportamentos base da categoria
- Adicione regras específicas para a especialização descrita pelo usuário
- Inclua diretrizes de qualidade específicas para o caso de uso
- Forneça regras de interpretação para prompts ambíguos
- Seja detalhado, profissional e escrito em português do Brasil, com pelo menos 300 palavras`,
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

      const newConfig = {
        name: result.agentName,
        description: result.description,
        capabilities: 'Gerador de Imagens',
        model: 'Otimizado para Imagens',
        behaviorPrompt: result.behaviorPrompt,
        category: selectedCategory
      };
      setGeneratedConfig(newConfig);
      setStep('result');
    } catch (error) {
      console.error('Falha ao gerar configuração:', error);
      toast.error('Não foi possível gerar o agente');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStep('select');
    setSelectedCategory(null);
    setGeneratedConfig(null);
    loadPublishedAgents();
  };

  const handlePublish = async (config) => {
    const slug = config.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    try {
      await base44.entities.AIAgent.create({
        name: config.name,
        slug: slug,
        category: config.category,
        description: config.description,
        behavior_prompt: config.behaviorPrompt,
        is_published: true
      });
      
      toast.success('Agente publicado com sucesso!');
      loadPublishedAgents();
      return slug;
    } catch (error) {
      console.error('Falha ao publicar:', error);
      toast.error('Não foi possível publicar o agente');
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Efeitos de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-violet-600/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-900/10 rounded-full blur-[200px]" />
      </div>

      {/* Grade visual */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '64px 64px'
        }}
      />

      <div className="relative z-10 px-6 py-12 md:py-20">
        {/* Cabeçalho */}
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
            Crie agentes de IA especializados em geração de imagens. Defina o criador visual perfeito para o seu projeto.
          </p>
          
          {publishedAgents.length > 0 && step === 'select' && (
            <Button
              onClick={() => setShowPublished(!showPublished)}
              variant="outline"
              className="mt-6 bg-white/5 border-white/20 text-white hover:bg-white/10"
            >
              <Layers className="w-4 h-4 mr-2" />
              {showPublished ? 'Ocultar' : 'Ver'} Apps Publicados ({publishedAgents.length})
            </Button>
          )}
        </motion.header>
        
        {/* Apps publicados */}
        <AnimatePresence>
          {showPublished && step === 'select' && publishedAgents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-4xl mx-auto mb-12"
            >
              <h2 className="text-xl font-semibold text-white mb-6">Seus Apps de IA Publicados</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {publishedAgents.map((agent) => (
                  <PublishedAgentCard 
                    key={agent.id} 
                    agent={agent} 
                    onDelete={handleDeleteAgent}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botão voltar */}
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
                Voltar
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Conteúdo principal */}
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
                <h2 className="text-2xl font-semibold text-white mb-2">Escolha a Especialização</h2>
                <p className="text-white/50">Selecione o tipo de IA de imagem que você quer criar</p>
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
                  Continuar
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
                onPublish={handlePublish}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
