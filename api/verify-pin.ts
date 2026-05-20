import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { pin } = req.body ?? {};
  const expected = process.env.PINGATE_CODE;

  if (!expected) {
    return res.status(200).json({ ok: true });
  }

  if (typeof pin === 'string' && pin === expected) {
    return res.status(200).json({ ok: true });
  }

  return res.status(401).json({ error: 'Feil kode' });
}
