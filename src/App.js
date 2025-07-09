// App.js
import { useState, useEffect, useMemo } from 'react';
import { Menu, X } from 'lucide-react';
import './App.css';

function App() {
  const [currentStream, setCurrentStream] = useState('');
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sceneTitle, setSceneTitle] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isVideoMode, setIsVideoMode] = useState(false);
  const [isYoloEnabled, setIsYoloEnabled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const sceneStreams = useMemo(() => ({
    'Scene 1': isYoloEnabled
      ? 'http://192.168.0.47:5000/va-stream1'
      : 'http://192.168.0.47:8000/stream1',
    'Scene 2': 'http://192.168.1.102:8000/stream',
    'Scene 3': 'http://192.168.1.103:8000/stream',
    'Scene 4': 'http://192.168.1.104:8000/stream',
    'Scene 5': 'http://192.168.1.105:8000/stream',
  }), [isYoloEnabled]);

  const sceneVideos = useMemo(() => ({
    'Scene 1': '/videos/scene-1/11_fixed.mp4',
    'Scene 2': '/videos/scene-2/22_fixed.mp4',
    'Scene 3': '/videos/scene-3/33_fixed.mp4',
    'Scene 4': '/videos/scene-4/44_fixed.mp4',
    'Scene 5': 'http://192.168.0.47:5000/va-stream1',
  }), []);

  const handleSceneClick = (scene) => {
    setHasError(false);
    setLoading(true);
    setSceneTitle(scene);

    if (!isVideoMode) {
      setCurrentStream(sceneStreams[scene]);
    } else {
      setCurrentStream(sceneVideos[scene]);
    }
  };

  useEffect(() => {
    if (sceneTitle) {
      const newSrc = isVideoMode ? sceneVideos[sceneTitle] : sceneStreams[sceneTitle];
      setCurrentStream(newSrc);
      setLoading(true);
      setHasError(false);
    }
  }, [isVideoMode, isYoloEnabled, sceneTitle, sceneStreams, sceneVideos]);

  useEffect(() => {
    if (loading) {
      const timeout = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [loading]);

  const handleLogin = () => {
    if (username === 'admin' && password === 'admin') {
      setIsLoggedIn(true);
      setUsername('');
      setPassword('');
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  if (!isLoggedIn) {
    return (
      <div className="login-page">
        <h1 className="login-title">Livestock Monitoring System</h1>
        <div className="login-logos">
          <img src="/misc/1.png" alt="Logo 1" className="header-logo logo-msd" />
          <img src="/misc/2.png" alt="Logo 2" className="header-logo logo-seelab" />
        </div>
        <div className="login-form">
          <input
            className="login-input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="login-button" onClick={handleLogin}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button
            className="sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="sidebar-nav">
          <button className="sidebar-item">Camera Feeds</button>
          <button className="sidebar-item">Dashboard</button>
          <button className="sidebar-item">Reports</button>
          <button className="sidebar-item">Settings</button>
          <button
            className={`sidebar-item toggle-mode-button ${isVideoMode ? 'video' : 'stream'}`}
            onClick={() => setIsVideoMode(!isVideoMode)}
          >
            {isVideoMode ? 'Switch to Stream' : 'Switch to Video'}
          </button>
          <button
            className="sidebar-item"
            onClick={() => setIsYoloEnabled(!isYoloEnabled)}
          >
            {isYoloEnabled ? 'Disable Detection' : 'Enable Detection'}
          </button>
          <button
            className="sidebar-item"
            onClick={handleLogout}
          >
            Log out
          </button>
        </nav>
      </div>

      {/* Overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>
          <span className="header-title">Livestock Monitoring System</span>

          <div className="header-logos">
            <img src="/misc/1.png" alt="Logo 1" className="header-logo" />
            <img src="/misc/2.png" alt="Logo 2" className="header-logo logo-seelab" />
          </div>
        </div>

        <div className="body-container">
          <div className="left-panel">
            <div className="picture-box">
              {loading && <p className="loading-text">Loading...</p>}

              {!loading && currentStream && !hasError && (
                isVideoMode ? (
                  <video
                    src={currentStream}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="stream-image"
                  />
                ) : (
                  <img
                    src={currentStream}
                    alt={`Live stream: ${sceneTitle}`}
                    onLoad={() => setLoading(false)}
                    onError={() => {
                      setHasError(true);
                      setLoading(false);
                    }}
                    className="stream-image"
                  />
                )
              )}

              {!loading && hasError && (
                <img
                  src="/images/FEEDNAN.png"
                  alt="No feed available"
                  className="stream-image"
                />
              )}

              {!loading && !currentStream && (
                <p className="loading-text">Select a scene to view feed.</p>
              )}
            </div>

            <div className="floating-buttons">
              {Object.keys(sceneStreams).map((scene) => (
                <button
                  key={scene}
                  className={`floating-button ${sceneTitle === scene ? 'active' : ''}`}
                  onClick={() => handleSceneClick(scene)}
                >
                  {scene}
                </button>
              ))}
            </div>

            {!loading && sceneTitle && (
              <p className="report-info" style={{ marginTop: '20px' }}>Currently Viewing: {sceneTitle} ({isVideoMode ? 'Video' : 'Stream'})</p>
            )}
          </div>

          <div className="right-panel">
  <h2>Latest Report</h2>

  <div className="card-scroll-container">
  {Array.from({ length: 10 }, (_, i) => (
    <div key={i} className="report-card">
      <img
        src={`/images/${(i % 10) + 1}.png`}// Adjust image path & number
        alt={`Report ${i + 1}`}
        className="report-image"
      />
      <p className="report-text"><strong>ID:</strong> {`${1000 + i}`}</p>
      <p className="report-text"><strong>Status:</strong> {i % 2 === 0 ? 'Healthy' : 'Needs Attention'}</p>
    </div>
  ))}
</div>
</div>
        </div>
      </div>
    </div>
  );
}

export default App;
