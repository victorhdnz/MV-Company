# 🔗 Agregador de Links (Link-in-Bio)

Sistema completo de agregadores de links com efeito 3D Lanyard.

## 📋 Funcionalidades

- ✅ Criar múltiplos agregadores de links (um para cada pessoa)
- ✅ **Título principal com efeito Portfolio Text** (animação de diamante verde girando)
- ✅ Efeito 3D Lanyard (cartão pendurado em corda)
- ✅ Botão destacado para homepage (configurável)
- ✅ Gerenciamento de links com ícones
- ✅ Links de redes sociais
- ✅ Upload de foto de perfil
- ✅ Layout responsivo (mobile e desktop)
- ✅ Cores preto e branco (estética da empresa)

## 🚀 Configuração

### 1. Banco de Dados

Execute a migration SQL no Supabase:

```bash
# Arquivo: supabase/migration_link_aggregators.sql
```

Execute o script no SQL Editor do Supabase Dashboard.

### 2. Assets do Lanyard

Para que o efeito 3D funcione, você precisa adicionar os assets:

1. Acesse: https://github.com/21st-dev/lanyard
2. Baixe os arquivos da pasta `src/assets/lanyard`:
   - `card.glb` (modelo 3D do cartão)
   - `lanyard.png` (textura da corda)
3. Coloque os arquivos em: `public/assets/lanyard/`

Veja mais detalhes em: `public/assets/lanyard/README.md`

### 3. Dependências

As dependências já foram instaladas:
- `three`
- `meshline`
- `@react-three/fiber`
- `@react-three/drei`
- `@react-three/rapier`

## 📖 Como Usar

### Dashboard

1. Acesse: `/dashboard/links`
2. Clique em "Novo Agregador"
3. Preencha as informações:
   - **Título Principal** (ex: "Portfolio") - aparece no topo com efeito animado
   - **Letra para Animação** (padrão: "o") - a primeira ocorrência desta letra será substituída pela animação
   - Nome do agregador
   - Slug (URL única)
   - Foto de perfil (opcional)
   - Nome exibido no perfil
4. Configure o botão homepage:
   - Habilite/desabilite
   - Defina título e URL
5. Adicione links:
   - Título
   - Descrição (opcional)
   - URL
   - Ícone (nome do Lucide ou URL de imagem)
6. Adicione redes sociais:
   - Plataforma
   - URL
   - Ícone
7. Salve o agregador

### Página Pública

Acesse o agregador através da URL:
```
/links/[slug]
```

Exemplo: `/links/victor-diniz`

## 🎨 Personalização

### Título Principal (Portfolio Text)

O título principal usa o efeito "Portfolio Text" que substitui uma letra por uma animação:
- **Texto**: Configure no dashboard (padrão: "Portfolio")
- **Letra**: Configure qual letra será substituída (padrão: "o")
- A primeira ocorrência da letra será substituída por um diamante verde girando dentro de uma forma escura com dentes

### Cores

O layout usa cores preto e branco por padrão. Para personalizar, edite:
- `src/components/link-aggregator/LinkAggregatorPage.tsx`

### Efeito Lanyard

Para personalizar o modelo 3D do cartão:
1. Use o editor online: https://modelviewer.dev/editor/
2. Edite o arquivo `card.glb`
3. Substitua em `public/assets/lanyard/card.glb`

Para personalizar a textura da corda:
1. Edite `lanyard.png` em qualquer editor de imagens
2. Substitua em `public/assets/lanyard/lanyard.png`

## 📁 Estrutura de Arquivos

```
src/
├── app/
│   ├── dashboard/links/          # Dashboard de gerenciamento
│   │   ├── page.tsx              # Lista de agregadores
│   │   ├── novo/page.tsx         # Criar novo agregador
│   │   └── [id]/page.tsx         # Editar agregador
│   └── links/[slug]/page.tsx     # Página pública
├── components/
│   ├── link-aggregator/
│   │   ├── LinkAggregatorPage.tsx    # Componente da página pública
│   │   ├── LinksManager.tsx          # Gerenciador de links (dashboard)
│   │   └── SocialLinksManager.tsx    # Gerenciador de redes sociais (dashboard)
│   └── ui/
│       └── lanyard.tsx            # Componente 3D Lanyard
└── types/
    └── link-aggregator.ts         # Tipos TypeScript

public/
└── assets/
    └── lanyard/                  # Assets do efeito 3D
        ├── card.glb
        ├── lanyard.png
        └── README.md

supabase/
└── migration_link_aggregators.sql  # Migration do banco de dados
```

## 🔧 Tipos de Ícones

### Ícones Lucide

Use o nome do ícone do Lucide React:
- `github`
- `instagram`
- `mail`
- `tiktok` (custom)

### URLs de Imagem

Para usar imagens personalizadas:
1. Defina `icon_type: 'image'`
2. Cole a URL da imagem no campo `icon`

## 📝 Notas

- O slug é gerado automaticamente a partir do nome, mas pode ser editado
- Links e redes sociais podem ser reordenados usando as setas
- Links podem ser habilitados/desabilitados individualmente
- O botão homepage é destacado em branco no layout público
- O efeito Lanyard só funciona se os assets estiverem presentes

## 🐛 Troubleshooting

### Efeito Lanyard não aparece

1. Verifique se os arquivos `card.glb` e `lanyard.png` estão em `public/assets/lanyard/`
2. Verifique o console do navegador para erros
3. Certifique-se de que as dependências foram instaladas corretamente

### Erro ao salvar agregador

1. Verifique se a migration SQL foi executada
2. Verifique se o usuário tem permissões no Supabase
3. Verifique se o slug é único

### Links não aparecem

1. Verifique se os links estão habilitados (`enabled: true`)
2. Verifique se as URLs estão corretas
3. Verifique se os links têm ordem definida

## 🎯 Próximos Passos

- [ ] Adicionar mais efeitos 3D
- [ ] Analytics de cliques
- [ ] Temas personalizáveis
- [ ] Preview em tempo real no dashboard

