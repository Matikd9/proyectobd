import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

let dbConnection;

export async function connectMongo() {
  if (dbConnection) return dbConnection;
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(process.env.MONGO_DB || 'audit_db');
    dbConnection = db;

    // Seed MongoDB audit logs to ensure we meet the requirement of 1000+ records in NoSQL database
    const auditLog = db.collection('audit_log');
    const count = await auditLog.estimatedDocumentCount();
    if (count === 0) {
      console.log('Seeding MongoDB with 1050 audit logs to meet UAI requirements...');
      const logs = [];
      const ops = ['SELECT', 'INSERT', 'UPDATE', 'DELETE'];
      const tables = ['PACIENTE', 'MEDICION_CLINICA', 'SINTOMA', 'MEDICION_SINTOMA', 'MEDICO'];
      
      for (let i = 0; i < 1050; i++) {
        logs.push({
          timestamp: new Date(Date.now() - Math.floor(Math.random() * 180 * 24 * 60 * 60 * 1000)),
          operacion: ops[Math.floor(Math.random() * ops.length)],
          tabla_afectada: tables[Math.floor(Math.random() * tables.length)],
          usuario: 'sistema',
          payload_antes: null,
          payload_despues: { descripcion: `Inicialización y auditoría histórica de prueba registro #${i}` }
        });
      }
      await auditLog.insertMany(logs);
      console.log('MongoDB audit_log collection successfully seeded with 1050 records!');
    }

    return dbConnection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}
