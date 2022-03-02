"use strict";
// Desestruturação -> Simplificação
const pessoa = {
    nome: "Vini",
    idade: 18,
    cidade: "Sapiranga",
};
// const nome = pessoa.nome;
// const idade = pessoa.idade;
// const { nome, idade } = pessoa;
// REST/spread      COPIA OBJETOS
const { nome, ...outros } = pessoa;
console.log(nome, outros);
// COPIA ARRAY
const frutas = ["Uva", "Maça", "Banana"];
const [uva, maca] = frutas;
console.log(uva, maca);
// // const [ ...clone ] = frutas; - referencias diferentes na memoria
// const clone = frutas; // referencia igual na memoria
// const nome = "Tiago";
// import calcular { nome as nomeImportado } from "./teste";
// console.log(nomeImportado, calcular());
// import * as teste from './teste';
// console.log(teste.nome, teste.calcular());
