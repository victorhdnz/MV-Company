import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { LinkAggregatorPage } from '@/components/link-aggregator/LinkAggregatorPage';
import { LinkAggregator } from '@/types/link-aggregator';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getLinkAggregator(slug: string): Promise<LinkAggregator | null> {
  const supabase = createServerClient();
  
  const { data, error } = await supabase
    .from('link_aggregators')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    user_id: data.user_id,
    name: data.name,
    slug: data.slug,
    main_title: data.main_title || 'Portfolio',
    main_title_letter: data.main_title_letter || 'o',
    profile_image: data.profile_image || undefined,
    profile_name: data.profile_name || data.name,
    homepage_button_enabled: data.homepage_button_enabled ?? true,
    homepage_button_title: data.homepage_button_title || 'Visite nosso site',
    homepage_button_url: data.homepage_button_url || undefined,
    links: (data.links as any) || [],
    social_links: (data.social_links as any) || [],
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const aggregator = await getLinkAggregator(params.slug);

  if (!aggregator) {
    return {
      title: 'Agregador de Links não encontrado',
    };
  }

  return {
    title: `${aggregator.profile_name || aggregator.name} - Links`,
    description: `Links de ${aggregator.profile_name || aggregator.name}`,
  };
}

export default async function LinkAggregatorPublicPage({ params }: { params: { slug: string } }) {
  const aggregator = await getLinkAggregator(params.slug);

  if (!aggregator) {
    notFound();
  }

  return <LinkAggregatorPage aggregator={aggregator} />;
}

