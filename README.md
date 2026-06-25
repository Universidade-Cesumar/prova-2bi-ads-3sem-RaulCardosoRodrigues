[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/72Bdl6Wn)

# Controle de Materiais - Almoxarifado

Link do projeto publicado: colocar o link aqui depois do deploy.

## Sobre o projeto

Sistema web para controle de estoque de um almoxarifado. Permite cadastrar, consultar, retirar e excluir materiais, com os dados salvos e sincronizados em tempo real via MockAPI.

Desenvolvido ao longo das Sprints 1, 2 e 3.

## Funcionalidades

- Cadastrar materiais com nome e quantidade;
- Listar todos os materiais em tabela;
- Filtrar materiais pelo nome em tempo real;
- Exibir painel com total de itens, itens zerados e unidades em estoque;
- Dar baixa na quantidade de um material;
- Bloquear retiradas inválidas (quantidade zero, negativa ou maior que o estoque);
- Excluir materiais do estoque;
- Destacar visualmente linhas com estoque abaixo de 10 unidades;
- Exibir notificações de sucesso e erro via toast.

## Tecnologias usadas

- HTML
- CSS
- JavaScript
- MockAPI

## API utilizada

O projeto consome a MockAPI com o recurso `estoque`.

Endpoint:

```text
https://6a31bda67bc5e1c61266204a.mockapi.io/av1/estoque
```

Estrutura dos dados:

```json
{
  "id": "1",
  "nome": "nome do material",
  "quantidade": 20
}
```

## Como rodar

1. Baixe ou clone este repositório;
2. Abra a pasta no VS Code;
3. Abra o `index.html` diretamente no navegador;
4. Use o formulário para cadastrar materiais e testar as funcionalidades.

Não é necessário instalar dependências para rodar o projeto no navegador. As dependências de teste (`jest`) são instaladas apenas para rodar os testes automatizados:

```bash
npm install
npm run test:sprint1
npm run test:sprint2
npm run test:sprint3
```

## Contrato técnico

IDs e classes mantidos conforme exigido na atividade:

```text
input-nome
input-quantidade
btn-cadastrar
lista-materiais
input-retirada
btn-baixar
btn-excluir
input-busca
total-itens
estoque-critico
```

## Observação

O sistema requer conexão com a internet para buscar e atualizar os dados na MockAPI.

## Autor

Raul
