# CopyBase-Test

![Badge em Desenvolvimento](http://img.shields.io/static/v1?label=STATUS&message=EM%20DESENVOLVIMENTO&color=GREEN&style=for-the-badge)

## Índice

- [Introdução](#introdução)
- [Instalação](#instalação)
- [Acesso ao projeto](#acesso-ao-projeto)
- [Rodando Localmente](#rodando-localmente)
- [Documentação da API com Swagger](#documentação-da-api-com-swagger)
- [Instalando o Insomnia](#instalando-o-insomnia)
- [Stack Utilizada](#stack-utilizada)
- [Autores](#autores)

## Introdução

Este projeto é parte do teste técnico para a CopyBase, focando no desenvolvimento backend usando TypeScript, Node.js e NestJS.

## Instalação

Para clonar o projeto, use o comando:

```bash
git clone https://github.com/jayymeson/test-backend-copybase.git
```

Após isso pode fechar a janela!

## 📁 Acesso ao projeto

Entre na pasta do projeto pelo Visual Studio, Abra o terminal do visual Studio e
vá para o diretório do projeto com o comando:

```bash
  cd test-backend-copybase
```

## 🌐 Rodando localmente

Use o docker para rodar aplicação

- Linux

```bash
  sudo docker-compose up --build
```

- Windows

```bash
  docker-compose up --build
```

## 📄 Documentação da API com Swagger

A documentação da API está disponível via Swagger. Após iniciar a aplicação, acesse a documentação em:

```bash
   http://localhost:3000/api
```

Nesta interface do Swagger, você poderá visualizar todos os endpoints disponíveis, bem como realizar requisições de teste diretamente através da interface.

## 🛠️ Autenticando no sistema

Para se autenticar no sistema e testar upload da planilha no insomnia, precisa fazer login:

```bash
  http://localhost:3000/auth/login
```
Corpo da requisição: 

```bash
{
	"email": "copybase@test.com",
	"password": "Abc1234*"
}
```

Quando receber o token:

```bash
{
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNvcHliYXNlQHRlc3QuY29tIiwic3ViIjoibW9ja2VkVXNlcklkIiwiaWF0IjoxNzA1MDA1ODA3LCJleHAiOjE3MDUwOTIyMDd9.tC0_5CZrBUvaNwSTNXov2zo2yWMmiGKEDHL6NZAwLcg"
}
```

Você passa no Bearer Token:

![Alt text](image.png)

## 🛠️ Instalando o insomnia

Link para baixar: https://insomnia.rest/download

1. Após fazer a instalação, colar o link do navegador no local mostrado:

![Alt text](image-2.png)
2. Aperte em "send" e logo vai ser retornado o conteúdo:

![Alt text](image-1.png)

## Stack utilizada ⚙

**Linguagens:**
<img align="center" alt="TypeScript" src="https://img.shields.io/badge/-Typescript-blue?style=for-the-badge&logo=typescript&message=TypeScript&color=blue&logoColor=white">

**Frameworks:**
<img align="center" alt="NodeJs" src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white"> <img align="center" alt="Nestjs" src="https://img.shields.io/badge/-NestJS-pink?style=for-the-badge&logo=nestjs&message=NestJs&color=rgb(238,%2058,%2084)">

**Ferramentas:**
<img align="center" src="https://insomnia.rest/images/run.svg" alt="Run in Insomnia">
<img align="center" src="https://img.shields.io/badge/Visual_Studio_Code-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white" alt="Visual Studio">
<img align="center" alt="Sqlite" src="https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white">

## Autor(es) 👨🏼‍💻👨🏼‍💻👨🏼‍💻👨🏼‍💻

| [<img src="https://avatars.githubusercontent.com/u/100086459?v=4" width=115><br><sub>Jaymeson Mendes</sub>](https://github.com/jayymeson)
|
