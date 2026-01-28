export const ballSpherometerROC = ({ feetRadius, sagitta, ballDiameter, curve }) => {
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
    const sqrtTerm = Math.sqrt(concaveROC * concaveROC - halfDiameter * halfDiameter);

    if (isNaN(sqrtTerm)) return NaN;

    const term1 = concaveROC - sqrtTerm;
    const term2 = (relativeShape * fringeCount * wavelengthNm) / 2_000_000;
    const numerator = term1 - term2;

    return numerator / 2 + (contactDiameter * contactDiameter) / (8 * numerator);
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
    const divisor = sourceConfig === "moving" ? 2 * radiusOfCurvature : radiusOfCurvature;
    return (-conicConstant * zoneRadius * zoneRadius) / divisor;
  },

  equalAreaZoneRadius: ({ startRadius, endRadius, zoneIndex, totalZones }) => {
    const startSq = startRadius * startRadius;
    const endSq = endRadius * endRadius;
    return Math.sqrt(startSq + (zoneIndex * (endSq - startSq)) / (totalZones - 1));
  },

  linearZoneRadius: ({ startRadius, endRadius, zoneIndex, totalZones }) => {
    return startRadius + (zoneIndex * (endRadius - startRadius)) / (totalZones - 1);
  },

  generateZones: ({
    mirrorRadius,
    radiusOfCurvature,
    conicConstant,
    sourceConfig,
    startRadius,
    endRadius,
    numZones,
    dividingMode,
  }) => {
    const n = Math.max(2, Math.min(50, Math.floor(numZones)));
    const baseLa = foucault.longitudinalAberration({
      zoneRadius: startRadius,
      radiusOfCurvature,
      conicConstant,
      sourceConfig,
    });

    const result = [];
    for (let i = 0; i < n; i++) {
      let radiusMm;
      if (dividingMode === "equal_area") {
        radiusMm = foucault.equalAreaZoneRadius({
          startRadius,
          endRadius,
          zoneIndex: i,
          totalZones: n,
        });
      } else {
        radiusMm = foucault.linearZoneRadius({
          startRadius,
          endRadius,
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

      result.push({
        index: i,
        normalized,
        radiusMm,
        la,
        relativeLa: la - baseLa,
      });
    }
    return result;
  },
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
