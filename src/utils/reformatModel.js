import { copyParameters } from "./parseModel";
import typecastNumbers from "./typecastNumbers";

export default function reformatModel(
  componentList,
  dependencyList,
  constraints,
  parsedEvaluator,
) {
  const assets = [];
  // Reconstruct assets and their constraints
  componentList.forEach((component) => {
    if (component.parent === undefined) {
      // Asset
      const asset = {
        id: component.id,
        name: component.name,
        dynamicState: {
          type: component.dynamicStateType,
          stateData: typecastNumbers([...component.stateData]),
          Eoms: {
            type: component.eomsType,
          },
          integratorOptions: typecastNumbers({
            ...component.integratorOptions,
          }),
          integratorParameters: typecastNumbers(
            copyParameters(component.integratorParameters),
          ),
        },
        subsystems: [],
        constraints: [],
      };

      assets.push(asset);
    }
  });

  // Reconstruct subsystems
  componentList.forEach((component) => {
    if (component.parent) {
      // Subsystem
      const subsystem = {
        id: component.id,
        name: component.name,
        type: component.type,
        src: component.src,
        className: component.className,
      };
      if (component.parameters.length > 0) {
        subsystem.parameters = typecastNumbers(component.parameters);
      }
      if (component.states.length > 0) {
        subsystem.states = typecastNumbers(component.states);
      }
      const parent = assets.find((asset) => asset.id === component.parent);
      parent.subsystems.push(subsystem);

      constraints.forEach((constraint) => {
        if (constraint.subsystem === component.id) {
          parent.constraints.push({
            id: constraint.id,
            name: constraint.name,
            subsystemName: component.name,
            type: constraint.type,
            value: typecastNumbers(constraint.value),
            state: { type: constraint.stateType, key: constraint.stateKey },
          });
        }
      });
    }
  });

  // Reconstruct dependencies
  const dependencies = dependencyList.map((dependency) => {
    const { fcnName, asset, subsystem, depSubsystem, depAsset } = dependency;
    let subsystemName, assetName, depSubsystemName, depAssetName;
    componentList.forEach((component) => {
      if (component.id === subsystem) {
        subsystemName = component.name;
      }
      if (component.id === asset) {
        assetName = component.name;
      }
      if (component.id === depSubsystem) {
        depSubsystemName = component.name;
      }
      if (component.id === depAsset) {
        depAssetName = component.name;
      }
    });
    return {
      fcnName,
      assetName,
      subsystemName,
      depAssetName,
      depSubsystemName,
    };
  });

  // Reconstruct evaluator
  const evaluator = {
    ...parsedEvaluator,
    keyRequests: parsedEvaluator.keyRequests.map(
      ({ asset, subsystem, type }) => {
        const assetName = componentList.find((c) => c.id === asset).name;
        const subsystemName = componentList.find(
          (c) => c.id === subsystem,
        ).name;
        return {
          asset: assetName,
          subsystem: subsystemName,
          type,
        };
      },
    ),
  };

  return {
    model: { assets, dependencies, evaluator },
  };
}
