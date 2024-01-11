import { AlbersUsa } from "@visx/geo";
import { Fragment } from "react";
import * as topojson from "topojson-client";
import stateAbbrs from "./us/us-abbr.json";
import topology from "./us/usa-topo.json";

export interface ISOProps {
  iso: string;
  width: number;
  height: number;
}

interface FeatureShape {
  type: "Feature";
  id: string;
  geometry: { coordinates: [number, number][][]; type: "Polygon" };
  properties: { name: string; OBJECTID?: string; ABBRV?: string };
}

const ignoredStates = ["VT", "NH", "MA", "RI", "CT", "NJ", "DE", "MD"];
const background = "#F3F3F3";

const { features: unitedStates } = topojson.feature(
  topology as any,
  topology.objects.states as any
) as any;

export function ISO({ iso, width, height }: ISOProps) {
  const data = [...unitedStates, iso];
  const centerX = width / 2;
  const centerY = height / 2 + 15;
  const scale = (width + height) / 1.55;

  return (
    <svg
      width={width}
      height={height}
      style={{ background, borderRadius: "14px" }}
    >
      <AlbersUsa<FeatureShape>
        data={data}
        scale={scale}
        translate={[centerX, centerY - 25]}
      >
        {({ features }) =>
          features.map(({ feature, path }, i) => {
            const abbr: string = (stateAbbrs as any)[feature.id];

            const stylesObj = {
              fill: "#FFF",
              fontFamily: "sans-serif",
              cursor: "default",
            };

            if (abbr === "HI") {
              stylesObj.fill = "#3C019C";
            }

            if (ignoredStates.includes(abbr)) {
              return (
                <path
                  key={`map-feature-${i}`}
                  d={path || ""}
                  fill={"#AAAFB5"}
                  opacity={0.8}
                  stroke={background}
                  strokeWidth={0.5}
                />
              );
            }

            return (
              <Fragment key={`map-feature-${i}`}>
                <path
                  key={`map-feature-${i}`}
                  d={path || ""}
                  fill={feature.properties.ABBRV ? "#25B487" : "#AAAFB5"}
                  stroke={feature.properties.ABBRV ? "#25B487" : background}
                  strokeWidth={0.5}
                />
              </Fragment>
            );
          })
        }
      </AlbersUsa>
    </svg>
  );
}
