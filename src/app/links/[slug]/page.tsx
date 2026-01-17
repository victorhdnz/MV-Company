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

  type LinkAggregatorData = {
    id: string
    user_id: string
    name: string
    slug: string
    main_title: string | null
    main_title_letter: string | null
    profile_image: string | null
    profile_name: string | null
    homepage_button_enabled: boolean | null
    homepage_button_title: string | null
    homepage_button_url: string | null
    links: any
    social_links: any
    created_at: string
    updated_at: string
  }

  const dataTyped = data as LinkAggregatorData

  return {
    id: dataTyped.id,
    user_id: dataTyped.user_id,
    name: dataTyped.name,
    slug: dataTyped.slug,
    main_title: dataTyped.main_title || 'Portfolio',
    main_title_letter: dataTyped.main_title_letter || 'o',
    profile_image: dataTyped.profile_image || undefined,
    profile_name: dataTyped.profile_name || dataTyped.name,
    homepage_button_enabled: dataTyped.homepage_button_enabled ?? true,
    homepage_button_title: dataTyped.homepage_button_title || 'Visite nosso site',
    homepage_button_url: dataTyped.homepage_button_url || undefined,
    links: (dataTyped.links as any) || [],
    social_links: (dataTyped.social_links as any) || [],
    created_at: dataTyped.created_at,
    updated_at: dataTyped.updated_at,
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

