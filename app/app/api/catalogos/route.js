import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';
import { logAudit } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const idioma = searchParams.get('idioma') || 'es';

  try {
    const [medicos] = await pool.query(`
      SELECT id, nombre, apellido, 
        CASE WHEN ? = 'en' THEN 
          CASE especialidad 
            WHEN 'Endocrinología' THEN 'Endocrinology'
            WHEN 'Cardiología' THEN 'Cardiology'
            WHEN 'Medicina General' THEN 'General Medicine'
            ELSE especialidad
          END
        ELSE especialidad END as especialidad
      FROM MEDICO
    `, [idioma]);
    
    const [sintomas] = await pool.query(`
      SELECT s.id, st.nombre_sintoma as nombre, s.categoria 
      FROM SINTOMA s
      JOIN SINTOMA_TRADUCCION st ON s.id = st.id_sintoma
      WHERE st.id_idioma = ?
    `, [idioma]);

    const [enfermedades] = await pool.query(`
      SELECT e.id, et.nombre_enfermedad as nombre 
      FROM ENFERMEDAD e
      JOIN ENFERMEDAD_TRADUCCION et ON e.id = et.id_enfermedad
      WHERE et.id_idioma = ?
    `, [idioma]);

    // Registrar SELECT en la auditoría NoSQL
    await logAudit(
      'SELECT', 
      'CATALOGOS', 
      null, 
      { 
        idioma_consultado: idioma, 
        conteo: { medicos: medicos.length, sintomas: sintomas.length, enfermedades: enfermedades.length } 
      }, 
      'sistema'
    );

    return NextResponse.json({ medicos, sintomas, enfermedades });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error interno del servidor al cargar catálogos' }, { status: 500 });
  }
}
