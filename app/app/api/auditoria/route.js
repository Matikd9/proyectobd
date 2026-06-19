import { NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongo';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await connectMongo();
    const auditLog = db.collection('audit_log');
    
    // Leer últimos 50 documentos, orden cronológico inverso
    const logs = await auditLog.find()
                               .sort({ timestamp: -1 })
                               .limit(50)
                               .toArray();

    return NextResponse.json(logs);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error interno del servidor al leer MongoDB' }, { status: 500 });
  }
}
