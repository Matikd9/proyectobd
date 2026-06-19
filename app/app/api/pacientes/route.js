import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';
import { logAudit } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const connection = await pool.getConnection();
  try {
    const data = await request.json();
    const { rut, nombre, apellido, fecha_nacimiento, genero, telefono, email, contrasena, id_medico, enfermedades } = data;

    // Check if RUT already exists
    if (rut) {
      const [existingRut] = await connection.query('SELECT id FROM PACIENTE WHERE rut = ?', [rut]);
      if (existingRut.length > 0) {
        connection.release();
        return NextResponse.json({ error: 'RUT_ALREADY_EXISTS' }, { status: 400 });
      }
    }

    // Check if email already exists
    const [existingEmail] = await connection.query('SELECT id FROM PACIENTE WHERE email = ?', [email]);
    if (existingEmail.length > 0) {
      connection.release();
      return NextResponse.json({ error: 'EMAIL_ALREADY_EXISTS' }, { status: 400 });
    }

    await connection.beginTransaction();

    // Insert patient
    const finalContrasena = contrasena && contrasena.trim() !== '' ? contrasena : '1234';
    const [result] = await connection.query(
      'INSERT INTO PACIENTE (rut, nombre, apellido, fecha_nacimiento, genero, telefono, email, contrasena, id_medico) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [rut, nombre, apellido, fecha_nacimiento, genero, telefono, email, finalContrasena, id_medico ? parseInt(id_medico) : null]
    );

    const newPacienteId = result.insertId;

    // Add diseases if provided
    if (enfermedades && enfermedades.length > 0) {
      for (const sigla of enfermedades) {
        // Find disease ID from ENFERMEDAD table
        const [diseaseRows] = await connection.query('SELECT id FROM ENFERMEDAD WHERE sigla = ?', [sigla]);
        if (diseaseRows.length > 0) {
          const diseaseId = diseaseRows[0].id;
          await connection.query(
            'INSERT INTO PACIENTE_ENFERMEDAD (id_paciente, id_enfermedad, fecha_diagnostico, estado) VALUES (?, ?, CURRENT_DATE(), "activo")',
            [newPacienteId, diseaseId]
          );
        }
      }
    }

    await connection.commit();

    const payloadDespues = { 
      id: newPacienteId, 
      rut, 
      nombre, 
      apellido, 
      fecha_nacimiento, 
      genero, 
      telefono, 
      email, 
      contrasena: '****', 
      id_medico, 
      enfermedades 
    };

    // Log to MongoDB
    await logAudit('INSERT', 'PACIENTE', null, payloadDespues, 'sistema');

    return NextResponse.json({ success: true, id: newPacienteId });
  } catch (error) {
    await connection.rollback();
    console.error('Create patient error:', error);
    return NextResponse.json({ error: 'INTERNAL_SERVER_ERROR' }, { status: 500 });
  } finally {
    connection.release();
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
