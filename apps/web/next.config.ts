import type { NextConfig } from "next";
import { withEve } from "eve/next";
import { fileURLToPath } from "node:url";

const nextConfig: NextConfig = {
  experimental: {
    // Attachments are sent inline as base64 (~4/3 of the file size). The chat caps files at
    // 20 MB, so lift Next's 10 MB proxy buffer, which would otherwise silently truncate them.
    proxyClientMaxBodySize: "30mb",
  },
};
const eveRoot = fileURLToPath(new URL("../..", import.meta.url));

export default withEve(nextConfig, { eveRoot });
