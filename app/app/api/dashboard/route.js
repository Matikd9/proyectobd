import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role');
  const session_patient_id = searchParams.get('session_patient_id');
  const idioma = searchParams.get('idioma') || 'es';

  try {
    if (role === 'admin') {
      // 1. KPI Cards
      const [[{ total_pacientes }]] = await pool.query('SELECT COUNT(*) as total_pacientes FROM PACIENTE');
      const [[{ total_mediciones }]] = await pool.query('SELECT COUNT(*) as total_mediciones FROM MEDICION_CLINICA');
      const [[{ alertas_pendientes }]] = await pool.query("SELECT COUNT(*) as alertas_pendientes FROM ALERTA WHERE estado = 'pendiente'");

      // 2. Síntomas más reportados (Top 3)
      const [top_sintomas] = await pool.query(`
        SELECT st.nombre_sintoma as name, COUNT(*) as value
        FROM MEDICION_SINTOMA ms
        JOIN SINTOMA s ON ms.id_sintoma = s.id
        JOIN SINTOMA_TRADUCCION st ON s.id = st.id_sintoma AND st.id_idioma = ?
        GROUP BY ms.id_sintoma, st.nombre_sintoma
        ORDER BY value DESC
        LIMIT 3
      `, [idioma]);

      // 3. Últimas Alertas
      const [alertas] = await pool.query(`
        SELECT a.*, p.nombre as p_nombre, p.apellido as p_apellido, m.apellido as m_apellido
        FROM ALERTA a
        JOIN MEDICION_CLINICA mc ON a.id_medicion = mc.id
        JOIN PACIENTE p ON mc.id_paciente = p.id
        JOIN MEDICO m ON a.id_medico = m.id
        ORDER BY a.fecha_alarma DESC
        LIMIT 5
      `);

      return NextResponse.json({
        kpis: {
          total_pacientes,
          total_mediciones,
          alertas_pendientes
        },
        top_sintomas,
        alertas
      });

    } else if (role === 'patient') {
      const p_id = parseInt(session_patient_id);

      // 1. KPI Cards
      const [[{ mis_mediciones }]] = await pool.query('SELECT COUNT(*) as mis_mediciones FROM MEDICION_CLINICA WHERE id_paciente = ?', [p_id]);
      const [[{ promedio_glucosa }]] = await pool.query('SELECT ROUND(AVG(glucosa_mg_dl), 1) as promedio_glucosa FROM MEDICION_CLINICA WHERE id_paciente = ?', [p_id]);
      const [[{ prom_sys, prom_dia }]] = await pool.query('SELECT ROUND(AVG(presion_sistolica), 1) as prom_sys, ROUND(AVG(presion_diastolica), 1) as prom_dia FROM MEDICION_CLINICA WHERE id_paciente = ?', [p_id]);
      const [[{ promedio_imc }]] = await pool.query('SELECT ROUND(AVG(imc), 1) as promedio_imc FROM MEDICION_CLINICA WHERE id_paciente = ?', [p_id]);

      // 2. Su síntoma más reportado
      const [fav_sintoma] = await pool.query(`
        SELECT st.nombre_sintoma as name, COUNT(*) as value
        FROM MEDICION_SINTOMA ms
        JOIN SINTOMA s ON ms.id_sintoma = s.id
        JOIN SINTOMA_TRADUCCION st ON s.id = st.id_sintoma AND st.id_idioma = ?
        WHERE ms.id_medicion IN (SELECT id FROM MEDICION_CLINICA WHERE id_paciente = ?)
        GROUP BY ms.id_sintoma, st.nombre_sintoma
        ORDER BY value DESC
        LIMIT 1
      `, [idioma, p_id]);

      return NextResponse.json({
        kpis: {
          mis_mediciones: mis_mediciones || 0,
          promedio_glucosa: promedio_glucosa || 0,
          presion_promedio: prom_sys && prom_dia ? `${prom_sys}/${prom_dia}` : '--',
          promedio_imc: promedio_imc || 0
        },
        fav_sintoma: fav_sintoma.length > 0 ? fav_sintoma[0].name : '--'
      });
    }

    return NextResponse.json({ error: 'Rol no válido' }, { status: 400 });
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json({ error: 'INTERNAL_SERVER_ERROR' }, { status: 500 });
  }
}
