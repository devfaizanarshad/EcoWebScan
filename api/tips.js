export default function handler(req, res) {
  const tips = [
    { category: "Images", tips: ["Use WebP/AVIF", "Compress images", "Use srcset"] },
    { category: "Code", tips: ["Minify CSS/JS", "Remove unused code", "Lazy load resources"] },
    { category: "Hosting", tips: ["Green hosting", "Use CDN", "Enable compression"] },
    { category: "Design", tips: ["Reduce HTTP requests", "Optimize above-the-fold content"] }
  ];
  res.status(200).json({ success: true, data: tips });
}
