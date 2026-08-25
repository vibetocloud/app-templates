import Anthropic from '@anthropic-ai/sdk';
import Fastify from 'fastify';

const app = Fastify({ logger: true });
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.get('/health', async () => ({
  success: true,
  data: { status: 'ok', hasKey: Boolean(process.env.ANTHROPIC_API_KEY) },
  error: null,
}));

app.post('/chat', async (req, reply) => {
  const body = (req.body ?? {}) as { message?: string };
  if (!body.message) {
    return { success: false, data: null, error: 'message is required' };
  }
  try {
    const res = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 1024,
      messages: [{ role: 'user', content: body.message }],
    });
    const text = res.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as { text: string }).text)
      .join('');
    return { success: true, data: { reply: text }, error: null };
  } catch (err) {
    return reply.code(502).send({ success: false, data: null, error: `LLM call failed: ${String(err)}` });
  }
});

const port = Number(process.env.PORT ?? 3000);
app.listen({ port, host: '0.0.0.0' }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
