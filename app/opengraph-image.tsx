import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'FlexIt - Every Post = Coin. Every Creator = Asset.'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  const logoUrl = new URL('/flexit-logo.png', 'https://www.flexitsol.fun').toString()

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #0d0d0d 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          padding: '60px',
        }}
      >
        {/* Gradient Orbs Background */}
        <div
          style={{
            position: 'absolute',
            width: '700px',
            height: '700px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,255,136,0.12) 0%, transparent 60%)',
            top: '-200px',
            left: '-150px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(170,0,255,0.12) 0%, transparent 60%)',
            bottom: '-200px',
            right: '-100px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,0,136,0.08) 0%, transparent 60%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Logo Section */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '60px',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoUrl}
            alt="FlexIt Logo"
            width={280}
            height={280}
            style={{
              filter: 'drop-shadow(0 0 60px rgba(0,255,136,0.3)) drop-shadow(0 0 30px rgba(170,0,255,0.2))',
            }}
          />
        </div>

        {/* Content Section */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            maxWidth: '650px',
          }}
        >
          {/* Brand Name */}
          <div
            style={{
              fontSize: '48px',
              fontWeight: 800,
              background: 'linear-gradient(90deg, #00ff88 0%, #00ddff 50%, #aa00ff 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: '20px',
              letterSpacing: '-0.02em',
            }}
          >
            FlexIt
          </div>

          {/* Main Headline */}
          <div
            style={{
              fontSize: '52px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '8px',
              lineHeight: 1.1,
            }}
          >
            Every Post = Coin.
          </div>
          <div
            style={{
              fontSize: '52px',
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #00ff88 0%, #00ddff 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: '28px',
              lineHeight: 1.1,
            }}
          >
            Every Creator = Asset.
          </div>

          {/* Subheadline */}
          <div
            style={{
              fontSize: '26px',
              color: 'rgba(255,255,255,0.7)',
              marginBottom: '32px',
              fontWeight: 500,
              lineHeight: 1.4,
            }}
          >
            The anti-rug SocialFi revolution on Solana
          </div>

          {/* Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 28px',
              background: 'rgba(0,255,136,0.1)',
              border: '2px solid rgba(0,255,136,0.4)',
              borderRadius: '50px',
              fontSize: '20px',
              color: '#00ff88',
              fontWeight: 'bold',
            }}
          >
            Limited Beta Access
          </div>
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            right: '60px',
            fontSize: '20px',
            color: 'rgba(255,255,255,0.4)',
            fontWeight: 600,
          }}
        >
          flexitsol.fun
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
