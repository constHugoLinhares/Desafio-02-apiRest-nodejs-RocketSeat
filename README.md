# Desafio-02-apiRest-nodejs-RocketSeat

## Sobre o desafio

<aside>
⚠️

A partir desse desafio **não** vamos informar detalhadamente rotas e propriedades dos registros a serem criadas, mas sim, as regras e requisitos que a API deve ter.
O motivo disso é para vocês **também** exercitarem o desenvolvimento e a estruturação dessa parte.

</aside>

Nesse desafio desenvolveremos uma API para controle de dieta diária, a Daily Diet API.

### Regras da aplicação

[X] - Deve ser possível criar um usuário
[X] - Deve ser possível identificar o usuário entre as requisições
[X] - Deve ser possível registrar uma refeição feita, com as seguintes informações:
  _As refeições devem ser relacionadas a um usuário._
  - Nome
  - Descrição
  - Data e Hora
  - Está dentro ou não da dieta
[] - Deve ser possível editar uma refeição, podendo alterar todos os dados acima
[] - Deve ser possível apagar uma refeição
[] - Deve ser possível listar todas as refeições de um usuário
[X] - Deve ser possível visualizar uma única refeição
[X] - Deve ser possível recuperar as métricas de um usuário
[X]  - Quantidade total de refeições registradas
[X]  - Quantidade total de refeições dentro da dieta
[X]  - Quantidade total de refeições fora da dieta
[X]  - Melhor sequência de refeições dentro da dieta
[..] - O usuário só pode visualizar, editar e apagar as refeições o qual ele criou

Commands for run:

-npm run migrate:latest
-npm run migrate:make (name of file)
-npm install

features:
--Migrates
--User controller with create and show
--Food controller with create, update, delete, index and show
--Metrics controller to calculate metrics
