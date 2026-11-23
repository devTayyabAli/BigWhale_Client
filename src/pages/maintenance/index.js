// ** BIGWHALE — Maintenance Page
// Self-contained: rendered by _app.js without the app providers, wallet,
// sockets or API calls, so it works even while the backend is down.
import Head from 'next/head'

const Maintenance = () => {
  return (
    <>
      <Head>
        <title>BIGWHALE — Under Maintenance</title>
        <meta name='robots' content='noindex' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>

      <main className='wrap'>
        <div className='grid' aria-hidden='true' />
        <div className='glow glow-a' aria-hidden='true' />
        <div className='glow glow-b' aria-hidden='true' />

        <section className='card'>
          <div className='brand'>BIGWHALE</div>

          <div className='gears' aria-hidden='true'>
            <svg className='gear gear-big' viewBox='0 0 100 100'>
              <path d='M50 30a20 20 0 1 0 0 40a20 20 0 1 0 0-40zm0 10a10 10 0 1 1 0 20a10 10 0 1 1 0-20z' />
              <path d='M45 4h10l2 12a35 35 0 0 1 9 4l10-7 7 7-7 10a35 35 0 0 1 4 9l12 2v10l-12 2a35 35 0 0 1-4 9l7 10-7 7-10-7a35 35 0 0 1-9 4l-2 12H45l-2-12a35 35 0 0 1-9-4l-10 7-7-7 7-10a35 35 0 0 1-4-9L8 55V45l12-2a35 35 0 0 1 4-9l-7-10 7-7 10 7a35 35 0 0 1 9-4z' fillRule='evenodd' />
            </svg>
            <svg className='gear gear-small' viewBox='0 0 100 100'>
              <path d='M45 4h10l2 12a35 35 0 0 1 9 4l10-7 7 7-7 10a35 35 0 0 1 4 9l12 2v10l-12 2a35 35 0 0 1-4 9l7 10-7 7-10-7a35 35 0 0 1-9 4l-2 12H45l-2-12a35 35 0 0 1-9-4l-10 7-7-7 7-10a35 35 0 0 1-4-9L8 55V45l12-2a35 35 0 0 1 4-9l-7-10 7-7 10 7a35 35 0 0 1 9-4z' />
            </svg>
          </div>

          <h1 className='title'>We&apos;ll be back soon</h1>
          <p className='lead'>
            BIGWHALE is undergoing scheduled maintenance to upgrade the platform. All funds and accounts are safe.
          </p>

          <div className='bar' aria-hidden='true'>
            <span />
          </div>

          <p className='status'>
            <span className='dot' aria-hidden='true' />
            Maintenance in progress
          </p>

          <p className='thanks'>Thank you for your patience.</p>
        </section>
      </main>

      <style jsx global>{`
        html,
        body,
        #__next {
          margin: 0;
          padding: 0;
          min-height: 100%;
          background: #050816;
        }
      `}</style>

      <style jsx>{`
        .wrap {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
          box-sizing: border-box;
          overflow: hidden;
          background: #050816;
          color: #e6edff;
          font-family: 'Space Grotesk', 'Inter', system-ui, -apple-system, sans-serif;
        }
        .grid {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(0, 229, 255, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 229, 255, 0.04) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        .glow {
          position: absolute;
          width: 520px;
          height: 520px;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.35;
          animation: drift 12s ease-in-out infinite;
        }
        .glow-a {
          background: #00e5ff;
          top: -180px;
          right: -140px;
        }
        .glow-b {
          background: #a855f7;
          bottom: -200px;
          left: -160px;
          animation-delay: -6s;
        }
        .card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 560px;
          padding: 48px 32px 40px;
          box-sizing: border-box;
          text-align: center;
          border-radius: 24px;
          border: 1px solid rgba(0, 229, 255, 0.18);
          background: rgba(10, 16, 40, 0.72);
          backdrop-filter: blur(14px);
          box-shadow: 0 0 60px rgba(0, 229, 255, 0.08), inset 0 0 40px rgba(168, 85, 247, 0.05);
        }
        .brand {
          font-family: 'Orbitron', sans-serif;
          font-weight: 900;
          font-size: 28px;
          letter-spacing: 6px;
          background: linear-gradient(135deg, #00e5ff 0%, #a855f7 50%, #ff2e9f 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: shift 5s ease infinite;
        }
        .gears {
          position: relative;
          width: 140px;
          height: 110px;
          margin: 28px auto 8px;
        }
        .gear {
          position: absolute;
          fill: #00e5ff;
          filter: drop-shadow(0 0 12px rgba(0, 229, 255, 0.55));
        }
        .gear-big {
          width: 84px;
          height: 84px;
          left: 8px;
          top: 8px;
          animation: spin 8s linear infinite;
        }
        .gear-small {
          width: 50px;
          height: 50px;
          right: 10px;
          bottom: 4px;
          fill: #a855f7;
          filter: drop-shadow(0 0 12px rgba(168, 85, 247, 0.6));
          animation: spin-rev 5s linear infinite;
        }
        .title {
          margin: 12px 0 12px;
          font-family: 'Orbitron', sans-serif;
          font-weight: 800;
          font-size: clamp(26px, 6vw, 38px);
          line-height: 1.2;
          color: #ffffff;
        }
        .lead {
          margin: 0 auto;
          max-width: 420px;
          font-size: 16px;
          line-height: 1.6;
          color: rgba(200, 215, 245, 0.85);
        }
        .bar {
          position: relative;
          height: 6px;
          margin: 32px auto 20px;
          max-width: 360px;
          border-radius: 999px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.08);
        }
        .bar span {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 40%;
          border-radius: 999px;
          background: linear-gradient(90deg, #00e5ff, #a855f7, #ff2e9f);
          animation: load 2.2s ease-in-out infinite;
        }
        .status {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin: 0;
          padding: 8px 16px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 600;
          color: #00e5ff;
          background: rgba(0, 229, 255, 0.08);
          border: 1px solid rgba(0, 229, 255, 0.25);
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #00e5ff;
          animation: pulse 1.6s ease-in-out infinite;
        }
        .thanks {
          margin: 24px 0 0;
          font-size: 14px;
          color: rgba(200, 215, 245, 0.6);
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes spin-rev {
          to {
            transform: rotate(-360deg);
          }
        }
        @keyframes load {
          0% {
            left: -40%;
          }
          100% {
            left: 100%;
          }
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
            box-shadow: 0 0 0 0 rgba(0, 229, 255, 0.6);
          }
          50% {
            opacity: 0.6;
            box-shadow: 0 0 0 6px rgba(0, 229, 255, 0);
          }
        }
        @keyframes shift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        @keyframes drift {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(-40px, 30px);
          }
        }
        @media (max-width: 480px) {
          .card {
            padding: 36px 20px 32px;
          }
          .brand {
            font-size: 22px;
            letter-spacing: 4px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .gear,
          .bar span,
          .dot,
          .brand,
          .glow {
            animation: none;
          }
        }
      `}</style>
    </>
  )
}

// Tell browsers and search engines this is temporary (HTTP 503).
export const getServerSideProps = ({ res }) => {
  res.statusCode = 503
  res.setHeader('Retry-After', '3600')
  res.setHeader('Cache-Control', 'no-store')

  return { props: {} }
}

export default Maintenance
