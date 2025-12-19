import esbuild from "esbuild";

esbuild
  .build({
    entryPoints: ["src/index.js"],
    outfile: "dist/tracker.js",
    bundle: true,
    minify: true,
    format: "iife",
    globalName: "CFTracker"
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

