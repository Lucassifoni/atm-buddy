export const ballSpherometerROC = ({
  feetRadius,
  sagitta,
  ballDiameter,
  curve,
}) => {
  const r = feetRadius;
  const s = sagitta;
  const b = curve === "concave" ? ballDiameter : -ballDiameter;
  return (r * r + s * s) / (2 * s) + b / 2;
};

export const reverseBallSpherometerSagitta = ({
  feetRadius,
  targetROC,
  ballDiameter,
  curve,
}) => {
  const r = feetRadius;
  const R = targetROC;
  const b = curve === "convex" ? ballDiameter : -ballDiameter;
  const aR = R + b / 2;
  return aR - Math.sqrt(aR * aR - r * r);
};

export const sagitta = ({ mirrorRadius, radiusOfCurvature }) => {
  if (radiusOfCurvature === 0) return 0;
  return (mirrorRadius * mirrorRadius) / (2 * radiusOfCurvature);
};

export const sineTableAngle = ({ cupRadius, targetROC }) => {
  const sinx = cupRadius / targetROC;
  const rad = Math.asin(sinx);
  return rad * (180 / Math.PI);
};

export const focalRatio = ({ focalLength, diameter }) => {
  return focalLength / diameter;
};

export const mpccCorrection = ({ diameter, focalLength }) => {
  const ratio = focalRatio({ focalLength, diameter });
  return diameter / (1.1264 * ratio * ratio * ratio);
};

export const mpccUndercorrection = ({ focalLength, diameter }) => {
  const ratio = focalRatio({ focalLength, diameter });
  const c = 4 / ratio;
  return c * c * c * c * 0.81;
};

export const mpccTargetConic = ({ diameter, focalLength }) => {
  const correction = mpccCorrection({ diameter, focalLength });
  const undercorrection = mpccUndercorrection({ focalLength, diameter });
  return -1 - undercorrection / correction;
};

export const circleArea = (radius) => Math.PI * radius * radius;

export const pressure = {
  totalMassForPressure: ({ radius, targetPressure }) => {
    return circleArea(radius) * targetPressure;
  },

  weightToAdd: ({ radius, polisherWeight, targetPressure }) => {
    const totalMass = pressure.totalMassForPressure({ radius, targetPressure });
    return Math.max(0, totalMass - polisherWeight);
  },

  actualPressure: ({ radius, polisherWeight }) => {
    const area = circleArea(radius);
    return area > 0 ? polisherWeight / area : 0;
  },
};

export const comaFree = {
  linearRadius: ({ focalLength, diameter }) => {
    const ratio = focalRatio({ focalLength, diameter });
    return 0.022 * ratio * ratio * ratio;
  },

  apparentField: ({ focalLength, diameter }) => {
    const linear = comaFree.linearRadius({ focalLength, diameter });
    return 2 * Math.atan(linear / (2 * focalLength)) * (180 / Math.PI);
  },

  magnification: ({ focalLength, eyepieceFocalLength }) => {
    return focalLength / eyepieceFocalLength;
  },

  trueFieldOfView: ({ focalLength, eyepieceFocalLength, apparentFOV }) => {
    const mag = comaFree.magnification({ focalLength, eyepieceFocalLength });
    return apparentFOV / mag;
  },

  inEyepiece: ({ focalLength, diameter, eyepieceFocalLength, apparentFOV }) => {
    const comaFreeApparent = comaFree.apparentField({ focalLength, diameter });
    const trueFov = comaFree.trueFieldOfView({
      focalLength,
      eyepieceFocalLength,
      apparentFOV,
    });
    return (comaFreeApparent / trueFov) * apparentFOV;
  },
};

export const annularRing = {
  surfaceArea: ({ outerRadius, innerRadius }) => {
    return Math.PI * (outerRadius * outerRadius - innerRadius * innerRadius);
  },

  percentageOfTotal: ({ outerRadius, innerRadius, mirrorRadius }) => {
    const ringArea = annularRing.surfaceArea({ outerRadius, innerRadius });
    const totalArea = circleArea(mirrorRadius);
    return (ringArea / totalArea) * 100;
  },

  percentageOfUnobstructed: ({
    outerRadius,
    innerRadius,
    mirrorRadius,
    obstructionRadius,
  }) => {
    const ringArea = annularRing.surfaceArea({ outerRadius, innerRadius });
    const totalArea = circleArea(mirrorRadius);
    const obstructionArea = circleArea(obstructionRadius);
    const unobstructedArea = totalArea - obstructionArea;
    if (unobstructedArea <= 0) return 0;
    return (ringArea / unobstructedArea) * 100;
  },

  normalizedToMm: (normalized, mirrorRadius) => normalized * mirrorRadius,
};

export const sagittaFringes = {
  rocFromFringes: ({
    wavelengthNm,
    contactDiameter,
    concaveROC,
    fringeCount,
    relativeShape,
  }) => {
    if (contactDiameter === 0 || concaveROC === 0) return NaN;

    const halfDiameter = contactDiameter / 2;
    const sqrtTerm = Math.sqrt(
      concaveROC * concaveROC - halfDiameter * halfDiameter,
    );

    if (isNaN(sqrtTerm)) return NaN;

    const term1 = concaveROC - sqrtTerm;
    const term2 = (relativeShape * fringeCount * wavelengthNm) / 2_000_000;
    const numerator = term1 - term2;

    return (
      numerator / 2 + (contactDiameter * contactDiameter) / (8 * numerator)
    );
  },
};

export const foucault = {
  longitudinalAberration: ({
    zoneRadius,
    radiusOfCurvature,
    conicConstant,
    sourceConfig,
  }) => {
    if (radiusOfCurvature === 0) return 0;
    const divisor =
      sourceConfig === "moving" ? 2 * radiusOfCurvature : radiusOfCurvature;
    return (-conicConstant * zoneRadius * zoneRadius) / divisor;
  },

  equalAreaZoneRadius: ({ startRadius, endRadius, zoneIndex, totalZones }) => {
    const startSq = startRadius * startRadius;
    const endSq = endRadius * endRadius;
    return Math.sqrt(
      startSq + (zoneIndex * (endSq - startSq)) / (totalZones - 1),
    );
  },

  linearZoneRadius: ({ startRadius, endRadius, zoneIndex, totalZones }) => {
    return (
      startRadius + (zoneIndex * (endRadius - startRadius)) / (totalZones - 1)
    );
  },

  generateZones: ({
    mirrorRadius,
    radiusOfCurvature,
    conicConstant,
    sourceConfig,
    numZones,
    dividingMode,
  }) => {
    const n = Math.max(2, Math.min(51, Math.floor(numZones) + 1));

    const result = [];
    for (let i = 0; i < n; i++) {
      let radiusMm;
      if (dividingMode === "equal_area") {
        radiusMm = foucault.equalAreaZoneRadius({
          startRadius: 0,
          endRadius: mirrorRadius,
          zoneIndex: i,
          totalZones: n,
        });
      } else {
        radiusMm = foucault.linearZoneRadius({
          startRadius: 0,
          endRadius: mirrorRadius,
          zoneIndex: i,
          totalZones: n,
        });
      }

      const normalized = mirrorRadius > 0 ? radiusMm / mirrorRadius : 0;
      const la = foucault.longitudinalAberration({
        zoneRadius: radiusMm,
        radiusOfCurvature,
        conicConstant,
        sourceConfig,
      });

      const previousLa = i > 0 ? result[i - 1].la : la;
      const previousRadius = i > 0 ? result[i - 1].radiusMm : 0;
      const hm = (previousRadius + radiusMm) / 2;

      const hmSqOverR =
        radiusOfCurvature > 0 ? (hm * hm) / radiusOfCurvature : 0;
      const hmOverTwoR =
        radiusOfCurvature > 0 ? hm / (2 * radiusOfCurvature) : 0;

      result.push({
        index: i,
        normalized,
        radiusMm,
        la,
        relativeLa: la - previousLa,
        hm,
        hmSqOverR,
        hmOverTwoR,
      });
    }
    return result;
  },

  generateMaskSvg: ({ mirrorDiameter, zones }) => {
    const r = mirrorDiameter / 2;
    const margin = mirrorDiameter * 0.08;
    const size = mirrorDiameter + margin * 2;
    const cx = size / 2;
    const cy = size / 2;
    const stroke = 0.25;
    const thinStroke = 0.25;
    const dashLen = Math.max(1, mirrorDiameter * 0.01);
    const dotLen = Math.max(0.5, mirrorDiameter * 0.005);
    const fontSize = Math.max(2, mirrorDiameter * 0.025);
    const firstHm = zones.find((z) => z.hm > 0);
    const lineOffset = firstHm ? firstHm.hm : mirrorDiameter * 0.2;

    const lines = [
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}mm" height="${size}mm">`,
      `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#000" stroke-width="${stroke}"/>`,
    ];

    const cutOffset = Math.min(1, Math.max(0.25, mirrorDiameter * 0.003));
    const firstNonZero = zones.find((z) => z.radiusMm > 0);

    const centralPolygonPath = (radius, yOff, innerX) => {
      const dx = Math.sqrt(radius * radius - yOff * yOff);
      const rx = cx + radius,
        ry = cy;
      const tx = cx + dx,
        ty = cy - yOff;
      const t2x = cx - innerX,
        t2y = cy - yOff;
      const lx = cx - radius,
        ly = cy;
      const bx = cx - dx,
        by = cy + yOff;
      const b2x = cx + innerX,
        b2y = cy + yOff;
      return [
        `M ${rx},${ry}`,
        `A ${radius},${radius} 0 0,0 ${tx},${ty}`,
        `L ${t2x},${t2y}`,
        `L ${lx},${ly}`,
        `A ${radius},${radius} 0 0,0 ${bx},${by}`,
        `L ${b2x},${b2y}`,
        `L ${rx},${ry} Z`,
      ].join(" ");
    };

    if (firstNonZero) {
      const zr = firstNonZero.radiusMm;
      const hm = firstNonZero.hm;
      lines.push(
        `<path d="${centralPolygonPath(zr, lineOffset, hm)}" fill="none" stroke="#000" stroke-width="${stroke}"/>`,
        `<path d="${centralPolygonPath(zr - cutOffset, lineOffset, hm)}" fill="none" stroke="red" stroke-width="${thinStroke}"/>`,
        `<circle cx="${cx}" cy="${cy}" r="${zr}" fill="none" stroke="#000" stroke-width="${thinStroke}" stroke-dasharray="${dotLen} ${dotLen}"/>`,
        `<circle cx="${cx}" cy="${cy}" r="${zr + cutOffset}" fill="none" stroke="red" stroke-width="${thinStroke}"/>`,
      );
      if (firstNonZero.hm > 0) {
        lines.push(
          `<circle cx="${cx}" cy="${cy}" r="${firstNonZero.hm}" fill="none" stroke="#666" stroke-width="${thinStroke}" stroke-dasharray="${dashLen} ${dashLen}"/>`,
        );
      }
    }

    for (const zone of zones) {
      if (zone.radiusMm <= 0 || zone === firstNonZero) continue;

      const zr = zone.radiusMm;
      lines.push(
        `<circle cx="${cx}" cy="${cy}" r="${zr - cutOffset}" fill="none" stroke="red" stroke-width="${thinStroke}"/>`,
        `<circle cx="${cx}" cy="${cy}" r="${zr}" fill="none" stroke="#000" stroke-width="${thinStroke}" stroke-dasharray="${dotLen} ${dotLen}"/>`,
        `<circle cx="${cx}" cy="${cy}" r="${zr + cutOffset}" fill="none" stroke="red" stroke-width="${thinStroke}"/>`,
      );

      if (zone.hm > 0) {
        lines.push(
          `<circle cx="${cx}" cy="${cy}" r="${zone.hm}" fill="none" stroke="#666" stroke-width="${thinStroke}" stroke-dasharray="${dashLen} ${dashLen}"/>`,
        );
      }
    }

    const lineY = [cy, cy - lineOffset, cy + lineOffset];
    for (let li = 0; li < lineY.length; li++) {
      const y = lineY[li];
      const x1 = cx - r;
      const x2 = cx + r;
      lines.push(
        `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#000" stroke-width="${stroke}"/>`,
      );
      if (li === 1) {
        lines.push(
          `<line x1="${x1}" y1="${y + cutOffset}" x2="${x2}" y2="${y + cutOffset}" stroke="red" stroke-width="${thinStroke}"/>`,
        );
      } else if (li === 2) {
        lines.push(
          `<line x1="${x1}" y1="${y - cutOffset}" x2="${x2}" y2="${y - cutOffset}" stroke="red" stroke-width="${thinStroke}"/>`,
        );
      }
    }

    lines.push(
      `<line x1="${cx}" y1="${cy - r}" x2="${cx}" y2="${cy + r}" stroke="#666" stroke-width="${thinStroke}" stroke-dasharray="${dashLen} ${dashLen}"/>`,
    );

    for (const zone of zones) {
      if (zone.hm <= 0) continue;
      lines.push(
        `<text x="${cx + fontSize * 0.3}" y="${cy - zone.hm}" font-size="${fontSize}" font-family="sans-serif" text-anchor="start" fill="#333">Hm ${zone.hm.toFixed(1)}</text>`,
      );
    }

    lines.push("</svg>");
    return lines.join("\n");
  },
};

export const glassSlabSphericalAberration = ({
  thickness,
  refractiveIndex,
  fNumber,
}) => {
  const n = refractiveIndex;
  const term1 = thickness * (n * n - 1);
  const term2 = Math.pow(fNumber, 4) * 128 * n * n * n;
  return -1 * (term1 / term2);
};

export const bathAstigmatism = ({
  mirrorDiameter,
  beamSeparation,
  radiusOfCurvature,
  wavelengthNm,
}) => {
  const roc = radiusOfCurvature;
  if (roc === 0 || wavelengthNm === 0) return 0;
  const valMm =
    (mirrorDiameter * mirrorDiameter * beamSeparation * beamSeparation) /
    (32 * roc * roc * roc);
  return (valMm * 1e6) / wavelengthNm;
};

export const spraySilvering = {
  cleaningTimeMinutes: (diameter) => {
    return Math.pow(diameter / 15, 1.4);
  },

  silverNitrate: (baseQuantityMl) => 1.6 * (baseQuantityMl / 150),
  sodiumHydroxide: (baseQuantityMl) => 2.5 * (baseQuantityMl / 150),
  sugarWater: (baseQuantityMl) => 300 * (baseQuantityMl / 150),
  glucose: (baseQuantityMl) => 12 * (baseQuantityMl / 150),
  firstQuantity: (baseQuantityMl) => 100 * (baseQuantityMl / 150),
};
