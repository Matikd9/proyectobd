import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';
import { logAudit } from '@/lib/audit';

export async function POST(request) {
  const connection = await pool.getConnection();
  try {
    const data = await request.json();
    const { 
      id_paciente, 
      id_medico, 
      glucosa_mg_dl, 
      presion_sistolica, 
      presion_diastolica, 
      peso_kg, 
      imc, 
      sintomas,
      momento_dia,
      en_ayunas,
      pie_heridas,
      pie_ampollas,
      pie_rojeces,
      pie_coloracion
    } = data;

    await connection.beginTransaction();

    const [result] = await connection.query(
      `INSERT INTO MEDICION_CLINICA 
       (id_paciente, id_medico, glucosa_mg_dl, presion_sistolica, presion_diastolica, peso_kg, imc, momento_dia, en_ayunas, pie_heridas, pie_ampollas, pie_rojeces, pie_coloracion) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_paciente, 
        id_medico, 
        glucosa_mg_dl, 
        presion_sistolica, 
        presion_diastolica, 
        peso_kg, 
        imc,
        momento_dia,
        en_ayunas !== null ? (en_ayunas ? 1 : 0) : null,
        pie_heridas !== null ? (pie_heridas ? 1 : 0) : null,
        pie_ampollas !== null ? (pie_ampollas ? 1 : 0) : null,
        pie_rojeces !== null ? (pie_rojeces ? 1 : 0) : null,
        pie_coloracion !== null ? (pie_coloracion ? 1 : 0) : null
      ]
    );

    const id_medicion = result.insertId;

    if (sintomas && sintomas.length > 0) {
      const valores = sintomas.map(id_sintoma => [id_medicion, id_sintoma]);
      await connection.query(
        'INSERT INTO MEDICION_SINTOMA (id_medicion, id_sintoma) VALUES ?',
        [valores]
      );
    }

    // --- Generación Automática de Alertas Clínicas ---
    if (glucosa_mg_dl !== null && glucosa_mg_dl !== undefined) {
      const glucosa = parseFloat(glucosa_mg_dl);
      if (glucosa > 200) {
        await connection.query(
          `INSERT INTO ALERTA (id_medicion, id_medico, tipo_alerta, nivel_severidad, mensaje) 
           VALUES (?, ?, ?, ?, ?)`,
          [id_medicion, id_medico, 'Hiperglucemia', 'alta', `El paciente registró glucosa alta de ${glucosa} mg/dL`]
        );
      } else if (glucosa < 70) {
        await connection.query(
          `INSERT INTO ALERTA (id_medicion, id_medico, tipo_alerta, nivel_severidad, mensaje) 
           VALUES (?, ?, ?, ?, ?)`,
          [id_medicion, id_medico, 'Hipoglucemia', 'alta', `El paciente registró glucosa baja de ${glucosa} mg/dL`]
        );
      }
    }

    if (presion_sistolica !== null && presion_sistolica !== undefined && presion_diastolica !== null && presion_diastolica !== undefined) {
      const sist = parseFloat(presion_sistolica);
      const diast = parseFloat(presion_diastolica);
      if (sist > 140 || diast > 90) {
        await connection.query(
          `INSERT INTO ALERTA (id_medicion, id_medico, tipo_alerta, nivel_severidad, mensaje) 
           VALUES (?, ?, ?, ?, ?)`,
          [id_medicion, id_medico, 'Hipertensión', 'media', `El paciente registró presión elevada de ${sist}/${diast} mmHg`]
        );
      }
    }

    await connection.commit();

    const payloadDespues = {
      id_medicion, 
      id_paciente, 
      id_medico, 
      glucosa_mg_dl, 
      presion_sistolica, 
      presion_diastolica, 
      peso_kg, 
      imc, 
      sintomas,
      momento_dia,
      en_ayunas,
      pie_heridas,
      pie_ampollas,
      pie_rojeces,
      pie_coloracion
    };

    // Log the whole transaction as one operation
    await logAudit('INSERT', 'MEDICION_CLINICA_Y_SINTOMAS', null, payloadDespues, 'sistema');

    return NextResponse.json({ success: true, id_medicion });
  } catch (error) {
    await connection.rollback();
    console.error('Create measurement error:', error);
    return NextResponse.json({ error: 'INTERNAL_SERVER_ERROR' }, { status: 500 });
  } finally {
    connection.release();
  }
}
