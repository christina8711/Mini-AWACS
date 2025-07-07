import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const { token } = cookie.parse(req.headers.cookie || '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user) throw new Error();

    res.status(200).json({ user: { id: user.id, email: user.email } });
  } catch {
    res.status(401).json({ message: 'Unauthorized' });
  }
}