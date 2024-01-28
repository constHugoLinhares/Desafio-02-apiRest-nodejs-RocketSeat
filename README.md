# Desafio-02-apiRest-nodejs-RocketSeat

## Sobre o desafio

<aside>
⚠️

A partir desse desafio **não** vamos informar detalhadamente rotas e propriedades dos registros a serem criadas, mas sim, as regras e requisitos que a API deve ter.
O motivo disso é para vocês **também** exercitarem o desenvolvimento e a estruturação dessa parte.

</aside>

Nesse desafio desenvolveremos uma API para controle de dieta diária, a Daily Diet API.

### Regras da aplicação

[X] - Deve ser possível criar um usuário </br>
[X] - Deve ser possível identificar o usuário entre as requisições </br>
[X] - Deve ser possível registrar uma refeição feita, com as seguintes informações: </br>
  _*As refeições devem ser relacionadas a um usuário.*_
  - Nome
  - Descrição
  - Data e Hora
  - Está dentro ou não da dieta

[X] - Deve ser possível editar uma refeição, podendo alterar todos os dados acima </br>
[X] - Deve ser possível apagar uma refeição </br>
[X] - Deve ser possível listar todas as refeições de um usuário </br>
[X] - Deve ser possível visualizar uma única refeição </br>
[X] - Deve ser possível recuperar as métricas de um usuário </br>
[X]  - Quantidade total de refeições registradas </br>
[X]  - Quantidade total de refeições dentro da dieta </br>
[X]  - Quantidade total de refeições fora da dieta </br>
[X]  - Melhor sequência de refeições dentro da dieta </br>
[X] - O usuário só pode visualizar, editar e apagar as refeições o qual ele criou </br>

Commands for run:

-npm install </br>
-npm run migrate:latest </br>
-npm run dev </br>
-npm run test (é necessário estar com o .env.test configurado) </br>

features:
--Migrates </br>
--User controller with create and show </br>
--Food controller with create, update, delete, index and show </br>
--Metrics controller to calculate metrics </br>
