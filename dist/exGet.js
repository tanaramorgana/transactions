"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
// 1- Criar uma rota chamada calculadora, que terá como router param a operação a ser
// executada. Nesta rota deverá ter também duas querys params, sendo elas valorA e valorB,
// que serão utilizados nas operações.
app.get("/calculadora/:operacao", (request, response) => {
    const { operacao } = request.params;
    const { valorA, valorB } = request.query;
    const somar = Number(valorA) + Number(valorB);
    if (valorA && valorB) {
        const valorANumerico = parseInt(valorA.toString());
        const valorBNumerico = parseInt(valorA.toString());
        let resultado;
        switch (operacao) {
            case "somar":
                resultado = valorANumerico + valorBNumerico;
                break;
            case "subtrair":
                resultado = valorANumerico - valorBNumerico;
                break;
            case "multiplicar":
                resultado = valorANumerico * valorBNumerico;
                break;
            case "dividir":
                resultado = valorANumerico / valorBNumerico;
                break;
            default:
                return response.status(400).json({
                    mensagem: `Operação ${operacao} inválida`,
                });
        }
        return response.json({
            valorA,
            valorB,
            operacao,
            resultado,
        });
    }
    else {
        return response.status(400).json({
            mensagem: "Valores inválidos",
        });
    }
});
// 2 - Criar uma rota, que toda vez que for chamada, adiciona +1 a um contador. Toda vez que
// esse contador chegar a 10, exibir mensagem “Chegou à 10” e resetar o contador;
let contador = 0;
app.get("/contador", (request, response) => {
    contador++;
    if (contador === 10) {
        contador = 0;
        return response.json({
            Mensagem: "Contador chegou em 10",
        });
    }
    else {
        return response.json(contador);
    }
});
// 3 - Criar uma rota chamada numeral, que terá como router param um número a ser
// processado. Nesta rota deverá ter também uma query param chamada operação contendo um
// dos seguintes valores: anterior ou próximo. Caso o valor seja anterior, deverá ser retornado o
// valor anterior ao passado no router param, caso o valor seja próximo, deverá retornar o
// próximo valor ao número passado.
app.get("/numeral/:numero", (request, response) => {
    const { numero } = request.params;
    const { operacao } = request.query;
    let anterior = Number(numero) - 1;
    let proximo = Number(numero) + 1;
    if (operacao == "anterior") {
        return response.json({
            anterior,
        });
    }
    if (operacao == "proximo") {
        return response.json({
            proximo,
        });
    }
    return response.json({
        operacao,
    });
});
// 4 - Criar uma rota chamada inverter-string, essa rota deverá ter uma query param chamada
// valor. Esse valor recebido deverá ser invertido e retornado.
app.get("/inverter-string", (request, response) => {
    const { valor } = request.query;
    const invertido = valor?.toString().split("").reverse().join("");
    return response.json({
        invertido,
    });
});
// 5 - Criar uma rota chamada remover-vogais, essa rota deverá ter uma query param chamada
// valor. Esse valor recebido deverá ser salvo em um array, e toda vez que a rota for chamada,
// deverá salvar o valor nesse mesmo array. Antes de salvar o valor/string no array, deverá ser
// removido todas as vogais, deixando apenas as consoantes na string. Sempre que a rota for
// chamada, deverá ser exibido em forma de json o array contendo todas as strings.
app.get("/remover-vogais", (request, response) => {
    const { valor } = request.query;
    const palavra = valor?.toString().replace(/[aeiou]/g, "");
    return response.json({
        palavra,
    });
});
// 6 - Criar rota chamada adicionar-pessoa, que deverá receber como query param nome e idade.
// Criar classe chamada Pessoa, que deve ter as propriedades id, nome e idade, e atribuir os
// valores recebidos a essas propriedades ao instanciar a classe. A classe instanciada deverá ser
// guardada em um array, que poderá ser acessado em outras rotas.
// A propriedade id deverá ser um número incremental e único por pessoa
let id = 0;
let pessoas = [];
class Pessoa {
    constructor(id, nome, idade, cpf) {
        this.id = id;
        this.nome = nome;
        this.idade = idade;
        this.cpf = cpf;
    }
    inverterNome() {
        return (this.nome = this.nome.split("").reverse().join(""));
    }
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
app.get("/adicionar-pessoa", (request, response) => {
    const { nome, idade, cpf } = request.query;
    const pessoa = new Pessoa(getRandomInt(0, 10), String(nome), Number(idade), String(cpf));
    pessoas.push(pessoa);
    return response.status(201).json({
        pessoa,
        pessoas,
    });
});
// 7 - Criar uma rota chamada exibir-pessoa, que deverá receber como router param o id da
// pessoa. Nesta rota você deverá buscar no array de pessoas o item que possui o id recebido
// por parâmetro, e retornar a informação em formato de json.
app.get("/exibir-pessoa/:id", (request, response) => {
    const { id } = request.params;
    const pessoaAchada = pessoas.find((pessoa) => pessoa.id === parseInt(id));
    if (pessoaAchada) {
        return response.json(pessoaAchada);
    }
    return response.status(404).json({
        mensagem: "Produto não encontrado, id inválido",
    });
});
// 8 - Criar rota chamada exibir-pessoas, que deverá exibir o array com todas as pessoas em
// formato de json.
app.get("/exibir-pessoas", (request, response) => {
    return response.json({
        pessoas,
    });
});
// 9 - Criar rota chamada remover-pessoa, que deverá receber como query param o id da pessoa.
// Nesta rota deverá remover a pessoa com o mesmo id recebido por parâmetro do array.
app.get("/remover-pessoa/:id", (request, response) => {
    const { id } = request.params;
    const idAchado = pessoas.findIndex((pessoa) => pessoa.id === parseInt(id));
    if (!idAchado) {
        return response.status(404).json({ mensagem: "Pessoa não encontrada" });
    }
    pessoas.splice(idAchado, 1);
    return response
        .status(200)
        .json({ mensagem: "Excluído com sucesso", pessoas });
});
// 10 - Criar rota chamada inverter-nomes-pessoas, que deverá retornar um array com as
// pessoas com seus nomes invertidos em formato de json. Para isso utilize um método na classe
// Pessoa.
let pessoasNomeInvertido = [];
// app.get("/inverter-nomes-pessoas", (request: Request, response: Response) => {
//   const pessoasInverter = pessoas.map((pessoa: any) => pessoa);
//   const newPessoa: any = new Pessoa(
//     pessoasInverter.id,
//     pessoasInverter.nome,
//     pessoasInverter.idade
//   );
//   pessoasNomeInvertido.push(newPessoa);
//   const pessoaInvertida = pessoasNomeInvertido.filter((f: any) => f.name);
//   return response.status(200).json(pessoa1.inverterNome());
// });
// 11 - Alterar o exercício número 6, transformando a rota anteriormente GET, para POST,
// passando as seguintes informações: id, nome, cpf e idade. Caso o cpf ou o id já existam no
// array (criado no exercício 6), exibir mensagem de dados inválidos, com o devido status de
// retorno.
app.post("/adicionar-pessoa-post", (request, response) => {
    const { id, nome, idade, cpf } = request.body;
    const pessoa = new Pessoa(id, nome, idade, cpf);
    pessoas.map((id) => {
        if (!id) {
            pessoas.push(pessoa);
        }
        else {
            return response.status(400).json({
                mensagem: "ID existente",
                pessoa,
                pessoas,
            });
        }
    });
    return response.status(201).json({
        mensagem: "Pessoa criada com sucesso.",
        pessoa,
        pessoas,
    });
});
const times = [];
app.post("/adicionar-time", (request, response) => {
    const { nome, ano, estado } = request.body;
    const time = {
        nome: nome,
        ano: ano,
        estado: estado,
    };
    if (!nome)
        return response.status(400).json({
            mensagem: "Insira o nome.",
        });
    if (!ano)
        return response.status(400).json({
            mensagem: "Insira o ano.",
        });
    if (estado)
        return response.status(400).json({
            mensagem: "Insira o estado.",
        });
    times.push(time);
    // 13 - Criar uma rota chamada adicionar-valores-calculo, que poderá receber 1 ou mais valores
    // numéricos. Você deverá somar todos os valores recebidos, e retornar quantos números pares
    // e quantos números ímpares existem no intervalo de 0 até a soma de valores. Todos os
    // números que possuírem os valores 2 ou 4 (ex: 2, 12, 22, 32) no intervalo de valores, devem
    // ficar de fora da soma. Caso algum dos valores recebidos não for numérico, retorna mensagem
    // e status adequados.
    app.post("/adicionar-valores-calculo", (request, response) => {
        const { ...valores } = request.body;
        let total = 0;
        let totalPar = 0;
        let totalImpar = 0;
        for (let key in valores) {
            total += valores[key];
        }
        for (let i = 0; i < total; i++) {
            if (i !== 0 && i % 2 === 0) {
                if (i.toString().includes("2") && i.toString().includes("4"))
                    totalPar++;
            }
            else {
                totalImpar++;
            }
        }
        return response.json({
            valores,
            total,
            totalPar,
            totalImpar
        });
    });
    // 14 - Criar uma rota chamada cadastrar-milhas, que deverá receber os valores usuarioId, milhas
    // e data (formato 01/01/2020). As informações deverão ser salvas em um array, e sempre que o
    // valor total das milhas salvas no array for múltiplo de 120.000, deverá retornar uma mensagem
    // informando que há trocas de pontos disponíveis. As somas das milhas deverão considerar
    // apenas os registros do ano de 2020.
    const usuarios = [];
    app.post("/cadastrar-milhas", (request, response) => {
        const { usuarioId, data, milhas } = request.body;
        usuarios.push({
            usuarioId,
            data,
            milhas
        });
        const resultado = usuarios.filter(usuario => usuario.usuarioId === usuarioId > 120000);
        const totalMilhas = resultado.reduce((total, usuario) => {
            if (usuario.data.includes('2020')) {
                return total + usuario.milhas;
            }
            return total;
        }, 0);
        if (totalMilhas % 120000 === 0) {
            return response.json({
                mensagem: "Há trocas de milhas disponíveis."
            });
        }
        return response.json({
            mensagem: "Não há trocas de milhas disponíveis."
        });
    });
    // 15 - Criar uma rota chamada cadastrar-tentativas, que deverá receber os valores
    // numeroTentativas, numeroAcertos. Deverá ser retornar qual o percentual de aproveitamento
    // das tentativas, baseados nas informações recebidas. Deverá também, ser retornado uma
    // mensagem ao usuário de acordo com o seu aproveitamento, seguindo as regras abaixo:
    // Entre 0 e 40%: Você precisa melhorar.
    // Entre 40% e 60%: Muito bom, mas ainda pode ser melhor.
    // Entre 60% e 90%: Parabéns, seu aproveitamento é acima da média
    // Entre 90% e 99%: Parabéns, você está entre os melhores
    // 100%: Parabéns, você é O MELHOR
    app.post("/cadastrar-tentativas", (request, response) => {
        const { numeroTentativas, numeroAcertos } = request.body;
        const aproveitamento = (numeroAcertos * 100) / numeroTentativas;
        let mensagem = "";
        switch (true) {
            case aproveitamento === 100:
                mensagem = "Parabens, você é O MELHOR";
                break;
            case aproveitamento >= 90 && aproveitamento < 100:
                mensagem = "Parabéns, você está entre os melhores";
                break;
            case aproveitamento >= 60 && aproveitamento < 90:
                mensagem = "Muito bom, seu aproveitamento é acima da média";
                break;
            default:
                mensagem = "Você precisa melhorar.";
                break;
        }
        return response.json({
            numeroTentativas,
            numeroAcertos,
            aproveitamento,
            mensagem
        });
    });
    app.listen(8080, () => {
        console.log("API está rodando...");
    });
});
