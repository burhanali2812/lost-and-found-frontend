import { useEffect, useState } from 'react';

function Pwa_App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault(); // Prevent the automatic prompt
      setDeferredPrompt(e); // Save the event for later
      setShowInstallButton(true); // Show the button
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // Show the install prompt
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted install');
      } else {
        console.log('User dismissed install');
      }
      setDeferredPrompt(null);
      setShowInstallButton(false);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="text-center my-5">
      <h1
        className="fw-bold mb-4"
        style={{ fontSize: '2.5rem', color: '#0d6efd' }}
      >
        <i className="fas fa-rocket me-2"></i>Welcome to{' '}
        <span style={{ color: '#198754' }}>MyApp</span>
      </h1>

      <p className="lead mb-4">
        Experience the app like never before! Install it to enjoy full-screen
        mode and faster access.
      </p>

      {showInstallButton ? (
        <button
          className="btn btn-success btn-lg shadow px-4 py-2"
          onClick={handleInstallClick}
          style={{ fontSize: '1.2rem', borderRadius: '12px' }}
        >
          <i className="fas fa-download me-2"></i>Install This App
        </button>
      ) : (
        <div>
          <div
            className="alert alert-info mt-4"
            style={{ maxWidth: '400px', margin: '0 auto' }}
          >
            <i className="fas fa-info-circle me-2"></i>
            App is already installed or installation is not available on this
            device/browser.
            <br />
            <strong>If you're new, click the refresh button below.</strong>
          </div>
          <button
            className="btn btn-outline-primary mt-3"
            onClick={handleRefresh}
          >
            <i className="fas fa-sync-alt me-2"></i>Refresh
          </button>
        </div>
      )}
    </div>
  );
}

export default Pwa_App;
