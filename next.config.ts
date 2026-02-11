import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // standalone removed - not needed for Cloudflare
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
