import { PrismaClient } from '@prisma/client';
import Fastify from 'fastify';

const prisma = new PrismaClient();
const app = Fastify({ logger: true });

app.get('/health', async (_req, reply) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { success: true, data: { status: 'ok' }, error: null };
  } catch {
    return reply.code(503).send({ success: false, data: null, error: 'db unavailable' });
  }
});

app.get('/notes', async () => ({ success: true, data: await prisma.note.findMany(), error: null }));

app.post('/notes', async (req) => {
  const body = (req.body ?? {}) as { body?: string };
  if (!body.body) {
    return { success: false, data: null, error: 'body is required' };
  }
  return { success: true, data: await prisma.note.create({ data: { body: body.body } }), error: null };
});

const port = Number(process.env.PORT ?? 3000);
app.listen({ port, host: '0.0.0.0' }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
