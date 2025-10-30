const Conta = require('../models/Conta');
const Artista = require('../models/Artista');
const Organizador = require('../models/Organizador');
const { generateToken } = require('../utils/jwt');

class AuthController {
  static async register(req, res) {
    try {
      const { email, senha, tipo, nome, descricao = '' } = req.body;

      // Verificar se email já existe
      const contaExistente = await Conta.buscarPorEmail(email);
      if (contaExistente) {
        return res.status(400).json({ error: 'Email já existe' });
      }

      // Criar conta
      const contaId = await Conta.criar(email, senha);

      // Criar perfil específico
      if (tipo === 'artista') {
        await Artista.criar(contaId, nome, descricao);
      } else if (tipo === 'organizador') {
        await Organizador.criar(contaId, nome, descricao);
      } else {
        await Conta.deletar(contaId);
        return res.status(400).json({ error: 'Tipo de usuário inválido' });
      }

      const token = generateToken({ id: contaId, email, tipo });
      res.status(201).json({
        token,
        user: { id: contaId, email, tipo, nome }
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async login(req, res) {
    try {
      const { email, senha } = req.body;

      // Buscar conta
      const conta = await Conta.buscarPorEmail(email);
      if (!conta) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Verificar senha
      const senhaValida = await Conta.verificarSenha(senha, conta.senha_hash);
      if (!senhaValida) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Buscar tipo de usuário
      let usuario = await Artista.buscarPorId(conta.id);
      let tipo = 'artista';

      if (!usuario) {
        usuario = await Organizador.buscarPorId(conta.id);
        tipo = 'organizador';
      }

      if (!usuario) {
        return res.status(500).json({ error: 'Perfil de usuário não encontrado' });
      }

      const token = generateToken({ id: conta.id, email: conta.email, tipo });
      res.json({
        token,
        user: { id: conta.id, email: conta.email, tipo, nome: usuario.nome }
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async atualizarPerfil(req, res) {
    try {
      const { nome, senha } = req.body;
      
      // Atualizar senha se fornecida
      if (senha) {
        await Conta.atualizarSenha(req.user.id, senha);
      }
      
      // Atualizar nome no perfil específico
      if (nome) {
        if (req.user.tipo === 'artista') {
          await Artista.atualizar(req.user.id, { nome });
        } else if (req.user.tipo === 'organizador') {
          await Organizador.atualizar(req.user.id, { nome });
        }
      }
      
      res.json({ message: 'Perfil atualizado com sucesso' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar perfil' });
    }
  }

  static async socialLogin(req, res) {
    try {
      console.log('Dados recebidos no social login:', req.body);
      
      const { email, nome, provider, providerId, tipo } = req.body;
      
      // Validação mais detalhada
      if (!email || !nome || !provider || !tipo) {
        console.log('Dados incompletos:', { email: !!email, nome: !!nome, provider: !!provider, tipo: !!tipo });
        return res.status(400).json({ error: 'Dados incompletos. Todos os campos são obrigatórios.' });
      }
      
      if (!email.includes('@')) {
        return res.status(400).json({ error: 'Email inválido' });
      }
      
      if (!['artista', 'organizador'].includes(tipo)) {
        return res.status(400).json({ error: 'Tipo de usuário inválido' });
      }
      
      // Verificar se usuário já existe
      let conta = await Conta.buscarPorEmail(email);
      let usuario;
      
      if (conta) {
        console.log('Usuário já existe, fazendo login...');
        // Usuário existe, fazer login
        usuario = await Artista.buscarPorId(conta.id);
        let tipoExistente = 'artista';
        
        if (!usuario) {
          usuario = await Organizador.buscarPorId(conta.id);
          tipoExistente = 'organizador';
        }
        
        if (!usuario) {
          console.log('Perfil não encontrado para conta existente');
          return res.status(500).json({ error: 'Perfil de usuário não encontrado' });
        }
        
        const token = generateToken({ id: conta.id, email: conta.email, tipo: tipoExistente });
        res.json({
          token,
          user: { id: conta.id, email: conta.email, tipo: tipoExistente, nome: usuario.nome }
        });
      } else {
        console.log('Criando novo usuário social...');
        // Novo usuário, criar conta com o tipo escolhido
        const contaId = await Conta.criarSocial(email, provider, providerId || `${provider}_${Date.now()}`);
        console.log('Conta criada com ID:', contaId);
        
        if (tipo === 'artista') {
          await Artista.criar(contaId, nome, `Artista conectado via ${provider}`);
          console.log('Perfil de artista criado');
        } else if (tipo === 'organizador') {
          await Organizador.criar(contaId, nome, `Organizador conectado via ${provider}`);
          console.log('Perfil de organizador criado');
        }
        
        const token = generateToken({ id: contaId, email, tipo });
        res.status(201).json({
          token,
          user: { id: contaId, email, tipo, nome }
        });
      }
    } catch (error) {
      console.error('Erro detalhado no login social:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor',
        details: error.message 
      });
    }
  }
}

module.exports = AuthController;
