import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function POST(request) {
  try {
    const { role, username, email, password } = await request.json();

    if (role === 'admin') {
      if (username === 'admin' && password === '1234') {
        return NextResponse.json({
          success: true,
          role: 'admin',
          user: { nombre: 'Administrador', apellido: 'Sistema' }
        });
      } else {
        return NextResponse.json({ error: 'INVALID_ADMIN_CREDENTIALS' }, { status: 401 });
      }
    } else if (role === 'patient') {
      const [rows] = await pool.query(
        'SELECT id, nombre, apellido, email, id_medico FROM PACIENTE WHERE email = ? AND contrasena = ?',
        [email, password]
      );

      if (rows.length > 0) {
        return NextResponse.json({
          success: true,
          role: 'patient',
          user: rows[0]
        });
      } else {
        return NextResponse.json({ error: 'INVALID_PATIENT_CREDENTIALS' }, { status: 401 });
      }
    }

    return NextResponse.json({ error: 'INVALID_ROLE' }, { status: 400 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'INTERNAL_SERVER_ERROR' }, { status: 500 });
  }
}
