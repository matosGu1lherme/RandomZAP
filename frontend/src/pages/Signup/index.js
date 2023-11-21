import React, { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import * as C from "./styles";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import axios from 'axios';

const Signup = () => {
  const [email, setEmail] = useState("");
  const [emailConf, setEmailConf] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [nickname, setNickname] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const { signup } = useAuth();

  const handleSignup = async () => {
    if (!name || !nickname || !email || !emailConf || !senha) {
      setError("Preencha todos os campos");
      return;
    } else if (email !== emailConf) {
      setError("Os e-mails não são iguais");
      return;
    }

    console.log("Name:", name);
    console.log("Nickname:", nickname);
  
    try {
      const response = await axios.post('http://localhost:9000/users', {
        name: name,
        nickname: nickname,
        password: senha,
        email: email,
        photo: 'URL da foto do usuário',
      });
  
      alert("Usuário cadastrado com sucesso!");
      navigate("/");
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro desconhecido';

      // Trate os erros de requisição
      setError(errorMessage);
    }
  };
  

  return (
    <C.Container>
      <C.Label>SISTEMA DE LOGIN</C.Label>
      <C.Content>
      <Input
        type="text"
        placeholder="Digite seu Nome"
        value={name}
        onChange={(e) => [setName(e.target.value), setError("")]}
      />
      <Input
        type="text"
        placeholder="Digite seu Nickname"
        value={nickname}
        onChange={(e) => [setNickname(e.target.value), setError("")]}
      />
        <Input
          type="email"
          placeholder="Digite seu E-mail"
          value={email}
          onChange={(e) => [setEmail(e.target.value), setError("")]}
        />
        <Input
          type="email"
          placeholder="Confirme seu E-mail"
          value={emailConf}
          onChange={(e) => [setEmailConf(e.target.value), setError("")]}
        />
        <Input
          type="password"
          placeholder="Digite sua Senha"
          value={senha}
          onChange={(e) => [setSenha(e.target.value), setError("")]}
        />
        <C.labelError>{error}</C.labelError>
        <Button Text="Inscrever-se" onClick={handleSignup} />
        <C.LabelSignin>
          Já tem uma conta?
          <C.Strong>
            <Link to="/">&nbsp;Entre</Link>
          </C.Strong>
        </C.LabelSignin>
      </C.Content>
    </C.Container>
  );
};

export default Signup;