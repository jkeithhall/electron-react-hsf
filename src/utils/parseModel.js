import { randomId } from '@mui/x-data-grid-generator';

function copyParameters(parameters) {
  if (!parameters) return [];

  return parameters.map(({ type, value, ...rest }) => {
    if (type === 'vector' || type === 'Matrix') {
      return { value: [...value], type, ...rest };
    } else {
      return { value, type, ...rest };
    }
  });
}

class ComponentIds {
  constructor() {
    this.ids = {};
  }

  createId(name) {
    const id = randomId();
    this.ids[id] = name;
    return id;
  }
  getId(name) {
    for (const [id, n] of Object.entries(this.ids)) {
      if (n === name) return id;
    }
    return null;
  }
  getName(id) {
    return this.ids[id];
  }
}

function parseModel(model) {
  const { assets, dependencies, evaluator } = model;

  const systemComponents = [];
  const systemConstraints = [];
  const systemDependencies = [];
  const componentIds = new ComponentIds();

  assets.forEach(asset => {
    const { name, dynamicState, subsystems, constraints } = asset;
    const { stateData, Eoms, integratorOptions, integratorParameters } = dynamicState;
    const id = asset.id === undefined ? componentIds.createId(name) : asset.id;
    const parentID = id;

    systemComponents.push({
      id,
      name,
      className: 'asset',
      dynamicStateType: dynamicState.type,
      stateData: [...stateData],
      eomsType: Eoms.type,
      integratorOptions: { ...integratorOptions },
      integratorParameters: copyParameters(integratorParameters),
    });

    subsystems.forEach(subsystem => {
      const { name, type, src, className, parameters, states } = subsystem;
      const id = subsystem.id === undefined ? componentIds.createId(name) : subsystem.id;

      systemComponents.push({
        id,
        name,
        className,
        parent: parentID,
        type,
        src,
        parameters: copyParameters(parameters),
        states: copyParameters(states),
      });
    });

    constraints.forEach(constraint => {
      const { name, subsystemName, type, state, value } = constraint;
      const id = constraint.id === undefined ? randomId() : constraint.id;
      systemConstraints.push({
        id,
        name,
        subsystem: systemComponents.find(c => c.name === subsystemName && c.parent === parentID).id,
        type,
        value,
        stateType: state.type,
        stateKey: state.key,
      });
    });
  });

  dependencies.forEach(dependency => {
      const { subsystemName, assetName, depSubsystemName, depAssetName, fcnName } = dependency;
      const id = dependency.id === undefined ? randomId() : dependency.id;

      // Assumes that asset names are unique
      const assetId = componentIds.getId(assetName);
      const depAssetId = componentIds.getId(depAssetName);
      const subsystemId = systemComponents.find(c => c.name === subsystemName && c.parent === assetId).id;
      const depsubsystemId = systemComponents.find(c => c.name === depSubsystemName && c.parent === depAssetId).id;

      systemDependencies.push({
        id,
        subsystem: subsystemId,
        asset: assetId,
        depSubsystem: depsubsystemId,
        depAsset: depAssetId,
        fcnName,
      });
  });

  const keyRequests = evaluator.keyRequests.map(({ asset, subsystem, type }) => {
    // Assumes that asset names are unique
    const parentID = componentIds.getId(asset);
    return {
      asset: parentID,
      subsystem: systemComponents.find(c => c.name === subsystem && c.parent === parentID).id,
      type,
    };
  });
  const systemEvaluator = { ...evaluator, keyRequests };

  return { systemComponents, systemConstraints, systemDependencies, systemEvaluator, componentIds };
};

export { parseModel, copyParameters }