# 🐾 Adote ou Doe · AATAN Sorocaba

Página de apoio ao abrigo **AATAN Sorocaba** ([@aatansorocaba](https://www.instagram.com/aatansorocaba/)),
incentivando adoção responsável e doações.

Site 100% estático (HTML + CSS + JavaScript puro), sem build e sem dependências.

## Recursos

- Layout responsivo (celular, tablet e desktop)
- Efeito de patinhas seguindo o mouse/dedo, explosão de patinhas ao clicar e patinhas flutuando no fundo
- Galeria dos animais com filtro (cães/gatos), curtidas, efeito 3D e modal com detalhes
- QR Code que leva ao Instagram do abrigo (com opção de baixar em PNG)
- Botão e ícone flutuante do Instagram
- Chave PIX com botão "copiar"
- Links da bio: Linktree, Magalu + AATAN e Edital Animal 4.0
- Banner de cookies (aceitar/recusar) e política de privacidade
- Respeita a configuração "reduzir movimento" do sistema

## Estrutura

```
index.html
css/style.css
js/main.js
assets/
  img/animais/      fotos dos animais (.jpg)
  img/logo-aatan.jpg
  img/og-image.jpg  imagem de prévia ao compartilhar o link
  icons/            favicon e ícone do Instagram
  qr-instagram.svg  QR Code exibido na página
  qr-instagram.png  QR Code para download (com logo)
vercel.json
```

## O que trocar

| O quê | Onde |
|---|---|
| Telefone / WhatsApp | `index.html`, seção `#contato` — troque `(15) 99999-9999`, o `tel:+5515999999999` e o `wa.me/5515999999999` |
| Animais | `js/main.js`, array `pets` — adicione `{ id, nome, tipo }` e a foto `assets/img/animais/<id>.jpg` |
| Texto do modal | `js/main.js`, função `petText` |

## Rodar localmente

```bash
npx serve .
# ou
python -m http.server 8000
```

> Use um servidor local (os caminhos começam com `/`), não abra o `index.html` direto pelo explorador de arquivos.

## Publicar na Vercel

**Pelo site:** suba a pasta para um repositório no GitHub → em vercel.com clique em *Add New → Project* → importe o repositório → *Framework Preset: Other* → *Deploy*.

**Pela CLI:**

```bash
npm i -g vercel
vercel        # primeira vez (preview)
vercel --prod # produção
```

---

Desenvolvido por [thalyssxn](https://github.com/thalyssxn) · Fotos e marca © AATAN Sorocaba.
