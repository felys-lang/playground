import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_DATE: (() => {
      const now = new Date();
      return `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}`;
    })(),
  },
};

export default nextConfig;
