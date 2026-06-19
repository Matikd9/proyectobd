import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';
import { logAudit } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = (page - 1) * limit;

  const id_medico = searchParams.get('id_medico');
  const fecha_inicio = searchParams.get('fecha_inicio');
  const fecha_fin = searchParams.get('fecha_fin');
  const id_idioma = searchParams.get('idioma') || 'es';
  const role = searchParams.get('role');
  const session_patient_id = searchParams.get('session_patient_id');

  let id_paciente = searchParams.get('id_paciente');
  if (role === 'patient') {
    id_paciente = session_patient_id;
  }

  let query = `
    SELECT 
      mc.*,
      p.nombre AS paciente_nombre, p.apellido AS paciente_apellido,
      m.nombre AS medico_nombre, m.apellido AS medico_apellido,
      (
        SELECT JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', s.id,
            'nombre', st.nombre_sintoma,
            'categoria', s.categoria
          )
        )
        FROM MEDICION_SINTOMA ms
        JOIN SINTOMA s ON ms.id_sintoma = s.id
        JOIN SINTOMA_TRADUCCION st ON s.id = st.id_sintoma AND st.id_idioma = ?
        WHERE ms.id_medicion = mc.id
      ) as sintomas
    FROM MEDICION_CLINICA mc
    JOIN PACIENTE p ON mc.id_paciente = p.id
    JOIN MEDICO m ON mc.id_medico = m.id
    WHERE 1=1
  `;
  
  const params = [id_idioma];

  if (id_paciente) {
    query += ` AND mc.id_paciente = ?`;
    params.push(id_paciente);
  }
  if (id_medico) {
    query += ` AND mc.id_medico = ?`;
    params.push(id_medico);
  }
  if (fecha_inicio) {
    query += ` AND mc.fecha_hora >= ?`;
    params.push(fecha_inicio);
  }
  if (fecha_fin) {
    query += ` AND mc.fecha_hora <= ?`;
    params.push(fecha_fin);
  }

  // Cuenta total para paginación
  const countQuery = `SELECT COUNT(*) as total FROM (${query}) as sub`;
  
  query += ` ORDER BY mc.fecha_hora DESC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  try {
    const [countResult] = await pool.query(countQuery, params.slice(0, -2));
    const total = countResult[0].total;

    const [rows] = await pool.query(query, params);

    // Registrar SELECT en la auditoría NoSQL
    await logAudit(
      'SELECT', 
      'MEDICION_CLINICA', 
      null, 
      { 
        filtros: { id_paciente, id_medico, fecha_inicio, fecha_fin, idioma: id_idioma },
        resultados_obtenidos: rows.length,
        total_coincidencias: total
      }, 
      'sistema'
    );

    return NextResponse.json({
      data: rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get historico error:', error);
    return NextResponse.json({ error: 'INTERNAL_SERVER_ERROR' }, { status: 500 });
  }
}
