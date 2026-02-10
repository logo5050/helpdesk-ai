'use client';

export function NavBar() {
  return (
    <nav className="relative z-10">
      <div
        className="border-b"
        style={{
          background: 'rgba(18, 20, 28, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderColor: 'rgba(255, 255, 255, 0.05)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <div
                className="relative w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #00C8FF 0%, #0099CC 100%)',
                  boxShadow: '0 0 20px rgba(0, 200, 255, 0.3), 0 0 40px rgba(0, 200, 255, 0.1)',
                }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>

              {/* App name */}
              <div className="flex flex-col">
                <h1
                  className="text-xl font-semibold tracking-tight"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    background: 'linear-gradient(135deg, #F0F2F5 0%, #8B8FA3 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  ShieldDesk
                </h1>
                <span
                  className="text-[10px] uppercase tracking-[0.2em]"
                  style={{ color: '#555970' }}
                >
                  Security Assessment
                </span>
              </div>
            </div>

            {/* Status indicator */}
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background: '#00E676',
                  boxShadow: '0 0 8px rgba(0, 230, 118, 0.6)',
                }}
              />
              <span
                className="text-xs font-medium"
                style={{ color: '#8B8FA3' }}
              >
                System Online
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
