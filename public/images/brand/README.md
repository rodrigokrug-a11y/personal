# Kit de marca — R. Krug

Identidade inspirada no esquema Logitech: turquesa vibrante + grafite + branco.
Todos os arquivos abaixo podem ser usados fora do site (apresentações, redes,
documentos, outros sistemas). Online, cada um responde em
`https://rodrigokrug.com.br/images/brand/<arquivo>`.

## Cores

| Papel | Hex | Uso |
|---|---|---|
| Turquesa (primária) | `#0ABFAE` | logo, botões, destaques |
| Turquesa clara | `#5CE2D2` | hovers, brilhos, gradientes |
| Turquesa profunda | `#047C71` | links/texto sobre fundo claro |
| Grafite (escuro) | `#1D2021` | fundos escuros, logo sobre claro |
| Grafite página | `#141617` | fundo do site no modo escuro |
| Branco/gelo | `#F2F5F4` | texto sobre escuro |

Gradiente padrão dos cartões: `linear-gradient(135deg,#0ABFAE,#047C71 45%,#0C4F48)`.

## Tipografia

- **Títulos:** Poppins (SemiBold 600 / Bold 700) — geométrica arredondada.
- **Texto:** DM Sans (Regular 400 / Medium 500 / Bold 700).
- Google Fonts: `family=Poppins:wght@500;600;700&family=DM+Sans:wght@400;500;700`.

## Arquivos

### Vetores (SVG — escalam sem perda; preferir sempre que possível)
- `rk-monogram.svg` — monograma em `currentColor` (herda a cor do contexto).
- `rk-monogram-teal.svg` — turquesa `#0ABFAE` (usar sobre fundo escuro).
- `rk-monogram-graphite.svg` — grafite `#1D2021` (usar sobre fundo claro).
- `rk-monogram-white.svg` — branco (fotos/fundos coloridos escuros).
- `rk-monogram-black.svg` — preto puro (impressão monocromática).
- `rk-lockup-dark.svg` — lockup completo vetorial p/ fundo ESCURO.
- `rk-lockup-light.svg` — lockup completo vetorial p/ fundo CLARO.

### PNG (transparentes, alta resolução)
- `rk-monogram-teal.png` / `rk-monogram-graphite.png` / `rk-monogram-white.png`
- `rk-lockup-dark.png` — lockup completo (monograma + R. KRUG + CONSULTORIA)
  para fundo ESCURO (nome branco).
- `rk-lockup-light.png` — lockup para fundo CLARO (nome grafite).

### Ícones (na pasta `public/`)
- `favicon.svg` (vetor), `favicon.png` 256, `favicon-32.png`, `favicon-16.png`,
  `apple-touch-icon.png` 180, `icon-512.png` — monograma turquesa em quadrado grafite.

## Regras rápidas
- Sobre fundo escuro → monograma turquesa ou branco; nome em branco.
- Sobre fundo claro → monograma grafite (ou turquesa em tamanhos grandes); nome em grafite.
- Não esticar, não rotacionar, não trocar as cores fora da paleta.
- Botões: fundo turquesa `#0ABFAE` com texto grafite (não usar texto branco — contraste baixo).
