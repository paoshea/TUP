export default function ErrorPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#fff',
      color: '#000',
      padding: '1rem'
    }}>
      <div style={{
        maxWidth: '28rem',
        width: '100%',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '1rem'
        }}>Page Not Found</h1>
        <p style={{
          color: '#666',
          marginBottom: '1.5rem'
        }}>
          The page you are looking for does not exist or has been moved.
        </p>
        <a 
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '0.375rem',
            padding: '0.5rem 1rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            backgroundColor: '#007bff',
            color: '#fff',
            textDecoration: 'none'
          }}
        >
          Return to Home
        </a>
      </div>
    </div>
  );
}