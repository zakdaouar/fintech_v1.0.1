import type { AppProps } from 'next/app'
import '../styles/globals.css'
import { Component } from 'lucide-react';


export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}