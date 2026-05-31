# Publicar o site + ativar o login de admin na web

Hoje você edita o conteúdo localmente em `http://localhost:4321/keystatic`.
Para editar **de qualquer lugar com login** (a "página de admin protegida"),
o site precisa estar publicado num servidor. O caminho mais simples, já que
você tem conta no GitHub, é: **GitHub + Vercel + login com GitHub**.

São ~4 passos. Os que dependem das suas contas estão marcados com 👤.
Me chame que eu faço junto com você — vários eu consigo executar aqui.

---

## 1. 👤 Subir o projeto para o GitHub

O projeto já está pronto para isso (git inicializado). Crie um repositório novo
em https://github.com/new (pode ser **privado**) e depois rode, na pasta do
projeto:

```bash
git add .
git commit -m "Site pessoal"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
git push -u origin main
```

## 2. 👤 Publicar na Vercel

1. Entre em https://vercel.com com sua conta do GitHub.
2. "Add New… → Project" e escolha o repositório que você acabou de subir.
3. A Vercel detecta Astro sozinha. Clique em **Deploy**.
4. Em ~1 min o site estará no ar (ex.: `seu-site.vercel.app`).

> Só com isso o **site público** já fica no ar (sem o editor ainda).

## 3. Ativar o editor com login (eu faço a parte de código)

Para o `/keystatic` funcionar no ar com "Entrar com GitHub", são necessárias
3 mudanças no código, que **eu aplico para você**:

- instalar o adaptador de servidor (`@astrojs/vercel`);
- ligar o editor também em produção (hoje ele só liga em desenvolvimento);
- trocar, no `keystatic.config.ts`, o `storage` de `local` para `github`
  (apontando para o seu repositório).

## 4. 👤 Conectar o Keystatic ao GitHub (gera as senhas de acesso)

Com o site no ar, abra `https://seu-site.vercel.app/keystatic`. O Keystatic
mostra um botão para **criar a conexão com o GitHub** automaticamente. Ao
autorizar, ele gera 3 chaves — você as cola na Vercel (Settings → Environment
Variables), com os nomes que estão em `.env.example`:

- `KEYSTATIC_GITHUB_CLIENT_ID`
- `KEYSTATIC_GITHUB_CLIENT_SECRET`
- `KEYSTATIC_SECRET`

Depois disso, **só você** (dono do repositório) consegue entrar em `/keystatic`
e editar. Qualquer edição vira um commit no seu repositório e a Vercel
republica o site automaticamente. 🎉

---

### Alternativa sem GitHub (login por e-mail)

Se preferir login por e-mail com código em vez de GitHub, dá para colocar o
`/keystatic` atrás do **Cloudflare Access** (plano gratuito): você digita seu
e-mail, recebe um código e entra. É um pouco mais de configuração — me avise se
preferir esse caminho.
