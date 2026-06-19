import { connectMongo } from './mongo';

export async function logAudit(operation, tabla, payloadAntes, payloadDespues, usuario = 'sistema') {
  try {
    const db = await connectMongo();
    const auditLog = db.collection('audit_log');
    
    await auditLog.insertOne({
      timestamp: new Date(),
      operacion: operation,
      tabla_afectada: tabla,
      usuario: usuario,
      payload_antes: payloadAntes,
      payload_despues: payloadDespues
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
}
