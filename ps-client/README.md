
## Configuração do Projeto
Para instalar as dependências, execute o seguinte comando:
```
npm install
```
Caso ocorra algum bloqueio, execute o comando abaixo no PowerShell:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine
```
- **RemoteSigned**: Permite a execução de scripts criados localmente, mas exige que scripts baixados da internet sejam assinados por um editor confiável.
- **LocalMachine**: Aplica a política a todos os usuários do sistema.
**Importante**: Você precisará executar o PowerShell como Administrador para alterar a política permanentemente.

## Scripts disponíveis
### Compilar e recarregar automaticamente para desenvolvimento
Para iniciar o servidor de desenvolvimento, execute:
```
npm run serve
```
### Compilar e minificar para produção
Para gerar os arquivos otimizados para produção, execute:
```
npm run build
```
### Lint e correção automática de arquivos
Para verificar e corrigir automaticamente o código com o linting, execute:
```
npm run lint
```
<<<<<<< HEAD

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


Instalando o Axios por que sim

No seu projeto Vue.js, abra o terminal e execute:

 bash 
npm install axios
=======
### Personalizar configurações
Consulte a [Referência de Configuração](https://cli.vuejs.org/config/) para mais detalhes sobre como personalizar as configurações do projeto.
>>>>>>> ba809f44425edfdf1ebf843364d2f30b4cdd7893
