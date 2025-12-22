"use client";

import React from "react";
import DotCard from "@/components/ui/moving-dot-card";
import { ServiceDetailContent } from "@/types/service-detail";

interface ServiceStatsProps {
  content: ServiceDetailContent;
}

export function ServiceStats({ content }: ServiceStatsProps) {
  if (!content.stats_enabled) return null;

  const statsItems = content.stats_items || [];

  if (statsItems.length === 0) return null;

  return (
    <section className="w-full py-16 md:py-24 bg-black">
      <div className="container mx-auto px-4">
        {/* Título da seção */}
        {content.stats_title && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {content.stats_title}
            </h2>
          </div>
        )}

        {/* Grid de cards */}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {statsItems.map((item) => (
            <DotCard
              key={item.id}
              target={item.target}
              duration={item.duration || 2000}
              label={item.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

