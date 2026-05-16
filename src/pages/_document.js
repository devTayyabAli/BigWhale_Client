// ** React Import
import { Children } from "react";

// ** Next Import
import Document, { Html, Head, Main, NextScript } from "next/document";

// ** Emotion Imports
import createEmotionServer from "@emotion/server/create-instance";

// ** Utils Imports
import { createEmotionCache } from "src/@core/utils/create-emotion-cache";

class CustomDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* BIGWHALE — Fonts */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800&display=swap"
          />
          {/* BIGWHALE — Favicon */}
          <link rel="apple-touch-icon" sizes="180x180" href="/images/favicon.ico" />
          <link rel="shortcut icon" href="/images/favicon.ico" />
          {/* BIGWHALE — Theme color */}
          <meta name="theme-color" content="#050816" />
          <meta name="msapplication-TileColor" content="#050816" />
          <script src="https://cdn.blockpass.org/widget/scripts/release/3.0.2/blockpass-kyc-connect.prod.js"></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
CustomDocument.getInitialProps = async (ctx) => {
  const originalRenderPage = ctx.renderPage;
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);
  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) =>
        (
          <App
            {...props} // @ts-ignore
            emotionCache={cache}
          />
        ),
    });
  const initialProps = await Document.getInitialProps(ctx);
  const emotionStyles = extractCriticalToChunks(initialProps.html);

  const emotionStyleTags = emotionStyles.styles.map((style) => {
    return (
      <style
        key={style.key}
        dangerouslySetInnerHTML={{ __html: style.css }}
        data-emotion={`${style.key} ${style.ids.join(" ")}`}
      />
    );
  });

  return {
    ...initialProps,
    styles: [...Children.toArray(initialProps.styles), ...emotionStyleTags],
  };
};

export default CustomDocument;
