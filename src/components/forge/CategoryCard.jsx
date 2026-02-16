import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function CategoryCard({ 
  icon: Icon, 
  title, 
  description, 
  selected, 
  onClick,
  gradient 
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative group w-full text-left p-6 rounded-2xl border transition-all duration-300",
        "bg-white/5 backdrop-blur-xl overflow-hidden",
        selected 
          ? "border-violet-500/50 shadow-lg shadow-violet-500/20" 
          : "border-white/10 hover:border-white/20"
      )}
    >
      {/* Gradient overlay on hover/select */}
      <div className={cn(
        "absolute inset-0 opacity-0 transition-opacity duration-500",
        gradient,
        selected ? "opacity-20" : "group-hover:opacity-10"
      )} />
      
      {/* Selection indicator */}
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-4 right-4 w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center"
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}

      <div className="relative z-10">
        <div className={cn(
          "w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-300",
          selected ? "bg-violet-500/30" : "bg-white/10 group-hover:bg-white/15"
        )}>
          <Icon className={cn(
            "w-7 h-7 transition-colors duration-300",
            selected ? "text-violet-300" : "text-white/70"
          )} />
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-white/60 leading-relaxed">{description}</p>
      </div>
    </motion.button>
  );
}