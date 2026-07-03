# Relatório - Desenvolvimento Web II
## Exame Prático de Avaliação Final - Época Normal 2025/26
## Tema: Sistema de Gestão de Torneios de Videojogos

---

## 1. Introdução

O tema escolhido para este trabalho é um **Sistema de Gestão de Torneios de Videojogos**. A plataforma permite que utilizadores registados criem e gerem os seus próprios torneios, associando equipas a cada um. 

Este relatório foca-se na **Parte 2**, que aborda o desenvolvimento da Aplicação Web Cliente em ReactJS. Esta aplicação consome os dados fornecidos pela API REST desenvolvida na primeira parte do projeto.

---

## 2. Estrutura do Repositório (Parte 2)

```text
/parte2/                     # Aplicação React
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

## 3. Aplicação Web React

### 3.1 Tecnologias Utilizadas

| Tecnologia | Versão | Função |
|------------|--------|--------|
| React | 19.2.7 | Framework de interface |
| React Router DOM | 7.18.1 | Roteamento no cliente (SPA) |
| Axios | 1.18.1 | Cliente HTTP para comunicar com a API |
| Context API | - | Gestão de estado global de autenticação |
| Nginx | Alpine | Servidor web para disponibilizar o build |

---

### 3.2 Estrutura da Aplicação

A aplicação é uma SPA (Single Page Application). As rotas estão definidas em `App.jsx`:

| Rota | Componente | Protegida |
|------|-----------|-----------|
| `/login` | `Login` | Não |
| `/torneios` | `Torneios` | Sim |
| `/torneios/novo` | `TorneioForm` | Sim |
| `/torneios/:id/editar` | `TorneioForm` | Sim |
| `/torneios/:torneioId/equipas` | `Equipas` | Sim |
| `/torneios/:torneioId/equipas/nova` | `EquipaForm` | Sim |
| `/torneios/:torneioId/equipas/:id/editar` | `EquipaForm` | Sim |
| `*` (qualquer outra) | Redireciona para `/torneios` | - |

---

### 3.3 Autenticação no Frontend

#### AuthContext (`src/context/AuthContext.jsx`)

O estado de autenticação é gerido com a Context API do React. O contexto partilha a informação do utilizador (`user`, com token e username) de forma global.

O estado é guardado no `localStorage` para a sessão não se perder quando a página recarrega:

```javascript
const [user, setUser] = useState(() => {
  const token = localStorage.getItem('token')
  const username = localStorage.getItem('username')
  return token ? { token, username } : null
})
```

#### PrivateRoute (`src/components/PrivateRoute.jsx`)

Este componente protege as rotas privadas. Se não houver autenticação, redireciona o utilizador para a página de login:

```javascript
export default function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}
```

---

### 3.4 Páginas e Funcionalidades

- **Login (`Login.jsx`)**: Formulário de entrada. Usa o `AuthContext` para tentar o login e, em caso de sucesso, envia o utilizador para `/torneios`.
- **Torneios (`Torneios.jsx`)**: Lista os torneios do utilizador numa tabela. Permite criar, editar, apagar e navegar para as equipas.
- **TorneioForm (`TorneioForm.jsx`)**: Formulário para criar ou editar um torneio.
- **Equipas (`Equipas.jsx`)**: Lista as equipas de um determinado torneio.
- **EquipaForm (`EquipaForm.jsx`)**: Formulário para adicionar ou editar as informações de uma equipa.
- **Navbar**: Presente em todas as páginas privadas. Mostra quem está logado e o botão de logout.

---

### 3.5 Integração com a API

A comunicação com a API é feita através do Axios, configurado em `src/api/api.js`:

```javascript
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000'
})
```

Usamos um **interceptor de request** que insere automaticamente o token em todos os pedidos:

```javascript
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

---

### 3.6 Docker do Frontend

A aplicação é compilada e servida usando Docker. O `Dockerfile` usa duas etapas de construção: primeiro, um container Node.js gera o build estático. Em seguida, o build é copiado para um container Nginx que serve a aplicação de forma otimizada.

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

## 4. Como Executar a Aplicação React

Para colocar o projeto em funcionamento usando o Docker Compose:

### 1. Iniciar os serviços
No diretório principal, execute:
```bash
docker-compose up --build -d
```

### 2. Aceder à aplicação
A interface da aplicação cliente estará disponível em:
`http://localhost`

### Credenciais de Teste

| Username | Password |
|----------|----------|
| `admin` | `password123` |
| `jogador1` | `pass456` |
| `jogador2` | `pass789` |
