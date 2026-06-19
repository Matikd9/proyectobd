import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 });
    }

    const [rows] = await pool.query(
      `SELECT e.sigla 
       FROM PACIENTE_ENFERMEDAD pe
       JOIN ENFERMEDAD e ON pe.id_enfermedad = e.id
       WHERE pe.id_paciente = ? AND pe.estado = 'activo'`,
      [id]
    );

    const enfermedades = rows.map(r => r.sigla);
    return NextResponse.json(enfermedades);
  } catch (error) {
    console.error('Get patient illnesses error:', error);
    return NextResponse.json({ error: 'INTERNAL_SERVER_ERROR' }, { status: 500 });
  }
}
