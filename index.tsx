import { Glob } from "bun";
import { renderToStaticMarkup } from "react-dom/server";
import sharp from "sharp";
import * as topojson from "topojson-client";
import { ISO } from "./src/iso";
import GeoAlbersUsa from "./src/us";

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
    .resize({ width, height })
    .png({ quality: 100, compressionLevel: 9, adaptiveFiltering: true })
    .toFile(filename);
}

const html = renderToStaticMarkup(<GeoAlbersUsa width={500} height={500} />);

saveSvg(html, "images/" + "us.png", {
  width: 500,
  height: 500,
});
