import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Cargo } from '@prisma/client';

export const adminDiretoriaMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(400).json({ error: 'Token inválido' });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const allowedRoles = [Cargo.ADMIN, Cargo.DIRETORIA, Cargo.CARTA];
    if (!decoded.cargo || !allowedRoles.includes(decoded.cargo)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};