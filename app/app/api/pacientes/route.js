import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';
import { logAudit } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const data = await request.json();
    const { rut, nombre, apellido, fecha_nacimiento, genero, telefono, email, id_medico } = data;

    // Check if RUT already exists
    if (rut) {
      const [existingRut] = await pool.query('SELECT id FROM PACIENTE WHERE rut = ?', [rut]);
      if (existingRut.length > 0) {
        return NextResponse.json({ error: 'RUT_ALREADY_EXISTS' }, { status: 400 });
      }
    }

    // Check if email already exists
    const [existingEmail] = await pool.query('SELECT id FROM PACIENTE WHERE email = ?', [email]);
    if (existingEmail.length > 0) {
      return NextResponse.json({ error: 'EMAIL_ALREADY_EXISTS' }, { status: 400 });
    }

    // Insert patient
    const [result] = await pool.query(
      'INSERT INTO PACIENTE (rut, nombre, apellido, fecha_nacimiento, genero, telefono, email, id_medico) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [rut, nombre, apellido, fecha_nacimiento, genero, telefono, email, id_medico ? parseInt(id_medico) : null]
    );

    const newPacienteId = result.insertId;
    const payloadDespues = { id: newPacienteId, rut, nombre, apellido, fecha_nacimiento, genero, telefono, email, id_medico };

    // Log to MongoDB
    await logAudit('INSERT', 'PACIENTE', null, payloadDespues, 'sistema');

    return NextResponse.json({ success: true, id: newPacienteId });
  } catch (error) {
    console.error('Create patient error:', error);
    return NextResponse.json({ error: 'INTERNAL_SERVER_ERROR' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT id, nombre, apellido, id_medico FROM PACIENTE ORDER BY apellido, nombre');
    
    // Registrar SELECT en la auditoría NoSQL
    await logAudit('SELECT', 'PACIENTE', null, { cantidad_registros: rows.length }, 'sistema');

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Get patients error:', error);
    return NextResponse.json({ error: 'INTERNAL_SERVER_ERROR' }, { status: 500 });
  }
}
