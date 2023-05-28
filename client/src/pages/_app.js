import { Footer } from "@/components/Footer";
import { HeaderTop } from "@/components/Header";
import "@/styles/globals.css";
import { MantineProvider } from "@mantine/core";

export default function App({ Component, pageProps }) {
  return (
    <MantineProvider
      theme={{ colorScheme: "dark" }}
      withGlobalStyles
      withNormalizeCSS
    >
      <HeaderTop />
      <Component {...pageProps} />
      <Footer />
    </MantineProvider>
  );
}
