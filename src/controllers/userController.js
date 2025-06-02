import supabase from "../config/supabase.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Cadastro de Usuario

const registerUser = async (request, response) => {
  // Desestruturação do objeto
  const { nome, email, senha } = request.body;

  // Cria um hash para a senha informada
  const passwordHashed = await bcrypt.hash(senha, 10);

  // Abre a conexão com o Supabase (Tabela users)
  const { data, error } = await supabase.from("users").insert([
    {
      nome,
      email,
      senha: passwordHashed,
    },
  ]);
  if (error) {
    return response.status(500).json({
      erro: "Erro",
      error,
    });
  }
  return response.status(201).json({
    mensagem: "Usuário criado com sucesso!",
  });
};

// Login
const authentication = async (request, response) => {
    

  // Desestruturação do objeto
  const { email, senha } = request.body;

  // Abre a conexão com o Supabase (Tabela users)
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !users) {
    return response.status(401).json({
      mensagem: "Credenciais inválidas",
    });
  }
  // Criptogtrafa a senha e compara com a do Data Base
  const senhaEnviada = await bcrypt.compare(senha, users.senha);

  if (!senhaEnviada) {
    return response.status(401).json({
      mensagem: "Credenciais inválidas",
    });
  }
  //   Gera o token(jwt)

  const token = jwt.sign(
    {id: user.id},
    process.env.JWT_SECRET,
    {expiresIn: "1d"}
  );

//   Devolve o token
  response.json({token});
};