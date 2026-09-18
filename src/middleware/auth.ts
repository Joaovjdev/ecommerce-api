import type { NextFunction, Request, Response } from 'express';
import { requireSupabase } from '../lib/supabase.js';

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token Bearer ausente.' });
    return;
  }

  const accessToken = header.slice('Bearer '.length).trim();

  if (!accessToken) {
    res.status(401).json({ error: 'Token Bearer vazio.' });
    return;
  }

  try {
    const { data, error } = await requireSupabase().auth.getUser(accessToken);

    if (error || !data.user) {
      res.status(401).json({ error: 'Token inválido ou expirado.' });
      return;
    }

    req.user = data.user;
    req.accessToken = accessToken;
    next();
  } catch (err) {
    next(err);
  }
}
