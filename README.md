# Trainly

Aplicativo web responsivo para gerenciamento e execução de treinos.

## Stack inicial

- React 19 + TypeScript + Vite
- React Router
- Zod
- Vitest

## Scripts

- `npm run dev` — inicia ambiente local
- `npm run build` — build de produção
- `npm run test` — roda testes unitários
- `npm run lint` — lint com Oxlint

## Escopo implementado nesta base

- Navegação principal: Dashboard, Meus treinos, Exercícios, Histórico, Evolução e Configurações.
- Modelos de domínio para exercícios, fichas e sessões de treino.
- Serviço de criação de sessão com snapshot da ficha (histórico imutável).
- Registro separado de valores planejados e realizados por série.
- Validação de ficha com nome obrigatório, pelo menos um exercício e ordem única.
