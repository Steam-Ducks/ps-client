
# 📦 Configuração do Projeto Vue.js

## ✅ Pré-requisitos

Antes de começar, certifique-se de que o [Node.js](https://nodejs.org/) esteja instalado em sua máquina.

> ⚠️ **Importante:** Para executar os comandos `npm`, é necessário estar na pasta do projeto chamada `ps-client`.

---

## 📥 Instalação das Dependências

Abra o terminal, navegue até a pasta `ps-client` e execute:

```bash
npm install
```

### 🔒 Problemas com permissões no PowerShell?

Caso ocorra algum bloqueio ao executar scripts, abra o PowerShell como **Administrador** e execute:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine
```

- **RemoteSigned**: Permite execução de scripts locais não assinados.
- **LocalMachine**: Aplica essa política a todos os usuários do sistema.

---

## 🛠️ Scripts Disponíveis

### 🚀 Servidor de Desenvolvimento

> ⚠️ **Importante:** Inicialize o back-end antes.

Para inicializar o vue, execute o seguinte comnado no termnal:

```bash
npm run serve
```

### 🏗️ Build de Produção

Compila e minifica o projeto para produção:

```bash
npm run build
```
