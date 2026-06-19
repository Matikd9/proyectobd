'use client';
import { useState, useEffect } from 'react';
import './globals.css';

// Diccionario de UI
const dict = {
  es: {
    title: 'M.P.C',
    login_title: 'Iniciar Sesión',
    login_role: 'Rol de Usuario',
    login_admin: 'Médico / Administrador',
    login_patient: 'Paciente',
    login_user: 'Usuario',
    login_email: 'Correo Electrónico',
    login_pass: 'Contraseña',
    login_btn: 'Ingresar',
    logout_btn: 'Cerrar Sesión',
    welcome: 'Hola',
    tab0: 'Dashboard',
    tab1: 'Registro de Paciente',
    tab2: 'Ingreso de Medición',
    tab3: 'Histórico de Mediciones',
    tab4: 'Log de Auditoría',
    // Tab 0 Dashboard
    db_total_patients: 'Pacientes Registrados',
    db_total_measurements: 'Mediciones Clínicas',
    db_active_alerts: 'Alertas Activas',
    db_my_measurements: 'Mis Mediciones',
    db_avg_glucose: 'Glucosa Promedio',
    db_avg_bp: 'Presión Promedio',
    db_avg_bmi: 'IMC Promedio',
    db_top_symptoms: 'Síntomas más Reportados',
    db_recent_alerts: 'Alertas Clínicas Recientes',
    db_fav_symptom: 'Mi Síntoma más Frecuente',
    db_no_alerts: 'No hay alertas activas en el sistema',
    db_no_symptoms: 'No has reportado síntomas',
    db_advice: 'Consejo Clínico',
    db_advice_text: 'Recuerda reportar tus mediciones clínicas todos los días para que tu médico pueda hacer un seguimiento preciso.',
    // Tab 1
    t1_rut: 'RUT',
    t1_name: 'Nombre',
    t1_lastname: 'Apellido',
    t1_dob: 'Fecha de Nacimiento',
    t1_gender: 'Género',
    t1_gender_m: 'Masculino',
    t1_gender_f: 'Femenino',
    t1_phone: 'Teléfono',
    t1_email: 'Correo Electrónico',
    t1_medico: 'Médico de Cabecera Asignado',
    t1_password: 'Contraseña (Por defecto "1234")',
    t1_diseases: 'Enfermedades Crónicas Diagnosticadas',
    t1_disease_dbt: 'Diabetes (DBT)',
    t1_disease_hta: 'Hipertensión (HTA)',
    btn_save: 'Guardar',
    btn_loading: 'Guardando...',
    t1_success: 'Paciente registrado con ID: ',
    // Tab 2
    t2_patient: 'Seleccionar Paciente',
    t2_doctor: 'Médico de Cabecera',
    t2_glucose: 'Glucosa (mg/dL)',
    t2_sys: 'Presión Sistólica',
    t2_dia: 'Presión Diastólica',
    t2_weight: 'Peso (kg)',
    t2_height: 'Estatura (cm) - para IMC',
    t2_symptoms: 'Síntomas (Opcional)',
    t2_success: 'Medición registrada con ID: ',
    // Tab 3
    t3_filter_patient: 'Filtrar por Paciente',
    t3_filter_start: 'Fecha Inicio',
    t3_filter_end: 'Fecha Fin',
    t3_search: 'Buscar',
    t3_date: 'Fecha',
    t3_patient_col: 'Paciente',
    t3_doctor_col: 'Médico',
    t3_glucose_col: 'Glucosa',
    t3_sys_dia_col: 'P.A.',
    t3_imc_col: 'IMC',
    t3_symptoms_col: 'Síntomas',
    t3_prev: 'Anterior',
    t3_next: 'Siguiente',
    // Tab 4
    t4_timestamp: 'Fecha/Hora',
    t4_op: 'Operación',
    t4_table: 'Tabla',
    t4_details: 'Detalles',
    // Validation & Errors
    val_positive: 'Por favor, introduce valores numéricos mayores a cero.',
    err_EMAIL_ALREADY_EXISTS: 'El email ya está registrado.',
    err_RUT_ALREADY_EXISTS: 'El RUT ya está registrado.',
    err_INVALID_ADMIN_CREDENTIALS: 'Credenciales de administrador incorrectas.',
    err_INVALID_PATIENT_CREDENTIALS: 'Correo o contraseña incorrectos.',
    err_INTERNAL_SERVER_ERROR: 'Error interno del servidor. Por favor, asegúrese de recrear los contenedores limpiando volúmenes.',
    err_CONNECTION_ERROR: 'Error de red al conectar con el servidor.',
    // New translations for chronic controls
    t2_morning: 'Mañana',
    t2_afternoon: 'Tarde',
    t2_night: 'Noche',
    t2_time_of_day: 'Momento del Día',
    t2_fasting: 'En Ayunas',
    t2_foot_inspection: 'Revisión de Pies (Marque si detecta alguna anomalía)',
    t2_foot_wounds: 'Heridas',
    t2_foot_blisters: 'Ampollas',
    t2_foot_redness: 'Rojeces',
    t2_foot_color: 'Cambio Coloración',
    t2_diabetes_section: 'Control Clínico de Diabetes',
    t2_hypertension_section: 'Control Clínico de Hipertensión',
    t3_foot_ok: 'Pies Sanos',
    t3_foot_issues: 'Detalle Pies: ',
    t3_wounds: 'Heridas',
    t3_blisters: 'Ampollas',
    t3_redness: 'Rojeces',
    t3_color: 'Cambio color',
    t3_fasting: 'Ayunas',
    t3_no_fasting: 'No Ayunas'
  },
  en: {
    title: 'M.P.C',
    login_title: 'Sign In',
    login_role: 'User Role',
    login_admin: 'Doctor / Administrator',
    login_patient: 'Patient',
    login_user: 'Username',
    login_email: 'Email Address',
    login_pass: 'Password',
    login_btn: 'Sign In',
    logout_btn: 'Sign Out',
    welcome: 'Hello',
    tab0: 'Dashboard',
    tab1: 'Patient Registration',
    tab2: 'Measurement Entry',
    tab3: 'Measurement History',
    tab4: 'Audit Log',
    // Tab 0 Dashboard
    db_total_patients: 'Monitored Patients',
    db_total_measurements: 'Clinical Measurements',
    db_active_alerts: 'Active Alerts',
    db_my_measurements: 'My Measurements',
    db_avg_glucose: 'Average Glucose',
    db_avg_bp: 'Average BP',
    db_avg_bmi: 'Average BMI',
    db_top_symptoms: 'Most Reported Symptoms',
    db_recent_alerts: 'Recent Clinical Alerts',
    db_fav_symptom: 'My Most Common Symptom',
    db_no_alerts: 'No active alerts in system',
    db_no_symptoms: 'No symptoms reported yet',
    db_advice: 'Clinical Advice',
    db_advice_text: 'Remember to register your clinical measurements every day so your doctor can perform a precise tracking.',
    // Tab 1
    t1_rut: 'National ID (RUT)',
    t1_name: 'First Name',
    t1_lastname: 'Last Name',
    t1_dob: 'Date of Birth',
    t1_gender: 'Gender',
    t1_gender_m: 'Male',
    t1_gender_f: 'Female',
    t1_phone: 'Phone',
    t1_email: 'Email',
    t1_medico: 'Assigned Primary Doctor',
    t1_password: 'Password (Default "1234")',
    t1_diseases: 'Diagnosed Chronic Illnesses',
    t1_disease_dbt: 'Diabetes (DBT)',
    t1_disease_hta: 'Hypertension (HTA)',
    btn_save: 'Save',
    btn_loading: 'Saving...',
    t1_success: 'Patient registered with ID: ',
    // Tab 2
    t2_patient: 'Select Patient',
    t2_doctor: 'Primary Doctor',
    t2_glucose: 'Glucose (mg/dL)',
    t2_sys: 'Systolic Pressure',
    t2_dia: 'Diastolic Pressure',
    t2_weight: 'Weight (kg)',
    t2_height: 'Height (cm) - for BMI',
    t2_symptoms: 'Symptoms (Optional)',
    t2_success: 'Measurement registered with ID: ',
    // Tab 3
    t3_filter_patient: 'Filter by Patient',
    t3_filter_start: 'Start Date',
    t3_filter_end: 'End Date',
    t3_search: 'Search',
    t3_date: 'Date',
    t3_patient_col: 'Patient',
    t3_doctor_col: 'Doctor',
    t3_glucose_col: 'Glucose',
    t3_sys_dia_col: 'B.P.',
    t3_imc_col: 'BMI',
    t3_symptoms_col: 'Symptoms',
    t3_prev: 'Previous',
    t3_next: 'Next',
    // Tab 4
    t4_timestamp: 'Timestamp',
    t4_op: 'Operation',
    t4_table: 'Table',
    t4_details: 'Details',
    // Validation & Errors
    val_positive: 'Please enter numeric values greater than zero.',
    err_EMAIL_ALREADY_EXISTS: 'The email is already registered.',
    err_RUT_ALREADY_EXISTS: 'The RUT is already registered.',
    err_INVALID_ADMIN_CREDENTIALS: 'Incorrect administrator credentials.',
    err_INVALID_PATIENT_CREDENTIALS: 'Incorrect email or password.',
    err_INTERNAL_SERVER_ERROR: 'Internal server error. Please ensure you rebuild the Docker containers with clean volumes.',
    err_CONNECTION_ERROR: 'Connection error with the server.',
    // New translations for chronic controls
    t2_morning: 'Morning',
    t2_afternoon: 'Afternoon',
    t2_night: 'Night',
    t2_time_of_day: 'Time of Day',
    t2_fasting: 'Fasting',
    t2_foot_inspection: 'Foot Inspection (Check if any anomaly is detected)',
    t2_foot_wounds: 'Wounds',
    t2_foot_blisters: 'Blisters',
    t2_foot_redness: 'Redness',
    t2_foot_color: 'Color Changes',
    t2_diabetes_section: 'Diabetes Clinical Control',
    t2_hypertension_section: 'Hypertension Clinical Control',
    t3_foot_ok: 'Healthy Feet',
    t3_foot_issues: 'Foot Issues: ',
    t3_wounds: 'Wounds',
    t3_blisters: 'Blisters',
    t3_redness: 'Redness',
    t3_color: 'Color change',
    t3_fasting: 'Fasting',
    t3_no_fasting: 'Not Fasting'
  }
};

export default function App() {
  const [lang, setLang] = useState('es');
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const t = dict[lang];

  // Catálogos
  const [medicos, setMedicos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [sintomas, setSintomas] = useState([]);
  const [enfermedades, setEnfermedades] = useState([]);

  useEffect(() => {
    if (session) {
      fetchCatalogs();
      fetchPacientes();
      setActiveTab(0);
    }
  }, [lang, session]);

  const fetchCatalogs = async () => {
    try {
      const res = await fetch(`/api/catalogos?idioma=${lang}`);
      const data = await res.json();
      if (data.medicos) setMedicos(data.medicos);
      if (data.sintomas) setSintomas(data.sintomas);
      if (data.enfermedades) setEnfermedades(data.enfermedades);
    } catch (e) { console.error(e); }
  };

  const fetchPacientes = async () => {
    try {
      const res = await fetch('/api/pacientes');
      const data = await res.json();
      setPacientes(data);
    } catch (e) { console.error(e); }
  };

  const handleLogout = () => {
    setSession(null);
  };

  const translateError = (errCode) => {
    return t[`err_${errCode}`] || errCode;
  };

  // Si no hay sesión activa, mostrar pantalla de Login
  if (!session) {
    return (
      <div className="container">
        <header className="header">
          <h1>{t.title}</h1>
          <div className="lang-selector">
            <select value={lang} onChange={(e) => setLang(e.target.value)}>
              <option value="es">🇪🇸 Español</option>
              <option value="en">🇺🇸 English</option>
            </select>
          </div>
        </header>
        <LoginForm t={t} translateError={translateError} onLoginSuccess={setSession} />
      </div>
    );
  }

  // Filtrar pestañas visibles según el rol
  const tabsToShow = session.role === 'patient' ? [0, 2, 3] : [0, 1, 2, 3, 4];

  return (
    <div className="container">
      <header className="header">
        <div>
          <h1>{t.title}</h1>
          <span style={{ color: 'var(--success-color)', fontSize: '0.9rem' }}>
            ● {t.welcome}, {session.user.nombre} {session.user.apellido}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className="btn" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', background: 'var(--danger-color)' }} onClick={handleLogout}>
            {t.logout_btn}
          </button>
          <div className="lang-selector">
            <select value={lang} onChange={(e) => setLang(e.target.value)}>
              <option value="es">🇪🇸 Español</option>
              <option value="en">🇺🇸 English</option>
            </select>
          </div>
        </div>
      </header>

      <div className="tabs">
        {tabsToShow.map(num => (
          <button
            key={num}
            className={`tab-btn ${activeTab === num ? 'active' : ''}`}
            onClick={() => setActiveTab(num)}
          >
            {t[`tab${num}`]}
          </button>
        ))}
      </div>

      <div className="card">
        {activeTab === 0 && <TabDashboard t={t} session={session} lang={lang} />}
        {activeTab === 1 && (
          <TabRegistroPaciente
            t={t}
            translateError={translateError}
            onRegister={fetchPacientes}
            medicos={medicos}
          />
        )}
        {activeTab === 2 && (
          <TabIngresoMedicion
            t={t}
            pacientes={pacientes}
            medicos={medicos}
            sintomas={sintomas}
            session={session}
          />
        )}
        {activeTab === 3 && (
          <TabHistorico
            t={t}
            pacientes={pacientes}
            lang={lang}
            session={session}
          />
        )}
        {activeTab === 4 && <TabAuditoria t={t} />}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// COMPONENTE: Formulario de Login
// -----------------------------------------------------------------------------
function LoginForm({ t, translateError, onLoginSuccess }) {
  const [role, setRole] = useState('admin');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = role === 'admin'
      ? { role, username, password }
      : { role, email, password };

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        onLoginSuccess(data);
      } else {
        setError(translateError(data.error));
      }
    } catch (err) {
      setError(translateError('CONNECTION_ERROR'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '450px', margin: '2rem auto' }}>
      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>{t.login_title}</h2>
      {error && <div className="alert error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{t.login_role}</label>
          <select className="form-control" value={role} onChange={(e) => { setRole(e.target.value); setError(null); }}>
            <option value="admin">{t.login_admin}</option>
            <option value="patient">{t.login_patient}</option>
          </select>
        </div>

        {role === 'admin' ? (
          <div className="form-group">
            <label>{t.login_user}</label>
            <input
              required
              type="text"
              className="form-control"
              placeholder="e.g. admin"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
        ) : (
          <div className="form-group">
            <label>{t.login_email}</label>
            <input
              required
              type="email"
              className="form-control"
              placeholder="e.g. johndoe@gmail.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
        )}

        <div className="form-group">
          <label>{t.login_pass}</label>
          <input
            required
            type="password"
            className="form-control"
            placeholder="••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
          {loading ? t.btn_loading : t.login_btn}
        </button>
      </form>
    </div>
  );
}

// -----------------------------------------------------------------------------
// TAB 0: Dashboard (Dashboard de Telemonitoreo)
// -----------------------------------------------------------------------------
function TabDashboard({ t, session, lang }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(`/api/dashboard?role=${session.role}&session_patient_id=${session.user.id}&idioma=${lang}&_t=${Date.now()}`);
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [session, lang]);

  if (loading) {
    return <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading Dashboard...</div>;
  }

  if (!data) return null;

  const isAdmin = session.role === 'admin';

  return (
    <div>
      {/* 1. KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {isAdmin ? (
          <>
            <div className="kpi-card" style={{ background: '#eff4ff', borderLeft: '5px solid var(--primary-color)' }}>
              <h3>{t.db_total_patients}</h3>
              <p>{data.kpis.total_pacientes}</p>
            </div>
            <div className="kpi-card" style={{ background: '#eff4ff', borderLeft: '5px solid var(--success-color)' }}>
              <h3>{t.db_total_measurements}</h3>
              <p>{data.kpis.total_mediciones}</p>
            </div>
            <div className="kpi-card" style={{
              background: data.kpis.alertas_pendientes > 0 ? '#ffdad6' : '#eff4ff',
              borderLeft: `5px solid ${data.kpis.alertas_pendientes > 0 ? 'var(--danger-color)' : 'var(--success-color)'}`
            }}>
              <h3>{t.db_active_alerts}</h3>
              <p style={{ color: data.kpis.alertas_pendientes > 0 ? 'var(--danger-color)' : 'inherit' }}>
                {data.kpis.alertas_pendientes}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="kpi-card" style={{ background: '#eff4ff', borderLeft: '5px solid var(--primary-color)' }}>
              <h3>{t.db_my_measurements}</h3>
              <p>{data.kpis.mis_mediciones}</p>
            </div>
            <div className="kpi-card" style={{
              background: data.kpis.promedio_glucosa > 140 || data.kpis.promedio_glucosa < 70 ? '#ffdad6' : '#eff4ff',
              borderLeft: `5px solid ${data.kpis.promedio_glucosa > 140 || data.kpis.promedio_glucosa < 70 ? 'var(--danger-color)' : 'var(--success-color)'}`
            }}>
              <h3>{t.db_avg_glucose}</h3>
              <p>{data.kpis.promedio_glucosa} <span style={{ fontSize: '1rem', fontWeight: '500' }}>mg/dL</span></p>
            </div>
            <div className="kpi-card" style={{ background: '#eff4ff', borderLeft: '5px solid var(--primary-hover)' }}>
              <h3>{t.db_avg_bp}</h3>
              <p>{data.kpis.presion_promedio} <span style={{ fontSize: '1rem', fontWeight: '500' }}>mmHg</span></p>
            </div>
            <div className="kpi-card" style={{ background: '#eff4ff', borderLeft: '5px solid var(--success-color)' }}>
              <h3>{t.db_avg_bmi}</h3>
              <p>{data.kpis.promedio_imc}</p>
            </div>
          </>
        )}
      </div>

      {/* 2. Charts and Lists details */}
      {isAdmin ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Top Síntomas (CSS Bar Chart) */}
          <div className="sub-section">
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>{t.db_top_symptoms}</h3>
            {data.top_sintomas && data.top_sintomas.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {data.top_sintomas.map((item, idx) => {
                  const maxVal = Math.max(...data.top_sintomas.map(s => s.value));
                  const pct = maxVal > 0 ? (item.value / maxVal) * 100 : 0;
                  return (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: '600' }}>
                        <span>{item.name}</span>
                        <span>{item.value}</span>
                      </div>
                      <div style={{ height: '10px', background: '#e5eeff', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: 'var(--primary-color)', borderRadius: '4px', transition: 'width 0.5s ease-out' }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ color: 'var(--text-secondary)' }}>{t.db_no_symptoms}</div>
            )}
          </div>

          {/* Alertas Recientes */}
          <div className="sub-section">
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--danger-color)' }}>{t.db_recent_alerts}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {data.alertas && data.alertas.length > 0 ? (
                data.alertas.map((a, idx) => (
                  <div key={idx} style={{
                    padding: '0.75rem 1rem',
                    background: a.nivel_severidad === 'alta' ? '#ffdad6' : '#eff4ff',
                    borderRadius: '8px',
                    borderLeft: `4px solid ${a.nivel_severidad === 'alta' ? 'var(--danger-color)' : 'orange'}`,
                    fontSize: '0.875rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', marginBottom: '0.2rem' }}>
                      <span>{a.tipo_alerta}</span>
                      <span className={`badge badge-${a.nivel_severidad === 'alta' ? 'alta' : 'media'}`}>{a.nivel_severidad}</span>
                    </div>
                    <p style={{ color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{a.mensaje}</p>
                    <small style={{ color: 'var(--text-secondary)' }}>
                      Paciente: {a.p_nombre} {a.p_apellido} | Medico: {a.m_apellido} | {new Date(a.fecha_alarma).toLocaleDateString()}
                    </small>
                  </div>
                ))
              ) : (
                <div style={{ color: 'var(--text-secondary)' }}>{t.db_no_alerts}</div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Mi Síntoma Frecuente */}
          <div className="sub-section">
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>{t.db_fav_symptom}</h3>
            <div style={{
              padding: '2rem',
              background: '#eff4ff',
              borderRadius: '12px',
              textAlign: 'center',
              border: '1px dashed var(--primary-hover)'
            }}>
              {data.fav_sintoma && data.fav_sintoma !== '--' ? (
                <>
                  <span className="badge badge-alta" style={{ fontSize: '1.2rem', padding: '0.5rem 1.5rem' }}>
                    {data.fav_sintoma}
                  </span>
                  <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Has reportado este síntoma con mayor frecuencia en las últimas semanas.
                  </p>
                </>
              ) : (
                <div style={{ color: 'var(--text-secondary)' }}>{t.db_no_symptoms}</div>
              )}
            </div>
          </div>

          {/* Consejo Clínico */}
          <div className="sub-section">
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--success-color)' }}>{t.db_advice}</h3>
            <div style={{ padding: '1.5rem 2rem', background: '#a6f2d1', color: '#00422b', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h4 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>{t.db_advice}</h4>
              <p style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>{t.db_advice_text}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// TAB 1: Registro de Paciente
// -----------------------------------------------------------------------------
function TabRegistroPaciente({ t, translateError, onRegister, medicos }) {
  const [form, setForm] = useState({ rut: '', nombre: '', apellido: '', fecha_nacimiento: '', genero: 'M', telefono: '', email: '', contrasena: '', id_medico: '' });
  const [enfermedades, setEnfermedades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch('/api/pacientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, enfermedades })
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: 'success', text: t.t1_success + data.id });
        setForm({ rut: '', nombre: '', apellido: '', fecha_nacimiento: '', genero: 'M', telefono: '', email: '', contrasena: '', id_medico: '' });
        setEnfermedades([]);
        onRegister();
      } else {
        setMsg({ type: 'error', text: translateError(data.error) });
      }
    } catch (e) {
      setMsg({ type: 'error', text: translateError('CONNECTION_ERROR') });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      {msg && <div className={`alert ${msg.type}`}>{msg.text}</div>}
      <div className="grid-2">
        <div className="form-group">
          <label>{t.t1_rut}</label>
          <input required type="text" className="form-control" placeholder="12.345.678-9" value={form.rut} onChange={e => setForm({ ...form, rut: e.target.value })} />
        </div>
        <div className="form-group">
          <label>{t.t1_name}</label>
          <input required type="text" className="form-control" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
        </div>
        <div className="form-group">
          <label>{t.t1_lastname}</label>
          <input required type="text" className="form-control" value={form.apellido} onChange={e => setForm({ ...form, apellido: e.target.value })} />
        </div>
        <div className="form-group">
          <label>{t.t1_dob}</label>
          <input required type="date" className="form-control" value={form.fecha_nacimiento} onChange={e => setForm({ ...form, fecha_nacimiento: e.target.value })} />
        </div>
        <div className="form-group">
          <label>{t.t1_gender}</label>
          <select className="form-control" value={form.genero} onChange={e => setForm({ ...form, genero: e.target.value })}>
            <option value="M">{t.t1_gender_m}</option>
            <option value="F">{t.t1_gender_f}</option>
          </select>
        </div>
        <div className="form-group">
          <label>{t.t1_phone}</label>
          <input type="tel" className="form-control" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} />
        </div>
        <div className="form-group">
          <label>{t.t1_email}</label>
          <input required type="email" className="form-control" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="form-group">
          <label>{t.t1_medico}</label>
          <select required className="form-control" value={form.id_medico} onChange={e => setForm({ ...form, id_medico: e.target.value })}>
            <option value="">--</option>
            {medicos.map(m => <option key={m.id} value={m.id}>{m.nombre} {m.apellido} - {m.especialidad}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>{t.t1_password}</label>
          <input type="password" placeholder="1234" className="form-control" value={form.contrasena} onChange={e => setForm({ ...form, contrasena: e.target.value })} />
        </div>
      </div>

      <div className="form-group" style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>{t.t1_diseases}</label>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={enfermedades.includes('DBT')} onChange={e => {
              if (e.target.checked) setEnfermedades([...enfermedades, 'DBT']);
              else setEnfermedades(enfermedades.filter(d => d !== 'DBT'));
            }} />
            <span>{t.t1_disease_dbt}</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={enfermedades.includes('HTA')} onChange={e => {
              if (e.target.checked) setEnfermedades([...enfermedades, 'HTA']);
              else setEnfermedades(enfermedades.filter(d => d !== 'HTA'));
            }} />
            <span>{t.t1_disease_hta}</span>
          </label>
        </div>
      </div>

      <button type="submit" className="btn" disabled={loading}>{loading ? t.btn_loading : t.btn_save}</button>
    </form>
  );
}

// -----------------------------------------------------------------------------
// TAB 2: Ingreso de Medición
// -----------------------------------------------------------------------------
function TabIngresoMedicion({ t, pacientes, medicos, sintomas, session }) {
  const isPatient = session.role === 'patient';
  const defaultPatientId = isPatient ? session.user.id.toString() : '';
  const defaultDoctorId = isPatient && session.user.id_medico ? session.user.id_medico.toString() : '';

  const [form, setForm] = useState({
    id_paciente: defaultPatientId,
    id_medico: defaultDoctorId,
    glucosa_mg_dl: '',
    presion_sistolica: '',
    presion_diastolica: '',
    peso_kg: '',
    height_m: '',
    momento_dia: 'Mañana',
    en_ayunas: false,
    pie_heridas: false,
    pie_ampollas: false,
    pie_rojeces: false,
    pie_coloracion: false
  });
  const [patientDiseases, setPatientDiseases] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  // Sincronizar id_paciente e id_medico si inicia como paciente
  useEffect(() => {
    if (isPatient) {
      setForm(prev => ({
        ...prev,
        id_paciente: session.user.id.toString(),
        id_medico: session.user.id_medico ? session.user.id_medico.toString() : ''
      }));
    }
  }, [isPatient, session]);

  // Consultar patologías activas al cambiar de paciente
  useEffect(() => {
    if (!form.id_paciente) {
      setPatientDiseases([]);
      return;
    }
    let active = true;
    async function fetchDiseases() {
      try {
        const res = await fetch(`/api/pacientes/${form.id_paciente}/enfermedades`);
        if (res.ok && active) {
          const data = await res.json();
          setPatientDiseases(data);
        }
      } catch (err) {
        console.error("Error fetching patient diseases:", err);
      }
    }
    fetchDiseases();
    return () => {
      active = false;
    };
  }, [form.id_paciente]);

  const handlePatientChange = (patientId) => {
    const selectedPatient = pacientes.find(p => p.id.toString() === patientId);
    setForm(prev => ({
      ...prev,
      id_paciente: patientId,
      id_medico: selectedPatient && selectedPatient.id_medico ? selectedPatient.id_medico.toString() : ''
    }));
  };

  const toggleSymptom = (id) => {
    if (selectedSymptoms.includes(id)) {
      setSelectedSymptoms(selectedSymptoms.filter(sid => sid !== id));
    } else {
      setSelectedSymptoms([...selectedSymptoms, id]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    // Validación de números estrictamente positivos
    const peso = parseFloat(form.peso_kg);
    const height = parseFloat(form.height_m);

    if (peso <= 0 || height <= 0 || isNaN(peso) || isNaN(height)) {
      setMsg({ type: 'error', text: t.val_positive });
      setLoading(false);
      return;
    }

    const hasDiabetes = patientDiseases.includes('DBT');
    const hasHypertension = patientDiseases.includes('HTA');

    let glucosa = null;
    if (hasDiabetes) {
      glucosa = parseFloat(form.glucosa_mg_dl);
      if (isNaN(glucosa) || glucosa <= 0) {
        setMsg({ type: 'error', text: t.val_positive });
        setLoading(false);
        return;
      }
    }

    let sistolica = null;
    let diastolica = null;
    if (hasHypertension) {
      sistolica = parseFloat(form.presion_sistolica);
      diastolica = parseFloat(form.presion_diastolica);
      if (isNaN(sistolica) || sistolica <= 0 || isNaN(diastolica) || diastolica <= 0) {
        setMsg({ type: 'error', text: t.val_positive });
        setLoading(false);
        return;
      }
    }

    try {
      const imc = (peso / Math.pow(height / 100, 2)).toFixed(2);

      const payload = {
        id_paciente: parseInt(form.id_paciente),
        id_medico: parseInt(form.id_medico),
        glucosa_mg_dl: hasDiabetes ? glucosa : null,
        presion_sistolica: hasHypertension ? sistolica : null,
        presion_diastolica: hasHypertension ? diastolica : null,
        peso_kg: peso,
        imc: parseFloat(imc),
        sintomas: selectedSymptoms,
        momento_dia: hasHypertension ? form.momento_dia : null,
        en_ayunas: hasHypertension ? (form.en_ayunas ? true : false) : null,
        pie_heridas: hasDiabetes ? (form.pie_heridas ? true : false) : null,
        pie_ampollas: hasDiabetes ? (form.pie_ampollas ? true : false) : null,
        pie_rojeces: hasDiabetes ? (form.pie_rojeces ? true : false) : null,
        pie_coloracion: hasDiabetes ? (form.pie_coloracion ? true : false) : null
      };

      const res = await fetch('/api/mediciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: 'success', text: t.t2_success + data.id_medicion });
        setForm({
          id_paciente: defaultPatientId,
          id_medico: isPatient && session.user.id_medico ? session.user.id_medico.toString() : '',
          glucosa_mg_dl: '',
          presion_sistolica: '',
          presion_diastolica: '',
          peso_kg: '',
          height_m: '',
          momento_dia: 'Mañana',
          en_ayunas: false,
          pie_heridas: false,
          pie_ampollas: false,
          pie_rojeces: false,
          pie_coloracion: false
        });
        setSelectedSymptoms([]);
      } else {
        setMsg({ type: 'error', text: translateError(data.error) });
      }
    } catch (e) {
      setMsg({ type: 'error', text: translateError('CONNECTION_ERROR') });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      {msg && <div className={`alert ${msg.type}`}>{msg.text}</div>}

      {/* Datos generales de la medición */}
      <div className="grid-2">
        <div className="form-group">
          <label>{t.t2_patient}</label>
          <select
            required
            className="form-control"
            disabled={isPatient}
            value={form.id_paciente}
            onChange={e => handlePatientChange(e.target.value)}
          >
            {isPatient ? (
              <option value={session.user.id}>{session.user.nombre} {session.user.apellido}</option>
            ) : (
              <>
                <option value="">--</option>
                {pacientes.map(p => <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>)}
              </>
            )}
          </select>
        </div>
        <div className="form-group">
          <label>{t.t2_doctor}</label>
          <select
            required
            className="form-control"
            disabled={isPatient}
            value={form.id_medico}
            onChange={e => setForm({ ...form, id_medico: e.target.value })}
          >
            {isPatient ? (
              medicos.filter(m => m.id === session.user.id_medico).map(m => (
                <option key={m.id} value={m.id}>{m.nombre} {m.apellido} - {m.especialidad}</option>
              ))
            ) : (
              <>
                <option value="">--</option>
                {medicos.map(m => <option key={m.id} value={m.id}>{m.nombre} {m.apellido} - {m.especialidad}</option>)}
              </>
            )}
          </select>
        </div>
        <div className="form-group">
          <label>{t.t2_weight}</label>
          <input required type="number" min="0.1" step="0.1" className="form-control" value={form.peso_kg} onChange={e => setForm({ ...form, peso_kg: e.target.value })} />
        </div>
        <div className="form-group">
          <label>{t.t2_height}</label>
          <input required type="number" min="1" step="1" className="form-control" value={form.height_m} onChange={e => setForm({ ...form, height_m: e.target.value })} />
        </div>
      </div>

      {/* Controles dinámicos para Diabetes (DBT) */}
      {patientDiseases.includes('DBT') && (
        <div style={{ marginTop: '1.5rem', padding: '1.2rem', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#fdf2f2' }}>
          <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#991b1b', fontSize: '1rem', fontWeight: 'bold' }}>
            {t.t2_diabetes_section}
          </h4>
          <div className="grid-2">
            <div className="form-group">
              <label>{t.t2_glucose}</label>
              <input required type="number" min="0.1" step="0.1" className="form-control" value={form.glucosa_mg_dl} onChange={e => setForm({ ...form, glucosa_mg_dl: e.target.value })} />
            </div>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem', color: '#7f1d1d' }}>{t.t2_foot_inspection}</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input type="checkbox" checked={form.pie_heridas} onChange={e => setForm({ ...form, pie_heridas: e.target.checked })} />
                  <span>{t.t2_foot_wounds}</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input type="checkbox" checked={form.pie_ampollas} onChange={e => setForm({ ...form, pie_ampollas: e.target.checked })} />
                  <span>{t.t2_foot_blisters}</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input type="checkbox" checked={form.pie_rojeces} onChange={e => setForm({ ...form, pie_rojeces: e.target.checked })} />
                  <span>{t.t2_foot_redness}</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input type="checkbox" checked={form.pie_coloracion} onChange={e => setForm({ ...form, pie_coloracion: e.target.checked })} />
                  <span>{t.t2_foot_color}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Controles dinámicos para Hipertensión (HTA) */}
      {patientDiseases.includes('HTA') && (
        <div style={{ marginTop: '1.5rem', padding: '1.2rem', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#eff6ff' }}>
          <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e40af', fontSize: '1rem', fontWeight: 'bold' }}>
            {t.t2_hypertension_section}
          </h4>
          <div className="grid-2">
            <div className="form-group">
              <label>{t.t2_sys}</label>
              <input required type="number" min="0.1" step="0.1" className="form-control" value={form.presion_sistolica} onChange={e => setForm({ ...form, presion_sistolica: e.target.value })} />
            </div>
            <div className="form-group">
              <label>{t.t2_dia}</label>
              <input required type="number" min="0.1" step="0.1" className="form-control" value={form.presion_diastolica} onChange={e => setForm({ ...form, presion_diastolica: e.target.value })} />
            </div>
            <div className="form-group">
              <label>{t.t2_time_of_day}</label>
              <select required className="form-control" value={form.momento_dia} onChange={e => setForm({ ...form, momento_dia: e.target.value })}>
                <option value="Mañana">{t.t2_morning}</option>
                <option value="Tarde">{t.t2_afternoon}</option>
                <option value="Noche">{t.t2_night}</option>
              </select>
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '1.8rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: '#1e3a8a', fontWeight: '500' }}>
                <input type="checkbox" checked={form.en_ayunas} onChange={e => setForm({ ...form, en_ayunas: e.target.checked })} />
                <span>{t.t2_fasting}</span>
              </label>
            </div>
          </div>
        </div>
      )}

      <div className="form-group" style={{ marginTop: '2rem' }}>
        <label>{t.t2_symptoms}</label>
        <div className="symptoms-grid">
          {sintomas.map(s => (
            <label key={s.id} className="checkbox-label">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <input type="checkbox" checked={selectedSymptoms.includes(s.id)} onChange={() => toggleSymptom(s.id)} />
                <span>{s.nombre}</span>
              </div>
              <span className={`badge badge-${s.categoria.toLowerCase()}`}>{s.categoria}</span>
            </label>
          ))}
        </div>
      </div>

      <button type="submit" className="btn" disabled={loading}>{loading ? t.btn_loading : t.btn_save}</button>
    </form>
  );
}

// -----------------------------------------------------------------------------
// TAB 3: Histórico de Mediciones
// -----------------------------------------------------------------------------
function TabHistorico({ t, pacientes, lang, session }) {
  const isPatient = session.role === 'patient';
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ id_paciente: isPatient ? session.user.id.toString() : '', fecha_inicio: '', fecha_fin: '' });

  const fetchHistorico = async () => {
    try {
      const q = new URLSearchParams({
        page,
        limit: 10,
        idioma: lang,
        role: session.role,
        session_patient_id: session.user.id,
        _t: Date.now().toString()
      });

      if (filters.id_paciente) q.append('id_paciente', filters.id_paciente);
      if (filters.fecha_inicio) q.append('fecha_inicio', filters.fecha_inicio);
      if (filters.fecha_fin) q.append('fecha_fin', filters.fecha_fin);

      const res = await fetch(`/api/mediciones/historico?${q.toString()}`);
      const json = await res.json();
      if (json.data) {
        setData(json.data);
        setTotalPages(json.pagination.totalPages);
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchHistorico();
  }, [page, lang, session]);

  return (
    <div>
      <div className="grid-2" style={{ marginBottom: '1rem' }}>
        {!isPatient && (
          <div className="form-group">
            <label>{t.t3_filter_patient}</label>
            <select className="form-control" value={filters.id_paciente} onChange={e => setFilters({ ...filters, id_paciente: e.target.value })}>
              <option value="">--</option>
              {pacientes.map(p => <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>)}
            </select>
          </div>
        )}
        <div className="form-group" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', gridColumn: isPatient ? 'span 2' : 'span 1' }}>
          <div style={{ flex: 1 }}>
            <label>{t.t3_filter_start}</label>
            <input type="date" className="form-control" value={filters.fecha_inicio} onChange={e => setFilters({ ...filters, fecha_inicio: e.target.value })} />
          </div>
          <div style={{ flex: 1 }}>
            <label>{t.t3_filter_end}</label>
            <input type="date" className="form-control" value={filters.fecha_fin} onChange={e => setFilters({ ...filters, fecha_fin: e.target.value })} />
          </div>
          <button className="btn" onClick={() => { setPage(1); fetchHistorico(); }}>{t.t3_search}</button>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>{t.t3_date}</th>
              <th>{t.t3_patient_col}</th>
              <th>{t.t3_doctor_col}</th>
              <th>{t.t3_glucose_col}</th>
              <th>{t.t3_sys_dia_col}</th>
              <th>{t.t3_imc_col}</th>
              <th>{t.t3_symptoms_col}</th>
            </tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr key={row.id}>
                <td>{new Date(row.fecha_hora).toLocaleDateString()}</td>
                <td>{row.paciente_nombre} {row.paciente_apellido}</td>
                <td>{row.medico_apellido}</td>
                <td>
                  {row.glucosa_mg_dl !== null && row.glucosa_mg_dl !== undefined ? (
                    <div>
                      <div><strong>{row.glucosa_mg_dl}</strong> <small>mg/dL</small></div>
                      {row.pie_heridas !== null && (
                        <div style={{ fontSize: '0.75rem', marginTop: '2px', color: (row.pie_heridas || row.pie_ampollas || row.pie_rojeces || row.pie_coloracion) ? '#d9534f' : '#5cb85c' }}>
                          {(row.pie_heridas || row.pie_ampollas || row.pie_rojeces || row.pie_coloracion) ? (
                            <span>
                              {t.t3_foot_issues}
                              {[
                                row.pie_heridas && t.t3_wounds,
                                row.pie_ampollas && t.t3_blisters,
                                row.pie_rojeces && t.t3_redness,
                                row.pie_coloracion && t.t3_color
                              ].filter(Boolean).join(', ')}
                            </span>
                          ) : t.t3_foot_ok}
                        </div>
                      )}
                    </div>
                  ) : '--'}
                </td>
                <td>
                  {row.presion_sistolica !== null && row.presion_sistolica !== undefined ? (
                    <div>
                      <div><strong>{row.presion_sistolica}/{row.presion_diastolica}</strong> <small>mmHg</small></div>
                      {row.momento_dia && (
                        <div style={{ fontSize: '0.75rem', marginTop: '2px', color: '#666' }}>
                          {row.momento_dia === 'Mañana' ? t.t2_morning : row.momento_dia === 'Tarde' ? t.t2_afternoon : row.momento_dia === 'Noche' ? t.t2_night : row.momento_dia} {row.en_ayunas ? `(${t.t3_fasting})` : `(${t.t3_no_fasting})`}
                        </div>
                      )}
                    </div>
                  ) : '--'}
                </td>
                <td>{row.imc}</td>
                <td>
                  {row.sintomas && (typeof row.sintomas === 'string' ? JSON.parse(row.sintomas) : row.sintomas).map(s => (
                    <span key={s.id} className={`badge badge-${s.categoria.toLowerCase()}`} style={{ marginRight: '4px', marginBottom: '4px' }}>
                      {s.nombre}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', alignItems: 'center' }}>
        <button className="btn" disabled={page === 1} onClick={() => setPage(page - 1)}>{t.t3_prev}</button>
        <span style={{ color: 'var(--text-secondary)' }}>Page {page} of {totalPages || 1}</span>
        <button className="btn" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>{t.t3_next}</button>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// TAB 4: Log de Auditoría
// -----------------------------------------------------------------------------
function TabAuditoria({ t }) {
  const [logs, setLogs] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch(`/api/auditoria?_t=${Date.now()}`);
      const data = await res.json();
      setLogs(data);
    } catch (e) { console.error(e); }
  };

  return (
    <div>
      <button className="btn" onClick={fetchLogs} style={{ marginBottom: '1.5rem' }}>Refresh</button>
      {logs.map((log, i) => (
        <div key={i} className="accordion-item">
          <div className="accordion-header" onClick={() => setExpanded(expanded === i ? null : i)}>
            <div>
              <span className="badge badge-media" style={{ marginRight: '1rem' }}>{log.operacion}</span>
              <strong style={{ color: 'black' }}>{log.tabla_afectada}</strong>
            </div>
            <span style={{ color: 'var(--text-secondary)' }}>
              {new Date(log.timestamp).toLocaleString()}
            </span>
          </div>
          {expanded === i && (
            <div className="accordion-body">
              <pre>{JSON.stringify(log, null, 2)}</pre>
            </div>
          )}
        </div>
      ))}
      {logs.length === 0 && <div style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>No logs available</div>}
    </div>
  );
}
