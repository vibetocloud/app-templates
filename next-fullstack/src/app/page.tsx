import { prisma } from '../lib/prisma';

export default async function Home() {
  const count = await prisma.note.count();
  return (
    <main style={{ fontFamily: 'system-ui', padding: 48 }}>
      <h1>__APP_NAME__</h1>
      <p>{count} notes. Deployed on VibeToCloud.</p>
    </main>
  );
}
