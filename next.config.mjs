// /** @type {import('next').NextConfig} */
// const nextConfig = {

// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      // Allow optimization for local images in the public directory
      domains: [], // Leave empty if only using local images; add remote domains if needed (e.g., ["example.com"])
      formats: ["image/webp", "image/avif"], // Enable modern formats for optimization
      minimumCacheTTL: 60, // Cache optimized images for 60 seconds (adjust as needed)
      dangerouslyAllowSVG: false, // Set to true if using SVG images, but be cautious with security
      contentDispositionType: "inline", // Ensures images are displayed inline
      contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;", // Basic CSP for security
    },
  };
  
  export default nextConfig;