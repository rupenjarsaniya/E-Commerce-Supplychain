import React from "react";
import { Footer } from "@/components/Footer";
import { HeaderTop } from "@/components/Header";
import { SupplyProvider } from "@/contexts/SupplyContext";
import "@/styles/globals.css";
import { MantineProvider } from "@mantine/core";

export default function App({ Component, pageProps }) {
  return (
    <MantineProvider
      theme={{ colorScheme: "dark" }}
      withGlobalStyles
      withNormalizeCSS
    >
      <SupplyProvider>
        <HeaderTop />
        <Component {...pageProps} />
        <Footer />
      </SupplyProvider>
    </MantineProvider>
  );
}
