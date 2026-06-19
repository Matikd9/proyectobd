import './globals.css';

export const metadata = {
  title: 'M.P.C',
  description: 'Plataforma para el registro y seguimiento clínico de pacientes.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
