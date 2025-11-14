import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'FlexIt - Every Post = Coin. Every Creator = Asset.'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
        }}
      >
        {/* Gradient Orbs Background */}
        <div
          style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,255,136,0.15) 0%, transparent 70%)',
            top: '-100px',
            left: '-100px',
            filter: 'blur(60px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(170,0,255,0.15) 0%, transparent 70%)',
            bottom: '-100px',
            right: '-100px',
            filter: 'blur(60px)',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '80px',
            zIndex: 10,
          }}
        >
          {/* Logo/F Symbol */}
          <div
            style={{
              display: 'flex',
              fontSize: '180px',
              fontWeight: 'black',
              background: 'linear-gradient(135deg, #00ff88 0%, #00ddff 50%, #aa00ff 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: '40px',
              letterSpacing: '-0.05em',
            }}
          >
            F
          </div>

          {/* Main Headline */}
          <div
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '24px',
              lineHeight: 1.2,
              maxWidth: '900px',
            }}
          >
            Every Post = Coin.
          </div>
          <div
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #00ff88 0%, #00ddff 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: '32px',
              lineHeight: 1.2,
            }}
          >
            Every Creator = Asset.
          </div>

          {/* Subheadline */}
          <div
            style={{
              fontSize: '32px',
              color: 'rgba(255,255,255,0.7)',
              marginBottom: '40px',
              fontWeight: 500,
            }}
          >
            Join the anti-rug SocialFi revolution on Solana
          </div>

          {/* Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px 32px',
              background: 'rgba(0,255,136,0.1)',
              border: '2px solid rgba(0,255,136,0.3)',
              borderRadius: '50px',
              fontSize: '24px',
              color: '#00ff88',
              fontWeight: 'bold',
            }}
          >
            🔥 Limited Beta Access
          </div>
        </div>

        {/* Bottom Tag */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            fontSize: '24px',
            color: 'rgba(255,255,255,0.5)',
            fontWeight: 600,
          }}
        >
          FlexIt • Built Different
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
