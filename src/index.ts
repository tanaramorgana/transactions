// Todas as rotas deverão possuir validação dos parâmetros recebidos, retornando uma
// mensagem de erro e status adequado para a situação.
// ● Todas as rotas que possuírem consulta à alguma informação (GET, PUT, DELETE),
// deverão validar se o recurso acessado existe antes de efetuar a ação, retornando uma
// mensagem de erro e status adequado para a situação.
// ● Os usuários deverão ser salvos em um array específico, para serem utilizados nas
// demais rotas.
// ● Criar uma classe User, que deverá ter como propriedades name, cpf, email, age e
// transactions (sendo esse um array).
// ● Criar uma classe Transaction, que deverá ter como propriedades title, value e type.
// ● Ambas as classes User e Transaction deverão ter uma propriedade id, que deverá ser
// gerada automaticamente, sendo este um valor numérico único.

// ● POST /users: A rota deverá receber name, cpf, email e age dentro do corpo da requisição,
// sendo que o cpf deve ser único por usuário. Criar uma instância da classe User com os
// dados recebidos, e adicionar no array de usuários.
// ● GET /users/:id: A rota deverá retornar um único usuário de acordo com o parâmetro
// recebido. Não deverá retornar as transações do usuário nessa rota.

// ● GET /users: A rota deve retornar uma listagem com todos os usuários que você cadastrou
// até o momento. Não deverá retornar as transações do usuário nessa rota.

// ● PUT/DELETE /users/:id: A rota deverá editar ou deletar usuários.

// API DE TRANSAÇÕES

// ● GET /user/:userId/transactions/:id: A rota deverá retornar uma única transação cadastrada
// previamente

// ●
// ● GET /users/:userId/transactions: A rota deverá retornar uma listagem com todas as
// transações que você cadastrou até o momento para um usuário específico, junto com o
// valor da soma de entradas, retiradas e total de crédito.

// ● PUT/DELETE /users/:userId/transactions/:id: Devem editar ou deletar transações.

import express, { Request, Response } from "express";
import cors from "cors";
import User from "./classes/User";
import Transaction from "./classes/Transaction";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const users: User[] = [];

// ● POST /user/:userId/transactions: A rota deverá receber title, value, type dentro do corpo da
// requisição, sendo type o tipo da transação, que deve ter como valor de entradas income
// (depósitos) e outcome para saídas (retiradas). Criar uma instância da classe Transaction,
// e adicioná-la ao usuário responsável salvo anteriormente no array de usuários.

app.post("/users", (request: Request, response: Response) => {
  const { name, cpf, email, age } = request.body;
  if (!name || !cpf || !email || !age) {
    return response.status(400).json({
      mensagem: "Preencha todos os campos",
    });
  } else {
    if (users.find((user) => user.cpf === cpf)) {
      return response.status(400).json({
        mensagem: "CPF já cadastrado",
      });
    }

    const user = new User(name, cpf, email, age);
    users.push(user);

    return response.status(201).json({
      mensagem: "Usuário cadastrado com sucesso",
    });
  }
});

app.get("/users/:id", (request: Request, response: Response) => {
  const { id } = request.params;
  const searchId = users.find((user) => user.id === parseInt(id));
  if (searchId) {
    return response.status(200).json(searchId);
  }

  return response.status(404).json({
    mensagem: "Usuário não encontrado, ID inválido",
  });
});

app.get("/users/", (request: Request, response: Response) => {
  return response.status(200).json(
    users.map((user) => {
      return {
        name: user.name,
        cpf: user.cpf,
        email: user.email,
        id: user.id,
      };
    })
  );
});

app.put("/users/:id", (request: Request, response: Response) => {
  const { id } = request.params;
  const { name, cpf, email, age } = request.body;
  const userIndex = users.findIndex((user) => user.id === parseInt(id));
  if (!name || !cpf || !email || !age) {
    return response.status(400).json({
      mensagem: "Preencha todos os campos",
    });
  }

  if (userIndex > 0) {
    return response.status(404).json({ mensagem: "Usuário não encontrado." });
  }

  users[userIndex].name = name;
  users[userIndex].cpf = cpf;
  users[userIndex].email = email;
  users[userIndex].age = age;

  return response.json(users[userIndex]);
});

app.delete("/users/:id", (request: Request, response: Response) => {
  const { id } = request.params;
  const userIndex = users.findIndex((user) => user.id === parseInt(id));

  if (userIndex < 0) {
    return response.status(404).json({ mensagem: "Usuário não encontrado." });
  }

  users.splice(userIndex, 1);
  return response.status(204);
});

app.post(
  "/user/:userId/transactions",
  (request: Request, response: Response) => {
    const { userId } = request.params;
    const { title, value, type } = request.body;
    const userIndex = users.findIndex((user) => user.id === parseInt(userId));
    if (userIndex < 0) {
      return response.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    if (!title || !value || !type) {
      return response.status(400).json({
        mensagem: "Preencha todos os campos",
      });
    }

    const transactions = new Transaction(title, value, type);

    users[userIndex].transactions.push(transactions);

    return response.json(transactions);
  }
);

app.get(
  "/user/:userId/transactions/:id",
  (request: Request, response: Response) => {
    const { userId, id } = request.params;
    const user = users.find((user) => user.id === parseInt(userId));

    if (!user) {
      return response.status(404).json({ mensagem: "Usuário não encontrado." });
    }

    const transaction = user.transactions.find(
      (transaction) => transaction.id === parseInt(id)
    );

    if (!transaction) {
      return response
        .status(404)
        .json({ mensagem: "Transação não encontrada." });
    }

    return response.status(200).json(transaction);
  }
);

app.get(
  "/user/:userId/transactions/",
  (request: Request, response: Response) => {
    const { userId } = request.params;
    const userIndex = users.findIndex((user) => user.id === parseInt(userId));

    if (userIndex < 0) {
      return response.status(404).json({ mensagem: "Usuário não encontrado." });
    } else {
      let transactionsOutcomes: Transaction[] = users[
        parseInt(userId)
      ].transactions.filter((transaction) => transaction.type == "outcome");

      let transactionsIncomes: Transaction[] = users[
        parseInt(userId)
      ].transactions.filter((transaction) => transaction.type == "income");

      const somaOutcomes: number = transactionsOutcomes.reduce(
        (previousValue, currentTransaction) =>
          previousValue + currentTransaction.value,
        0
      );

      const somaIncomes: number = transactionsIncomes.reduce(
        (previousValue, currentTransaction) =>
          previousValue + currentTransaction.value,
        0
      );

      const somaTypes: number = somaIncomes - somaOutcomes;

      return response.status(200).json({
        Transações: users[parseInt(userId)].transactions,
        "Total entradas": somaIncomes,
        "Total saídas": somaOutcomes,
        Saldo: somaTypes,
      });
    }
  }
);

app.put(
  "/users/:userId/transactions/:id",
  (request: Request, response: Response) => {
    const { userId, id } = request.params;
    const { title, value, type } = request.body;
    const userIndex = users.findIndex((user) => user.id === parseInt(userId));

    if (userIndex < 0) {
      return response.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    const transactionIndex = users[userIndex].transactions.findIndex(
      (transaction) => transaction.id === parseInt(id)
    );

    if (transactionIndex < 0) {
      return response
        .status(404)
        .json({ mensagem: "Transação não encontrada" });
    }

    if (!title || !value || !type) {
      return response.status(400).json({
        mensagem: "Preencha todos os campos",
      });
    }

    users[userIndex].transactions[transactionIndex].title = title;
    users[userIndex].transactions[transactionIndex].value = value;
    users[userIndex].transactions[transactionIndex].type = type;

    return response
      .status(200)
      .json(users[userIndex].transactions[transactionIndex]);
  }
);

app.delete(
  "/users/:userId/transactions/:id",
  (request: Request, response: Response) => {
    const { userId, id } = request.params;
    const userIndex = users.findIndex((user) => user.id === parseInt(userId));

    if (userIndex < 0) {
      return response.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    const transactionIndex = users[userIndex].transactions.findIndex(
      (transaction) => transaction.id === parseInt(id)
    );

    if (transactionIndex < 0) {
      return response
        .status(404)
        .json({ mensagem: "Transação não encontrada" });
    }

    users[userIndex].transactions.splice(transactionIndex, 1);
    return response.status(204);
  }
);

app.listen(8080, () => {
  console.log("API rodando...");
});
