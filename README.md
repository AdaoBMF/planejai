# Planej.ai

Aplicação web para simulação de metas financeiras com insights personalizados gerados por inteligência artificial.

## O que o projeto faz

O **Planej.ai** ajuda o usuário a entender se uma meta financeira é viável dentro de um prazo definido.

O fluxo funciona assim:

1. O usuário preenche um formulário em etapas com dados como renda, gastos, dívidas, nome da meta, valor e prazo.
2. A simulação é salva no navegador (`localStorage`).
3. Na página de resultado, a aplicação consulta a API do **Google Gemini** e gera um diagnóstico financeiro personalizado.
4. O usuário pode conversar com o agente financeiro por chat, com base no contexto da simulação.
5. Simulações anteriores ficam disponíveis na página de histórico.

## Como executar a aplicação

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão LTS recomendada — inclui o npm)
- [Yarn](https://yarnpkg.com/) (opcional; use npm se preferir)
- Chave de API do Google Gemini ([Google AI Studio](https://aistudio.google.com/apikey))

### Passo a passo

1. Clone o repositório e entre na pasta do projeto:

```bash
cd planejai
```

2. Instale as dependências:

```bash
# com Yarn
yarn

# ou com npm
npm install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.sample .env
```

Edite o arquivo `.env` e preencha pelo menos a chave da API:

```env
VITE_AI_APP_KEY=sua_chave_aqui
VITE_AI_APP_URL=https://generativelanguage.googleapis.com/api/models
VITE_AI_APP_MODEL=gemini-flash-latest
VITE_MAX_MODEL_API_RETRIES=5
```

4. Inicie o servidor de desenvolvimento:

```bash
# com Yarn
yarn dev

# ou com npm
npm run dev
```

5. Abra no navegador o endereço exibido no terminal (geralmente `http://localhost:5173`).

### Outros comandos úteis

| Ação | Yarn | npm |
|---|---|---|
| Build de produção | `yarn build` | `npm run build` |
| Preview do build | `yarn preview` | `npm run preview` |
| Lint | `yarn lint` | `npm run lint` |
| Corrigir lint | `yarn lint:fix` | `npm run lint:fix` |
| Formatar código | `yarn format` | `npm run format` |

## Tecnologias utilizadas

| Tecnologia | Uso no projeto |
|---|---|
| [React 19](https://react.dev/) | Interface do usuário |
| [TypeScript](https://www.typescriptlang.org/) | Tipagem estática |
| [Vite](https://vite.dev/) | Build e servidor de desenvolvimento |
| [React Router](https://reactrouter.com/) | Navegação entre páginas |
| [Tailwind CSS 4](https://tailwindcss.com/) | Estilização |
| [Lucide React](https://lucide.dev/) | Ícones |
| [Google Gemini API](https://ai.google.dev/) | Geração de insights e chat |
| `localStorage` | Persistência de simulações e histórico de chat |

Ferramentas de qualidade de código: ESLint e Prettier.

## Como testar o fluxo principal

1. Acesse a página inicial (`/`).
2. Preencha as 6 etapas do formulário:
   - Renda mensal bruta
   - Custos fixos de vida
   - Dívidas / parcelas
   - Nome da meta
   - Custo da meta
   - Prazo desejado (em meses)
3. Clique em **Gerar simulação**.
4. Verifique se você foi redirecionado para `/resultado/:id`.
5. Aguarde o carregamento do **Insight Financeiro Personalizado** (gerado pela IA).
6. Confira os cards com resumo financeiro (economia mensal, renda, gastos etc.).
7. Envie uma pergunta no chat do agente financeiro e aguarde a resposta.
8. Acesse **Histórico** no menu (`/historico`) e confirme que a simulação foi salva.
9. Clique em uma simulação salva para reabrir o resultado.

### Exemplo de dados para teste

| Campo | Valor sugerido |
|---|---|
| Renda mensal | R$ 5.000,00 |
| Custos fixos | R$ 2.000,00 |
| Dívidas | R$ 500,00 |
| Meta | Viagem para o Japão |
| Custo da meta | R$ 50.000,00 |
| Prazo | 12 meses |

### Observações

- É necessário internet e uma chave válida do Gemini para gerar insights e usar o chat.
- Se a API retornar erro, use o botão de tentar novamente na tela de insight.
- Os dados ficam salvos apenas no navegador em que a simulação foi criada.

### Melhorias adicionadas ao projeto base

- página de histórico de consultas
- interação via chat com o agente de IA
- sistema de retry para as chamadas ao agente diminuindo a incidência de erros devido a indisponibilidade do agente
