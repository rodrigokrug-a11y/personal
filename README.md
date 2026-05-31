# Site pessoal — Rodrigo Krug

Portfólio bilíngue (PT/EN) construído com [Astro](https://astro.build) e
[Tailwind CSS](https://tailwindcss.com). Design moderno com gradientes, foco em
apresentar projetos, currículo e serviços de consultoria.

## Como rodar

```bash
npm install      # instala as dependências (só na primeira vez)
npm run dev      # ambiente de desenvolvimento em http://localhost:4321
npm run build    # gera o site final na pasta dist/
npm run preview  # visualiza a build de produção localmente
```

## ✏️ Editar o conteúdo (sem mexer em código)

O site tem um **editor visual** embutido. Com o `npm run dev` rodando, acesse:

> **http://localhost:4321/keystatic**

Lá você edita tudo por formulários, com os campos **PT e EN lado a lado**:

| Seção do editor          | O que controla                                   |
| ------------------------ | ------------------------------------------------ |
| **Perfil & topo**        | Nome, cargo, bio, fotos, redes, números (Hero/Sobre) |
| **Projetos**             | Cada projeto tem **página própria** com conteúdo rico (ver abaixo) |
| **Experiência & currículo** | Cargos, conquistas, formação, competências     |
| **Prêmios**              | Prêmios e reconhecimentos                        |
| **Empresas / clientes**  | Faixa de logos/nomes de clientes                 |
| **Consultoria**          | Serviços oferecidos                              |

### Páginas de projeto (conteúdo rico)

Cada projeto é uma entrada na coleção **Projetos** e vira uma **página própria**
(`/projetos/<slug>` e `/en/projects/<slug>`). No editor, além dos campos do
cartão (resumo, métricas, tags), há dois campos de **conteúdo rico** — um para
Português, outro para Inglês — onde você escreve livremente com:

- **Títulos, listas, citações e código**
- **Imagens** (enviadas pelo próprio editor)
- **Tabelas**
- **Links** e divisores

Os cartões da home levam para essas páginas automaticamente. Para criar um
projeto novo: `/keystatic` → **Projetos** → **+ Create**.

Ao salvar, o editor grava nos arquivos `src/content/*.json` e o site atualiza
sozinho. Depois é só publicar (`npm run build`) para o ar.

> O editor roda **apenas em desenvolvimento** — ele não vai para o site
> publicado, então o build continua 100% estático e rápido.

### Outros ajustes (em código)

| O que mudar                        | Onde                                       |
| ---------------------------------- | ------------------------------------------ |
| Textos de botões/menus (interface) | `src/i18n/ui.ts`                           |
| Cores do gradiente / estilo        | `src/styles/global.css` (`--brand-1/2/3`)  |

> Os textos ainda com **`🔧`** são exemplos — troque-os pelos seus pelo editor.

## Fotos

Pelo editor (**Perfil & topo** e em cada **Projeto**) você envia as imagens
direto pelo navegador — elas são salvas em `public/images/`.

- Foto principal e foto da seção "Sobre": campos no **Perfil & topo**.
- Imagem de cada projeto: opcional — sem ela, o cartão usa um gradiente bonito.

Veja `public/images/README.md` para tamanhos recomendados.

## Currículo em PDF

O currículo é **gerado automaticamente** a partir do mesmo conteúdo do site
(experiência, formação, competências e prêmios) — assim ele nunca fica
desatualizado. Para regerar depois de editar o conteúdo:

```bash
npm run cv
```

Isso cria dois arquivos em `public/` (usados pelos botões "Baixar currículo"):

- `Rodrigo-Krug-CV.pdf` — versão em **Português**
- `Rodrigo-Krug-Resume-EN.pdf` — versão em **Inglês**

> Requer o Google Chrome instalado (usado em modo headless para imprimir o PDF).
> O layout do currículo fica em `scripts/generate-cv.mjs`.

Se preferir usar **o seu próprio PDF**, é só colocá-lo em `public/` e ajustar o
caminho no editor (**Perfil & topo → Currículo PDF**).

## Formulário de contato

O formulário usa o [Formspree](https://formspree.io) (plano gratuito). Crie um
formulário lá e cole o seu endpoint em `src/components/Contact.astro`
(procure por `FORMSPREE_ENDPOINT`). Enquanto isso, o botão de e-mail já funciona.

## Publicar (deploy)

O site é estático — funciona em qualquer host. As opções gratuitas mais simples:

- **Vercel:** importe o repositório em vercel.com → deploy automático.
- **Netlify:** arraste a pasta `dist/` em app.netlify.com ou conecte o repo.
- **GitHub Pages / Cloudflare Pages:** também funcionam.

Antes de publicar, troque `site:` em `astro.config.mjs` pelo seu domínio final.

## Editar pela web (depois de publicar)

Hoje o editor funciona localmente. Para editar de qualquer lugar (inclusive do
celular) com o site no ar, dá para conectar o Keystatic ao GitHub:

1. Suba o projeto para um repositório no GitHub.
2. Em `keystatic.config.ts`, troque `storage: { kind: "local" }` por
   `storage: { kind: "github", repo: "seu-usuario/seu-repo" }`.
3. Hospede numa plataforma com servidor (Vercel/Netlify) e instale o adaptador
   correspondente.

Me chame quando chegar essa hora que eu configuro esse passo com você.
