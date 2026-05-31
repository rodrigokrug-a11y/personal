# Prompt para gerar conteúdo (Markdown) para o site rodrigokrug.com.br

Copie um dos prompts abaixo e cole no **Claude Code aberto na pasta do projeto
que você quer divulgar** (ex.: `melhorfilamento`, `biadev`…). Ele gera um
arquivo `.json` pronto, em que o corpo (`bodyPt`/`bodyEn`) é **Markdown puro** —
fácil de revisar e editar.

Depois é só salvar na pasta certa do site e rodar `npm run dev`:
- Artigo → `site-pessoal/src/content/blog/<slug>.json`
- Projeto → `site-pessoal/src/content/projects/<slug>.json`

---

## 📝 PROMPT 1 — Artigo de blog (insights / autoridade)

```
Escreva um ARTIGO DE BLOG para o site do Rodrigo Krug (rodrigokrug.com.br) —
engenheiro, Head de Operações & Supply Chain Global, 20+ anos em manufatura e
supply chain, consultor. Público: EMPRESAS que podem contratá-lo para
consultoria ou liderança.

Tema: <ESCREVA O TEMA — ou deixe em branco e me sugira 3 com base neste projeto>.

Regras:
- Tom experiente, direto, prático, em primeira pessoa. Sem jargão vazio.
- 600–1000 palavras. Comece pelo problema, traga lições acionáveis, termine
  com um convite sutil para conversar.
- BILÍNGUE (Português e Inglês — tradução natural, não literal).
- O corpo é MARKDOWN: use ## para títulos, - para listas, **negrito**,
  [texto](url) para links, e tabelas se fizer sentido.

Gere SOMENTE um JSON válido (sem ``` e sem comentários) neste formato exato,
para eu salvar em src/content/blog/<slug>.json:

{
  "title": "<título em Português>",
  "titleEn": "<título em Inglês>",
  "date": "<AAAA-MM-DD de hoje>",
  "draft": false,
  "featured": false,
  "gradient": "linear-gradient(135deg,#0ea5e9,#3b82f6 45%,#6366f1)",
  "cover": null,
  "excerpt": { "pt": "<resumo 1–2 frases>", "en": "<summary>" },
  "tags": ["<3 a 5 tags curtas>"],
  "bodyPt": "## Primeiro título\n\nParágrafo em **Markdown**.\n\n- item\n- item\n\n## Outro título\n\nMais texto.",
  "bodyEn": "## First heading\n\nParagraph in **Markdown**.\n\n- item\n- item\n\n## Another heading\n\nMore text."
}

Importante:
- bodyPt e bodyEn são STRINGS de Markdown. Use \n para quebras de linha (linha
  em branco \n\n entre parágrafos). NÃO use arrays/objetos no corpo.
- O slug do arquivo = título em minúsculas, sem acentos, com hífens.
- "gradient" = uma das 5 cores padrão do site (me pergunte se quiser variar).
```

---

## 📂 PROMPT 2 — Estudo de caso do projeto (portfólio)

```
Escreva um ESTUDO DE CASO deste projeto para o portfólio do Rodrigo Krug
(rodrigokrug.com.br). PRIMEIRO analise este repositório (README, package.json,
estrutura, principais features) para entender o que ele faz de verdade. Se
faltar algo essencial (público, números/resultados), me pergunte antes de
inventar — NÃO invente métricas.

Objetivo: página que impressione empresas — problema, solução, meu papel e
resultados. Tom experiente, primeira pessoa. BILÍNGUE (PT e EN).

Gere SOMENTE um JSON válido (sem ``` e sem comentários) neste formato exato,
para eu salvar em src/content/projects/<slug>.json:

{
  "name": "<nome do projeto>",
  "order": 5,
  "year": "<ano ou período>",
  "featured": false,
  "gradient": "linear-gradient(135deg,#6366f1,#8b5cf6 45%,#d946ef)",
  "image": null,
  "tagline": { "pt": "<frase curta>", "en": "<short tagline>" },
  "description": { "pt": "<resumo p/ o cartão>", "en": "<summary>" },
  "role": { "pt": "<seu papel>", "en": "<your role>" },
  "tags": ["<3 a 5 tecnologias/áreas>"],
  "metrics": [
    { "value": "<número>", "label": { "pt": "<legenda>", "en": "<label>" } }
  ],
  "link": "<URL pública ou null>",
  "bodyPt": "## O desafio\n\n...\n\n## A solução\n\n...\n\n## Resultados\n\n...",
  "bodyEn": "## The challenge\n\n...\n\n## The solution\n\n...\n\n## Results\n\n..."
}

Importante:
- bodyPt e bodyEn são STRINGS de Markdown (## títulos, - listas, **negrito**,
  [link](url)). Use \n para quebras de linha. NÃO use arrays/objetos.
- Se não houver resultados reais, deixe "metrics": [] (não invente).
- "order" controla a posição (menor = primeiro). "gradient" = uma das 5 cores.
```

---

## Como publicar depois de gerar

1. Salve o JSON na pasta certa (`blog/` ou `projects/`).
2. `npm run dev` → confira em `http://localhost:4321`.
3. Para ajustar com calma, use o editor visual: `http://localhost:4321/keystatic`
   (Blog ou Projetos) — o campo de conteúdo aceita o mesmo Markdown.
4. Ao publicar o site, o novo conteúdo vai junto.
