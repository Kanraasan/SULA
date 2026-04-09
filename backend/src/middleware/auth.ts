import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_sula_123';

export const authorize = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // ambil token dari header authorization: bearer <token>
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'kagak ada token, gak boleh masuk!' });
    }

    try {
      // verifikasi token-nya
      const decoded: any = jwt.verify(token, JWT_SECRET);
      
      // simpan data user ke dalam request biar bisa dipake di controller selanjutnya
      (req as any).user = decoded;

      // cek apakah role-nya diizinin apa gak
      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: 'role kamu gak boleh akses ini ya' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'token-nya udah gak valid nih' });
    }
  };
};
