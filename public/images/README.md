# Imagens

Coloque suas fotos e imagens de projeto aqui. Depois aponte o caminho em
`src/data/site.ts`.

## Foto principal (Hero + Sobre)

- Substitua o arquivo `portrait.svg` por uma foto sua, ou adicione
  `portrait.jpg` e atualize `personal.portrait` / `personal.portraitAlt` em
  `src/data/site.ts`.
- **Tamanho recomendado:** retrato em ~960×1200 px (proporção 4:5). Para a seção
  "Sobre", uma versão quadrada (~1040×1040 px) fica ideal.
- Formatos: `.jpg`, `.png` ou `.webp` (`.webp` pesa menos).

## Imagens dos projetos (opcional)

- Adicione, por exemplo, `biadev.jpg`, `ponto-ai.jpg`, `filamentos.jpg`.
- Descomente / preencha o campo `image` do projeto em `src/data/site.ts`
  (ex.: `image: "/images/biadev.jpg"`).
- **Tamanho recomendado:** 1280×800 px (proporção 16:10).
- Sem imagem, o cartão mostra um gradiente bonito com a inicial do projeto — ou
  seja, o site já fica completo mesmo antes de você adicionar fotos.

## Arquivos gerados (pode trocar depois)

- `portrait.svg` — placeholder da sua foto.
- `og.svg` — imagem de compartilhamento em redes sociais (preview de link).
- `../favicon.svg` — ícone do site (na pasta `public/`).
