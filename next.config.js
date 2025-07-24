// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // SSR対応（将来の動的機能のため）
  // output: 'export', // コメントアウト
  
  // 画像最適化設定
  images: {
    domains: [
      'example.com', // サンプル画像用
      'kscgmfdalupvrsyjisoj.supabase.co', // Supabase Storage
      // 実際の画像ホスティングドメインを追加
    ],
  },
  
  transpilePackages: ['three'],
  // 実験的機能（必要に応じて）
  experimental: {
    // appDir: true, // Next.js 15では不要
    optimizePackageImports: ['@react-three/fiber', '@react-three/drei']
  },
  
  // 環境変数の確認
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // TypeScriptの厳密チェック
  typescript: {
    // ビルド時にTypeScriptエラーを無視しない
    ignoreBuildErrors: false,
  },
  
  // ESLintの厳密チェック
  eslint: {
    // ビルド時にESLintエラーを無視しない
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig