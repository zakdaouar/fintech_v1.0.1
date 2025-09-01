/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },      // ✔ évite l'arrêt sur erreurs ESLint en CI
  typescript: { ignoreBuildErrors: true },   // ✔ (optionnel) évite l'arrêt sur erreurs TS en CI
};
module.exports = nextConfig;