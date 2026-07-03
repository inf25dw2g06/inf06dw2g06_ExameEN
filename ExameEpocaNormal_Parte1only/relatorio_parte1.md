# Relatório — Desenvolvimento Web II
## Exame Prático de Avaliação Final — Época Normal 2025/26
## Tema: Sistema de Gestão de Torneios de Videojogos

---

## Índice

1. [Introdução e Tema](#1-introdução-e-tema)
2. [Estrutura do Repositório](#2-estrutura-do-repositório)
3. [Parte 1 — API REST](#3-parte-1--api-rest)
   - 3.1 [Tecnologias Utilizadas](#31-tecnologias-utilizadas)
   - 3.2 [Modelo de Dados](#32-modelo-de-dados)
   - 3.3 [Recursos e Endpoints](#33-recursos-e-endpoints)
   - 3.4 [Camada de Autenticação e Autorização](#34-camada-de-autenticação-e-autorização)
   - 3.5 [Documentação OpenAPI 3.0](#35-documentação-openapi-30)
   - 3.6 [Collection Postman](#36-collection-postman)
   - 3.7 [Ambiente Multi-Container (Docker)](#37-ambiente-multi-container-docker)
   - 3.8 [Dados de Teste (Seed)](#38-dados-de-teste-seed)
4. [Parte 2 — Aplicação Web React](#4-parte-2--aplicação-web-react)
   - 4.1 [Tecnologias Utilizadas](#41-tecnologias-utilizadas)
   - 4.2 [Estrutura da Aplicação](#42-estrutura-da-aplicação)
   - 4.3 [Autenticação no Frontend](#43-autenticação-no-frontend)
   - 4.4 [Páginas e Funcionalidades](#44-páginas-e-funcionalidades)
   - 4.5 [Integração com a API](#45-integração-com-a-api)
5. [Como Executar o Projeto](#5-como-executar-o-projeto)
6. [Análise da Camada de Autenticação e Autorização — OAuth 2.0](#6-análise-da-camada-de-autenticação-e-autorização--oauth-20)
7. [Conclusão](#7-conclusão)

---

## 1. Introdução e Tema

O tema escolhido para este trabalho é um **Sistema de Gestão de Torneios de Videojogos**. A plataforma permite que utilizadores registados criem e gerem os seus próprios torneios, associando equipas a cada um. Cada utilizador tem acesso exclusivo aos seus próprios dados, não podendo ver nem modificar recursos de outros utilizadores.

O trabalho está dividido em duas partes:

- **Parte 1:** API REST em Node.js com Express, MySQL e autenticação por JWT, documentada com OpenAPI 3.0 e disponibilizada em ambiente Docker.
- **Parte 2:** Aplicação Web cliente desenvolvida em ReactJS que consome a API da Parte 1.

---

## 2. Estrutura do Repositório

```
/
├── index.js                    # Ponto de entrada — define todas as rotas Express
├── package.json
├── Dockerfile                  # Imagem Docker da API
├── docker-compose.yml          # Orquestração multi-container (MySQL + API + Frontend)
├── seed.js                     # Script de população da base de dados
├── .env                        # Variáveis de ambiente (desenvolvimento local)
├── .gitignore
│
├── config/
│   └── database.js             # Ligação ao MySQL via Sequelize
│
├── controllers/
│   ├── authController.js       # Login e middleware JWT
│   ├── usersController.js      # Listagem de utilizadores
│   ├── torneiosController.js   # CRUD de torneios
│   ├── equipasController.js    # CRUD de equipas
│   ├── protectedController.js  # Rota de teste protegida
│   └── swaggerController.js    # Configuração do Swagger/OpenAPI
│
├── models/
│   ├── User.js                 # Modelo Sequelize do utilizador
│   ├── Torneio.js              # Modelo Sequelize do torneio
│   └── Equipa.js               # Modelo Sequelize da equipa (+ relação 1:N)
│
├── docs/
│   ├── users.yaml              # OpenAPI: recurso users
│   ├── torneios.yaml           # OpenAPI: autenticação + recurso torneios
│   ├── equipas.yaml            # OpenAPI: recurso equipas
│   └── protected.yaml          # OpenAPI: rota protegida
│
├── postman_collection.json     # Collection Postman exportada
│
└── parte2/                     # Aplicação React (Parte 2)
    ├── Dockerfile              # Build multi-stage React + Nginx
    ├── .env
    ├── package.json
    └── src/
        ├── App.jsx             # Rotas e Navbar
        ├── index.js
        ├── api/
        │   └── api.js          # Instância Axios com interceptor de token
        ├── components/
        │   └── PrivateRoute.jsx
        ├── context/
        │   └── AuthContext.jsx # Estado global de autenticação
        └── pages/
            ├── Login.jsx
            ├── Torneios.jsx
            ├── TorneioForm.jsx
            ├── Equipas.jsx
            └── EquipaForm.jsx
```

---

## 3. Parte 1 — API REST

### 3.1 Tecnologias Utilizadas

| Tecnologia | Versão | Função |
|------------|--------|--------|
| Node.js | 18 (LTS) | Servidor aplicacional |
| Express | 5.2.1 | Framework HTTP/REST |
| Sequelize | 6.37.8 | ORM para MySQL |
| mysql2 | 3.22.5 | Driver MySQL |
| jsonwebtoken | 9.0.3 | Geração e verificação de JWT |
| swagger-jsdoc | 6.3.0 | Geração da spec OpenAPI |
| swagger-ui-express | 5.0.1 | Interface Swagger UI |
| dotenv | 17.4.2 | Gestão de variáveis de ambiente |
| cors | 2.8.6 | Middleware CORS |
| Docker / Docker Compose | — | Containerização |
| MySQL | 8 | SGBD relacional |

---

### 3.2 Modelo de Dados

A base de dados `torneios_db` contém três tabelas geridas pelo Sequelize.

#### Tabela `Users`

| Campo | Tipo | Restrições |
|-------|------|-----------|
| `id` | INTEGER | PK, AUTO_INCREMENT |
| `username` | STRING | NOT NULL, UNIQUE |
| `password` | STRING | NOT NULL |
| `createdAt` | DATETIME | Auto (Sequelize) |
| `updatedAt` | DATETIME | Auto (Sequelize) |

#### Tabela `Torneios`

| Campo | Tipo | Restrições |
|-------|------|-----------|
| `id` | INTEGER | PK, AUTO_INCREMENT |
| `userId` | INTEGER | NOT NULL (FK lógica para Users) |
| `nome` | STRING | NOT NULL |
| `jogo` | STRING | NOT NULL |
| `createdAt` | DATETIME | Auto |
| `updatedAt` | DATETIME | Auto |

#### Tabela `Equipas`

| Campo | Tipo | Restrições |
|-------|------|-----------|
| `id` | INTEGER | PK, AUTO_INCREMENT |
| `nome` | STRING | NOT NULL |
| `numeroJogadores` | INTEGER | NOT NULL |
| `TorneioId` | INTEGER | FK → Torneios.id |
| `createdAt` | DATETIME | Auto |
| `updatedAt` | DATETIME | Auto |

#### Relação 1:N — Torneio → Equipas

A relação de cardinalidade 1:N está estabelecida entre `Torneios` e `Equipas`: um torneio pode ter várias equipas, mas cada equipa pertence a um único torneio. No Sequelize, esta relação é declarada em `models/Equipa.js`:

```javascript
Torneio.hasMany(Equipa)
Equipa.belongsTo(Torneio)
```

Esta declaração faz com que o Sequelize crie automaticamente a coluna `TorneioId` na tabela `Equipas` como chave estrangeira. A relação é também visível na estrutura das URLs da API, onde as equipas são sempre acedidas no contexto do seu torneio: `/torneios/:torneioId/equipas`.

---

### 3.3 Recursos e Endpoints

A API disponibiliza três recursos: **Users**, **Torneios** e **Equipas**. Todos os endpoints devolvem representações em JSON (`Content-Type: application/json`).

#### Recurso: Users

| Método | Endpoint | Protegido | Descrição |
|--------|----------|-----------|-----------|
| GET | `/users` | Não | Lista todos os utilizadores (sem passwords) |

Este é o único endpoint público. A listagem omite o campo `password` por razões de segurança.

#### Recurso: Autenticação

| Método | Endpoint | Protegido | Descrição |
|--------|----------|-----------|-----------|
| POST | `/auth/token` | Não | Autentica o utilizador e emite um Bearer Token JWT |

**Body (JSON):**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Resposta (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer"
}
```

#### Recurso: Torneios

Todos os endpoints requerem o header `Authorization: Bearer <token>`.

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/torneios` | Lista os torneios do utilizador autenticado |
| POST | `/torneios` | Cria um novo torneio associado ao utilizador |
| PUT | `/torneios/:id` | Atualiza um torneio do utilizador |
| DELETE | `/torneios/:id` | Elimina um torneio do utilizador |

**Body POST/PUT:**
```json
{
  "nome": "Torneio de Verão",
  "jogo": "Valorant"
}
```

#### Recurso: Equipas (aninhadas em Torneios — relação 1:N)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/torneios/:torneioId/equipas` | Lista as equipas de um torneio |
| POST | `/torneios/:torneioId/equipas` | Cria uma equipa num torneio |
| PUT | `/torneios/:torneioId/equipas/:id` | Atualiza uma equipa |
| DELETE | `/torneios/:torneioId/equipas/:id` | Elimina uma equipa |

**Body POST/PUT:**
```json
{
  "nome": "Equipa Alpha",
  "numeroJogadores": 5
}
```

#### Rota protegida de teste

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/protected` | Confirma autenticação, devolve mensagem de sucesso |

#### Print na consola (Requisito 7)

Em todos os controllers protegidos, o detalhe do utilizador autenticado é apresentado na consola do servidor em cada pedido recebido:

```javascript
console.log('Utilizador autenticado:', req.user)
// Exemplo de output: { id: 1, username: 'admin', iat: 1750000000, exp: 1750007200 }
```

---

### 3.4 Camada de Autenticação e Autorização

#### Autenticação — JWT (JSON Web Token)

O processo de autenticação é implementado em `controllers/authController.js` e funciona da seguinte forma:

1. O cliente envia `POST /auth/token` com `username` e `password` no body.
2. O servidor pesquisa o utilizador na base de dados (`User.findOne`).
3. Se as credenciais forem válidas, gera um JWT assinado com a `JWT_SECRET` definida nas variáveis de ambiente, com validade de 2 horas.
4. O token contém no payload o `id` e o `username` do utilizador.
5. O cliente inclui o token em todos os pedidos subsequentes no header `Authorization: Bearer <token>`.

```javascript
// Geração do token (authController.js)
const token = jwt.sign(
  { id: user.id, username: user.username },
  process.env.JWT_SECRET || 'chave_secreta_default',
  { expiresIn: '2h' }
)
return res.json({ access_token: token, token_type: 'Bearer' })
```

#### Middleware de verificação

O middleware `authController.auth` é aplicado a todas as rotas protegidas. Extrai o token do header, verifica a assinatura e a validade, e injeta o objeto `req.user` com os dados do utilizador para uso nos controllers:

```javascript
exports.auth = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Token não fornecido ou formato incorreto' })
  }
  const token = authHeader.split(' ')[1]
  jwt.verify(token, process.env.JWT_SECRET || 'chave_secreta_default', (err, decoded) => {
    if (err) return res.status(403).json({ erro: 'Token inválido' })
    req.user = decoded
    next()
  })
}
```

#### Autorização — Isolamento de dados por utilizador (Requisito 15)

A autorização garante que cada utilizador apenas acede e modifica os seus próprios recursos. Esta lógica está implementada nos controllers de Torneios e Equipas através de filtros nas queries à base de dados.

**Em Torneios** — o `userId` é sempre extraído do token JWT (não do body do pedido), impedindo que um utilizador se faça passar por outro:

```javascript
// Listar — só os torneios do utilizador autenticado
const torneios = await Torneio.findAll({ where: { userId: req.user.id } })

// Criar — associa o torneio ao utilizador autenticado automaticamente
const torneio = await Torneio.create({ ...req.body, userId: req.user.id })

// Atualizar/Eliminar — filtra por id E userId, tornando impossível modificar torneios alheios
await Torneio.destroy({ where: { id: req.params.id, userId: req.user.id } })
```

**Em Equipas** — antes de qualquer operação, verifica-se que o torneio pai pertence ao utilizador autenticado:

```javascript
const torneio = await Torneio.findOne({
  where: { id: req.params.torneioId, userId: req.user.id }
})
if (!torneio) return res.status(404).json({ erro: 'Torneio não encontrado ou sem permissão' })
```

---

### 3.5 Documentação OpenAPI 3.0

A API está documentada no formato OpenAPI 3.0 através da biblioteca `swagger-jsdoc`. A especificação é gerada a partir de ficheiros YAML na pasta `docs/` e servida automaticamente na rota `/docs` através do `swagger-ui-express`.

A documentação inclui:
- Todos os endpoints com métodos, parâmetros, schemas de request body e resposta
- Definição do esquema de autenticação Bearer JWT (`securitySchemes.bearerAuth`)
- Schemas dos modelos `Torneio`, `Equipa` e `User`
- Exemplos de valores nos campos

Acesso: `http://localhost:3000/docs`

---

### 3.6 Collection Postman

O ficheiro `postman_collection.json` na raiz do repositório contém uma collection exportada do Postman com todos os endpoints da API, incluindo exemplos de body para os pedidos POST e PUT, e configuração do token Bearer para as rotas protegidas.

---

### 3.7 Ambiente Multi-Container (Docker)

O ambiente de execução é definido em `docker-compose.yml` e inclui três serviços:

```yaml
services:
  db:       # MySQL 8 — porta 3306
  api:      # Node.js/Express — porta 3000
  frontend: # React servido por Nginx — porta 80
```

#### Serviço `db` (MySQL 8)

Configura a base de dados `torneios_db` com as credenciais de root. Inclui um **healthcheck** que executa `mysqladmin ping` a cada 10 segundos, garantindo que o MySQL está operacional antes de permitir que a API inicie.

#### Serviço `api` (Node.js)

Constrói a imagem a partir do `Dockerfile` da raiz. Recebe as variáveis de ambiente de ligação à base de dados e a `JWT_SECRET`. A diretiva `depends_on: condition: service_healthy` garante que a API só arranca depois do MySQL estar pronto.

#### Serviço `frontend` (React/Nginx)

Constrói a imagem a partir do `Dockerfile` da pasta `parte2/`, que utiliza um **build multi-stage**: uma primeira imagem Node.js 18 compila a aplicação React (`npm run build`), e o artefacto de build é depois copiado para uma imagem Nginx Alpine, que serve os ficheiros estáticos na porta 80.

#### Dockerfiles

**API (`/Dockerfile`):**
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

**Frontend (`/parte2/Dockerfile`):**
```dockerfile
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

### 3.8 Dados de Teste (Seed)

O ficheiro `seed.js` popula a base de dados com dados suficientes para a apresentação. Ao executar `node seed.js`, são criados:

- **3 utilizadores:** `admin` / `password123`, `jogador1` / `pass456`, `jogador2` / `pass789`
- **30 torneios** (20 do admin, 5 do jogador1, 5 do jogador2), com jogos como FIFA 25, Rocket League, Valorant, CS2 e League of Legends
- **50 equipas** distribuídas pelos torneios (2 por cada torneio do admin, 1 por cada torneio dos outros)

Este volume de dados cumpre o requisito mínimo de 30 registos por tabela.

---

## 4. Parte 2 — Aplicação Web React

### 4.1 Tecnologias Utilizadas

| Tecnologia | Versão | Função |
|------------|--------|--------|
| React | 19.2.7 | Framework de UI |
| React Router DOM | 7.18.1 | Roteamento client-side (SPA) |
| Axios | 1.18.1 | Cliente HTTP para comunicação com a API |
| Context API (React) | — | Gestão de estado global de autenticação |
| Nginx | Alpine | Servidor web para servir o build estático |

---

### 4.2 Estrutura da Aplicação

A aplicação é uma SPA (Single Page Application) com roteamento client-side. As rotas estão definidas em `App.jsx`:

| Rota | Componente | Protegida |
|------|-----------|-----------|
| `/login` | `Login` | Não |
| `/torneios` | `Torneios` | Sim |
| `/torneios/novo` | `TorneioForm` | Sim |
| `/torneios/:id/editar` | `TorneioForm` | Sim |
| `/torneios/:torneioId/equipas` | `Equipas` | Sim |
| `/torneios/:torneioId/equipas/nova` | `EquipaForm` | Sim |
| `/torneios/:torneioId/equipas/:id/editar` | `EquipaForm` | Sim |
| `*` (qualquer outra) | Redireciona para `/torneios` | — |

---

### 4.3 Autenticação no Frontend

#### AuthContext (`src/context/AuthContext.jsx`)

O estado de autenticação é gerido com a Context API do React, tornando-o disponível globalmente em todos os componentes sem necessidade de prop drilling.

O contexto expõe:
- `user` — objeto com `{ token, username }`, ou `null` se não autenticado
- `login(username, password)` — chama `POST /auth/token`, guarda o token no `localStorage` e atualiza o estado
- `logout()` — remove o token do `localStorage` e limpa o estado

O estado é inicializado a partir do `localStorage`, pelo que a sessão persiste entre recarregamentos de página:

```javascript
const [user, setUser] = useState(() => {
  const token = localStorage.getItem('token')
  const username = localStorage.getItem('username')
  return token ? { token, username } : null
})
```

#### PrivateRoute (`src/components/PrivateRoute.jsx`)

Componente wrapper que protege as rotas que requerem autenticação. Se o utilizador não estiver autenticado, redireciona automaticamente para `/login`:

```javascript
export default function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}
```

---

### 4.4 Páginas e Funcionalidades

#### Login (`src/pages/Login.jsx`)

Formulário com campos de `username` e `password`. Ao submeter, chama `login()` do `AuthContext`. Em caso de credenciais inválidas, exibe mensagem de erro. Em caso de sucesso, redireciona para `/torneios`.

#### Torneios (`src/pages/Torneios.jsx`)

Lista todos os torneios do utilizador autenticado em formato tabela. Disponibiliza ações para:
- Criar novo torneio (navega para `/torneios/novo`)
- Editar torneio (navega para `/torneios/:id/editar`)
- Ver equipas do torneio (navega para `/torneios/:id/equipas`)
- Apagar torneio (com confirmação via `window.confirm`)

A listagem é carregada automaticamente com `useEffect` ao montar o componente.

#### TorneioForm (`src/pages/TorneioForm.jsx`)

Formulário partilhado para criação e edição de torneios. Deteta automaticamente o modo correto com base na presença do parâmetro `:id` na URL (`isEditar = !!id`). No modo edição, pré-carrega os dados do torneio existente.

#### Equipas (`src/pages/Equipas.jsx`)

Lista as equipas de um torneio específico (identificado por `:torneioId` na URL), com ações para criar, editar e apagar. Exibe o nome do torneio no título da página.

#### EquipaForm (`src/pages/EquipaForm.jsx`)

Análogo ao `TorneioForm`, mas para equipas. Funciona em modo criação e edição, pré-carregando os dados da equipa quando em modo edição.

#### Navbar (componente inline em `App.jsx`)

Barra de navegação presente em todas as páginas (exceto login). Exibe o nome do utilizador autenticado, um link para a página de torneios e um botão de logout.

---

### 4.5 Integração com a API

A comunicação com a API é centralizada em `src/api/api.js`, que cria uma instância do Axios com a URL base da API:

```javascript
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000'
})
```

Um **interceptor de request** injeta automaticamente o token Bearer em todos os pedidos, sem necessidade de o passar manualmente em cada chamada:

```javascript
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

A URL da API é configurável através da variável de ambiente `REACT_APP_API_URL` no ficheiro `.env`, o que permite adaptar a aplicação a diferentes ambientes sem alterar o código.

---

## 5. Como Executar o Projeto

### Pré-requisitos

- Docker Desktop (ou Docker Engine + Docker Compose)

### 1. Popular a base de dados (primeira execução)

```bash
# Iniciar apenas o serviço de base de dados
docker-compose up -d db

# Aguardar o MySQL estar pronto (~15 segundos) e correr o seed
docker-compose run --rm api node seed.js
```

### 2. Iniciar todos os serviços

```bash
docker-compose up --build -d
```

### 3. Aceder à aplicação

| Serviço | URL |
|---------|-----|
| Frontend (React) | http://localhost |
| API (Node.js) | http://localhost:3000 |
| Documentação Swagger | http://localhost:3000/docs |

### 4. Credenciais de teste

| Username | Password |
|----------|----------|
| `admin` | `password123` |
| `jogador1` | `pass456` |
| `jogador2` | `pass789` |

### 5. Parar os serviços

```bash
docker-compose down
```

---

## 6. Análise da Camada de Autenticação e Autorização — OAuth 2.0

O enunciado solicita que a implementação da camada de autenticação e autorização seja explicada e comparada com os diferentes flows de autorização do OAuth 2.0.

### O que é o OAuth 2.0

OAuth 2.0 (RFC 6749) é um framework de autorização que define um conjunto de flows (fluxos) para que aplicações obtenham acesso a recursos protegidos em nome de um utilizador, sem que esse utilizador tenha de partilhar as suas credenciais com a aplicação cliente.

### Flow implementado: Resource Owner Password Credentials

O flow implementado neste projeto é o **Resource Owner Password Credentials Grant** (ROPC), definido na secção 4.3 do RFC 6749. Neste flow:

1. O utilizador (Resource Owner) fornece as suas credenciais (`username` e `password`) diretamente à aplicação cliente (o frontend React).
2. A aplicação cliente envia essas credenciais para o Authorization Server (neste caso, o próprio servidor Node.js, na rota `POST /auth/token`).
3. O servidor valida as credenciais e emite um `access_token` (JWT).
4. O cliente usa o token para aceder aos recursos protegidos, incluindo-o no header `Authorization: Bearer <token>` em cada pedido.

```
[Utilizador] --(username+password)--> [Cliente React]
[Cliente React] --(POST /auth/token)--> [Servidor Node.js]
[Servidor Node.js] --(access_token JWT)--> [Cliente React]
[Cliente React] --(Bearer token)--> [API protegida]
```

O token emitido é um **JWT (JSON Web Token)**, composto por três partes codificadas em Base64 e separadas por pontos:
- **Header:** algoritmo de assinatura (`HS256`) e tipo do token (`JWT`)
- **Payload:** dados do utilizador (`id`, `username`), data de emissão (`iat`) e data de expiração (`exp`, 2 horas)
- **Signature:** HMAC-SHA256 do header e payload, assinado com a `JWT_SECRET`

A vantagem do JWT é ser **auto-contido**: o servidor valida o token verificando apenas a assinatura criptográfica, sem necessidade de consultar a base de dados em cada pedido.

### Comparação com os outros flows do OAuth 2.0

#### Authorization Code Flow

É o flow mais seguro e amplamente recomendado para aplicações web e mobile que acedem a recursos em nome do utilizador através de um fornecedor de identidade externo (ex.: "Iniciar sessão com o Google").

**Funcionamento:**
1. O cliente redireciona o utilizador para o Authorization Server (ex.: Google).
2. O utilizador autentica-se no Authorization Server e aprova as permissões.
3. O Authorization Server redireciona de volta para o cliente com um código de autorização temporário.
4. O cliente troca o código por um `access_token` (comunicação servidor-a-servidor, o código nunca fica exposto no browser).

**Diferença para o ROPC:** as credenciais do utilizador nunca são partilhadas com a aplicação cliente — o utilizador autentica-se diretamente no fornecedor de identidade. É o flow mais adequado quando o cliente é uma aplicação de terceiros que não é de confiança.

**Quando usar:** login social (Google, GitHub, Microsoft), Single Sign-On entre organizações, qualquer cenário onde o cliente é de terceiros.

#### Authorization Code Flow com PKCE (Proof Key for Code Exchange)

Extensão do Authorization Code Flow para clientes que não conseguem guardar um segredo de forma segura, como SPAs (Single Page Applications) ou aplicações mobile. O PKCE substitui o `client_secret` por um par de chaves gerado dinamicamente em cada autenticação, impedindo ataques de interceção do código de autorização.

**Quando usar:** é a variante recomendada para SPAs e aplicações mobile modernas em substituição do Implicit Flow (deprecated).

#### Client Credentials Flow

Usado para comunicação máquina-a-máquina (M2M), sem envolvimento de um utilizador humano. O cliente autentica-se diretamente com as suas próprias credenciais (`client_id` + `client_secret`) e recebe um `access_token`.

**Diferença para o ROPC:** não existe um utilizador — o cliente age em nome próprio. Adequado para microserviços, jobs automáticos ou APIs que comunicam entre si.

**Quando usar:** comunicação entre serviços backend, daemons, integrações automáticas.

#### Implicit Flow (Deprecated)

Flow simplificado onde o `access_token` era devolvido diretamente no URL de redirect, sem código de autorização intermédio. Foi desenhado para SPAs em contextos onde não havia back-channel disponível. Está **deprecated** desde a RFC 9700 por razões de segurança — o token fica exposto no histórico do browser e em logs de servidor. Foi substituído pelo Authorization Code com PKCE.

### Tabela Comparativa

| Flow | Tipo de cliente | Utilizador envolvido | Credenciais expostas ao cliente | Caso de uso principal |
|------|----------------|----------------------|---------------------------------|----------------------|
| **ROPC (implementado)** | App first-party de confiança | Sim | Sim (username/password) | Apps internas, académico |
| Authorization Code | Qualquer | Sim | Não | Login social, third-party |
| Authorization Code + PKCE | SPA / Mobile | Sim | Não | SPAs modernas, apps mobile |
| Client Credentials | Serviço/daemon | Não | Sim (client_secret, no servidor) | M2M, microserviços |
| Implicit (deprecated) | SPA (antigo) | Sim | Token exposto no URL | Não recomendado |

### Justificação da escolha

O flow ROPC foi escolhido por ser o mais adequado para este contexto: trata-se de uma aplicação **first-party** (o cliente React e o servidor são desenvolvidos e controlados pela mesma entidade), em ambiente de desenvolvimento académico, onde a simplicidade de implementação é relevante. O utilizador confia na aplicação cliente para gerir as suas credenciais.

Num cenário de produção real, onde o cliente pudesse ser uma aplicação de terceiros ou onde existisse um fornecedor de identidade centralizado, o **Authorization Code Flow com PKCE** seria a escolha correta — eliminando a necessidade de o cliente lidar diretamente com as credenciais do utilizador, e seguindo as recomendações de segurança atuais para SPAs.

---

## 7. Conclusão

O trabalho implementa um sistema completo de gestão de torneios de videojogos, cumprindo todos os requisitos obrigatórios e valorizáveis do enunciado:

| # | Requisito | Estado |
|---|-----------|--------|
| 1 | Arquitetura REST | ✅ |
| 2 | 4 verbos HTTP (CRUD) | ✅ |
| 3 | 3 recursos diferentes (Users, Torneios, Equipas) | ✅ |
| 4 | Relação 1:N (Torneio → Equipas) | ✅ |
| 5 | Representações JSON | ✅ |
| 6 | Autenticação e Autorização (JWT) | ✅ |
| 7 | Print do utilizador autenticado na consola | ✅ |
| 8 | Documentação OpenAPI 3.0 | ✅ |
| 9 | MySQL como SGBD | ✅ |
| 10 | Node.js como servidor aplicacional | ✅ |
| 11 | Collection Postman | ✅ |
| 12 | Docker multi-container (MySQL + Node.js + Frontend) | ✅ |
| 13 | Framework Express | ✅ |
| 14 | OAuth 2.0 — flow ROPC com JWT | ✅ |
| 15 | Utilizador acede apenas aos seus próprios recursos | ✅ |
| 16 | Análise e comparação dos flows OAuth 2.0 no relatório | ✅ |
| — | Aplicação Web React (Parte 2) | ✅ |

A principal decisão de design foi a adoção de URLs aninhadas para as equipas (`/torneios/:torneioId/equipas`), que torna a relação 1:N explícita na própria interface da API e reforça o isolamento de dados — um utilizador nunca consegue aceder às equipas de um torneio que não lhe pertence, uma vez que a verificação de propriedade do torneio é feita antes de qualquer operação sobre as equipas.

---

*Universidade da Maia — ISMAI | Licenciatura em Informática | Desenvolvimento Web II | 2025/26*
