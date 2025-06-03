import supabase from "../config/supabase.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Cadastro de Usuario
const registerUser = async (request, response) => {
  const { nome, email, senha } = request.body;

  const existingUser = await supabase.from("users").select("id").eq("email", email).single();
  if (existingUser.data) {
    return response.status(400).json({ mensagem: "Email já cadastrado." });
  }

  const passwordHashed = await bcrypt.hash(senha, 10);

  const { data, error } = await supabase.from("users").insert([
    { nome, email, senha: passwordHashed }
  ]);

  if (error) {
    return response.status(500).json({ erro: "Erro", error });
  }

  return response.status(201).json({ mensagem: "Usuário criado com sucesso!" });
};

// Login
const authentication = async (request, response) => {
  const { email, senha } = request.body;

  const { data: user, error } = await supabase.from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !user) {
    return response.status(401).json({ mensagem: "Credenciais inválidas" });
  }

  const senhaEnviada = await bcrypt.compare(senha, user.senha);

  if (!senhaEnviada) {
    return response.status(401).json({ mensagem: "Credenciais inválidas" });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  response.json({ token });
};

// Listar todos os usuários
const listUsers = async (request, response) => {
  const { data, error } = await supabase.from("users").select("id, nome, email");

  if (error) {
    return response.status(500).json({ erro: "Erro", error });
  }

  response.json(data);
};

// Atualizar dados de um registro (usuário)
const updateUser = async (request, response) => {
  const { id } = request.params;
  const { nome, email, senha } = request.body;

  const dataUpdated = {
    ...(nome && { nome }),
    ...(email && { email }),
    ...(senha && { senha: await bcrypt.hash(senha, 10) })
  };

  const { error } = await supabase.from("users").update(dataUpdated).eq("id", id);

  if (error) {
    return response.status(500).json({ error: "erro:", error });
  }

  response.json({ mensagem: "Usuário atualizado com sucesso" });
};

// Excluir usuário
const deleteUser = async (request, response) => {
  const { id } = request.params;

  const { error } = await supabase.from("users").delete()
  .eq("id", id);

  if (error) {
    return response.status(500).json({ mensagem: "Erro ao excluir o usuário", error });
  }

  response.json({ mensagem: "Usuário excluído com sucesso" });
};

export { registerUser, authentication, listUsers, updateUser, deleteUser };
