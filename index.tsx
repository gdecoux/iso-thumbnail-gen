import { Glob } from "bun";
import { renderToStaticMarkup } from "react-dom/server";
import * as topojson from "topojson-client";
import { ISO } from "./src/iso";
import sharp from "sharp";

const glob = new Glob("*.json");

for await (const filename of glob.scan("src/isos")) {
  const file = Bun.file("src/isos/" + filename);
  const data = await file.json();

  const { features } = topojson.feature(data, data.objects.iso) as any;

  const html = renderToStaticMarkup(
    <ISO iso={features[0]} width={500} height={500} />
  );

  saveSvg(html, "images/" + filename.replace(".json", ".png"), {
    width: 500,
    height: 500,
  });
}

function saveSvg(svg: string, filename: string, { width = 800, height = 600 }) {
  sharp(Buffer.from(svg))
    .resize({ width, height }) // Set your desired dimensions
    .png({ quality: 100, compressionLevel: 9, adaptiveFiltering: true }) // Improve PNG output quality
    .toFile(filename);
}

// import { renderToStaticMarkup } from "react-dom/server";
// import GeoAlbersUsa from "./src/us";
// import sharp from "sharp";
// import { ISO } from "./src/iso";

// const html = renderToStaticMarkup(<ISO iso="ercot" width={500} height={500} />);

// sharp(Buffer.from(html))
//   //   .resize({ width: 800, height: 600 }) // Set your desired dimensions
//   .resize({ height: 500 })
//   .png({ quality: 100, compressionLevel: 9, adaptiveFiltering: true }) // Improve PNG output quality
//   .toFile("us.png");
