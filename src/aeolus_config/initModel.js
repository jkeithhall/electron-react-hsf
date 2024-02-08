const initModel = {
  name: 'Double-Sat Aeolus Constellation (DSAC)', // Do we want to include this?
  lua: {
    enableScripting: true,
    files: [
      'io\\scripts\\pair_test_scripts.txt',
      'io\\scripts\\svk_test_scripts.txt',
      'io\\scripts\\simparams_test_scripts.txt',
      'io\\scripts\\matrixindex_test_scripts.txt',
      'io\\scripts\\matrix_test_scripts.txt',
      'io\\scripts\\quat_test_scripts.txt',
      'io\\scripts\\state_test_scripts.txt',
      'io\\scripts\\test\\ScriptedSubsytemTests\\SubsystemParameterTest.txt',
      'io\\scripts\\test\\ScriptedSubsytemTests\\ScriptedSubsystemTest.txt',
    ],
  },
  assets: [
    {
      assetName: 'SC1', // Include?
      position: {
        positionType: 'predeterminedECI',
				ICs: [
					{
						type: 'Matrix',
						key: 'ECI_Pointing_Vector(XYZ)',
						value: [7378.137, 0.0, 0.0, 0.0, 6.02088, 4.215866],
					}
				],
        eoms: {
          eomsType: 'orbital',
        },
      },
      subsystems: [
        {
          subsystemID: 1,
          type: 'accesss',
					subsystemName: 'Access', // Include?
        },
        {
          subsystemID: 2,
          type: 'ACDS',
          subsystemName: 'ADCS', // Include?
					ICs: [
						{
							type: 'Matrix',
							key: 'ECI_Pointing_Vector(XYZ)',
							value: [0.0, 0.0, 0.0],
						}
					],
          dependencies: [
						{ subsystemID: 1 },
					],
        },
				{
					subsystemID: 3,
          type: 'EOSensor',
          subsystemName: 'EO Sensor',
          lowQualityNumPixels: 5000,
					midQualityNumPixels: 10000,
					highQualityNumPixels: 15000,
					lowQualityCaptureTime: 3,
					midQualityCaptureTime: 5,
					highQualityCaptureTime: 7,
					ICs: [
						{ type: 'Double', key: 'numPixels', value: 0.0 },
						{ type: 'Double', key: 'IncidenceAngle', value: 0.0 },
						{ type: 'Bool', key: 'EOSensorOn', value: 0.0 },
					],
					dependencies: [
						{ subsystemID: 2, },
					],
        },
				{
          subsystemID: 4,
          type: 'SSDR',
          subsystemName: 'SSDR',
          bufferSize: 5000,
					ICs: [
						{ type: 'Double', key: 'DataBufferFillRatio', value: 0.0 },
					],
					dependencies: [
						{
							subsystemID: 3,
							dependencyFcn:
								{
									scripted: false,
									type: 'double',
									key: 'SSDRSUB_getNewDataProfile',
								},
						},
					],
        },
        {
          subsystemID: 5,
          type: 'comunications',
          subsystemName: 'Comunications',
					ICs: [
						{ type: 'Double', key: 'DataRate(MB/s)', value: 0.0 },
					],
          dependencies: [
						{
							subsystemID: 4,
							dependencyFcn:
								{
									scripted: false,
									type: 'double',
									key: 'COMMSUB_getDataRateProfile',
								},
						},
					],
        },
        {
					subsystemID: 6,
          type: 'power',
          subsystemName: 'Power',
          batterySize: 1000000,
					fullSolarPower: 150,
					penumbraSolarPower: 75,
					ICs: [
						{ type: 'Double', key: 'DepthofDischarge', value: 0.0 },
						{ type: 'Double', key: 'SolarPanelPowerIn', value: 0.0 },
					],
					dependencies: [
						{
							subsystemID: 5,
							dependencyFcn:
								{
									scripted: false,
									type: 'double',
									key: 'POWERSUB_getPowerProfile',
								},
						},
					],
        },
			],
			constraints: [
				{
					subsystemID: 6,
					type: 'FAIL_IF_HIGHER',
					value: 0.25,
					stateVar: { type: 'Double', key: 'DepthofDischarge' },
				},
				{
					subsystemID: 4,
					type: 'FAIL_IF_HIGHER',
					value: 0.7,
					stateVar: { type: 'Double', key: 'DataBufferFillRatio' },
				},
			],
    },
    {
      assetName: 'SC2', // Include?
      position: {
				positionType: 'predeterminedECI',
				ICs: [
					{
						type: 'Matrix',
						key: 'ECI_Pointing_Vector(XYZ)',
						value: [-7378.137, 0.0, 0.0, 0.0, -6.02088, 4.215866],
					}
				],
				eoms: {
					eomsType: 'orbital',
				},
			},
      subsystems: [
				{
					subsystemID: 7,
					type: 'accesss',
					subsystemName: 'Access', // Include?
				},
				{
					subsystemID: 8,
					type: 'ACDS',
					subsystemName: 'ADCS', // Include?
					ICs: [
						{
							type: 'Matrix',
							key: 'ECI_Pointing_Vector(XYZ)',
							value: [0.0, 0.0, 0.0],
						}
					],
					dependencies: [
						{ subsystemID: 7 },
					],
				},
				{
					subsystemID: 9,
					type: 'EOSensor',
					subsystemName: 'EO Sensor', // Include?
					lowQualityNumPixels: 5000,
					midQualityNumPixels: 10000,
					highQualityNumPixels: 15000,
					lowQualityCaptureTime: 3,
					midQualityCaptureTime: 5,
					highQualityCaptureTime: 7,
					ICs: [
						{ type: 'Double', key: 'numPixels', value: 0.0 },
						{ type: 'Double', key: 'IncidenceAngle', value: 0.0 },
						{ type: 'Bool', key: 'EOSensorOn', value: 0.0 },
					],
					dependencies: [
						{ subsystemID: 8 },
					],
				},
				{
					subsystemID: 10,
					type: 'SSDR',
					subsystemName: 'SSDR', // Include?
					bufferSize: 5000,
					ICs: [
						{ type: 'Double', key: 'DataBufferFillRatio', value: 0.0 },
					],
					dependencies: [
						{ subsystemID: 9,
							dependencyFcn:
								{
									scripted: false,
									type: 'double',
									key: 'SSDRSUB_getNewDataProfile',
								}
							},
					],
				},
				{
					subsystemID: 11,
					type: 'comunications',
					subsystemName: 'Comunications', // Include?
					ICs: [
						{ type: 'Double', key: 'DataRate(MB/s)', value: 0.0 },
					],
					dependencies: [
						{
							subsystemID: 10,
							dependencyFcn:
								{
									scripted: false,
									type: 'double',
									key: 'COMMSUB_getDataRateProfile',
								}
						},
					],
				},
				{
					subsystemID: 12,
					type: 'power',
					subsystemName: 'Power', // Include?
					batterySize: 1000000,
					fullSolarPower: 150,
					penumbraSolarPower: 75,
					ICs: [
						{ type: 'Double', key: 'DepthofDischarge', value: 0.0 },
						{ type: 'Double', key: 'SolarPanelPowerIn', value: 0.0 },
					],
					dependencies: [
						{
							subsystemID: 11,
							dependencyFcn:
								{
									scripted: false,
									type: 'double',
									key: 'POWERSUB_getPowerProfile',
								},
						},
					],
				},
			],
			constraints: [
				{
					subsystemID: 12,
					type: 'FAIL_IF_HIGHER',
					value: 0.25,
					stateVar: { type: 'Double', key: 'DepthofDischarge' },
				},
				{
					subsystemID: 10,
					type: 'FAIL_IF_HIGHER',
					value: 0.7,
					stateVar: { type: 'Double', key: 'DataBufferFillRatio' },
				},
			],
    }
  ]
};

export default initModel;