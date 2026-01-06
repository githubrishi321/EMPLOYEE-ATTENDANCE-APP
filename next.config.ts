import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Explicitly set the Turbopack root to avoid auto-detection warnings when
  // multiple lockfiles exist on the machine (e.g., parent folder lockfile).
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
