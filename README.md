# RandomZAP
O RandomZAP é um projeto de sistemas distribuidos que conecta dois clientes desconhecidos de forma aleatória, em um chat.

## Características de Sistemas Distribuidos
- Pear to Pear (P2P)
- Cliente-Servidor

## Tecnologias 
- FrontEnd: React
- BackEnd: Node
- WebRTC
- Banco de Dados: MySQL

## Funcionalidades
### Fluxo Principal
- O cliente podera realizar a criação de uma conta
    * Cadastrar username
    * Cadastrar Email
    * Foto de Perfil
- O cliente podera se logar
- Entrar em uma fila de conversa
- Mandar mensagens de texto no chat

### Fluxo Alternativo
- Cliente pode cancelar uma espera na fila
- Cliente pode sair de uma conversa
- Cliente pode deslogar

### Fluxo Idealizado
- Cliente podera mandar imagens

- Cliente podera conversar com **N** pessoas aleatorias

## WebRTC
A comunicação entre os cliente é feita pela serviço do WebRTC, que implementa funcionalidade de comunicação peer to peer, além de administrar autorização e tranmissão de dados como audio, video etc. Dentro do projeto a biblioteca é usada para comunicação dos web chats após estabelecimento da conexão pelo sinaling-server

## Stun-SERVER
Para realizar a conexão passando pelo NAT, é necessario realizar antes uma conexão com o stun server para solicitar dados como, IP e Portas publicas de conexão.

O servidor-STUN usado foi o servidor publico da google(url: stun:stun.1.google.com:19302), que retornava os dados necessarios para estabelecimento da conexão.

## Sinaling- Server
Servidor intermediario desenvolvidor durante o projeto que organiza a comunicação entre os usuarios, ate que eles possam se tornar cadidatos ICE, compartilhando uma conexão SDP.

O servidor recebe conexões dos usúarios da interface grafíca, por meio de WebSocket, e administra ofertas e respostas, para dar inicio a uma conexão peer to peer

## Funcionamento
1 - O clientes são reconhecidos como candidatos a uma potencial conexão, porém por regras de firewall e NAT a conexão entre dois browser é dificultada.

2 - Para isso é usado um STUN server, que no caso é um servidor publico google que quando requisitado pela biblioteca Peer.js retorna informações necessarias para que ocorra a conexão entre dois Hosts

3 - O Host então solicita seus dados ao servidor e guarda a resposta do servidor STUN, após isso ele envia os dados obtidos ao Sinaling-Server, que vai administrar que as informações sejam trocadas entre os usuarios

4 - É encaminhado ao Sinaling-Server uma conexão SDP que contem os dados necessarios para realizar a conexão, nela podem ser vinculados dados como permições de audio, video etc, porém no caso do Chat usaremos apenas uma coneção de para troca de dados simples

5 - O servidor encaminha a mensagem para o candidato escolhido, e atravez dos dados da conexão SDP é estabelecido uma conexão peerTopeer

## Como Rodar
#### Migrações do Banco de dados
* Criar no banco de dados MySql a tabela "random_zap"
* cd sinaling_server
* yarn db:makemigrations --name whatever
* yarn sequelize db:migrate

#### Sinalig Server
* cd sinaling_server
* yarn install
* node src/index.js

#### Chat Web
* cd chat_web
* yarn install
* yarn start


### Arquitetura

<img src="arquiteturaSD.png">

## Equipe
- Catarine Cruz
- Guilherme Matos 