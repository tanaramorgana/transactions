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
app.listen(8080, () => {
    console.log("API está rodando...");
});
// Rota (url) = endpoint
// stateless - pesquisar - conceito importante em API REST
// get -> buscar informações
app.get("/", (request, response) => {
    return response.send("OK");
});
app.get("/usuario/:id", (request, response) => {
    const { id } = request.params;
    // const id = request.params.id
    const { pagina, ordem } = request.query;
    // Lógica
    return response.json({
        id,
        // id: id,
        nome: "Vini",
        idade: 18,
    });
});
app.get("/usuario", (request, response) => {
    const { id } = request.params;
    // const id = request.params.id
    const { pagina, ordem } = request.query;
    // Logica
    return response.json([
        {
            id,
            // id: id,
            nome: "Vini",
            idade: 18,
        },
        {
            id,
            nome: "Vini",
            idade: 20,
        },
    ]);
});
app.post("/usuario", (request, response) => {
    const { nome, idade, telefone } = request.body;
    // Lógica
    return response.json({
        nome,
        idade,
        telefone,
    });
});
