import cors from 'cors';
import express from 'express';
import { env, hasSupabaseConfig } from './config/env.js';
import { requireAuth } from './middleware/auth.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    supabase: hasSupabaseConfig() ? 'configured' : 'missing-env',
  });
});

app.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

app.listen(env.PORT, () => {
  console.log(`API em http://localhost:${env.PORT}`);

  if (!hasSupabaseConfig()) {
    console.warn('Supabase ainda sem chaves. Copie .env.example para .env e preencha o painel.');
  }
});
