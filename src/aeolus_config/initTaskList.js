import { flattenTasks } from "../utils/parseTasks.js";

const initTaskList = {
  tasks: [
    {
      name: "COMM Task 0",
      type: "COMM",
      maxTimes: 10.0,
      target: {
        name: "groundstation1",
        type: "FacilityTarget",
        value: 1000.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-33.47, -70.65, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "COMM Task 1",
      type: "COMM",
      maxTimes: 10.0,
      target: {
        name: "groundstation2",
        type: "FacilityTarget",
        value: 1000.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [18.59, -155.4, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "COMM Task 2",
      type: "COMM",
      maxTimes: 10.0,
      target: {
        name: "groundstation3",
        type: "FacilityTarget",
        value: 1000.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-2.9, 40.2, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "COMM Task 3",
      type: "COMM",
      maxTimes: 10.0,
      target: {
        name: "groundstation4",
        type: "FacilityTarget",
        value: 1000.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-29.15, 114.56, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 4",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget1",
        type: "LocationTarget",
        value: 3.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [39.2945, -71.1559, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 5",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget2",
        type: "LocationTarget",
        value: 5.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [41.1158, -67.8102, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 6",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget3",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [25.5397, -73.8852, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 7",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget4",
        type: "LocationTarget",
        value: 1.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [41.2675, -86.2858, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 8",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget5",
        type: "LocationTarget",
        value: 9.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [35.6472, -70.0174, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 9",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget6",
        type: "LocationTarget",
        value: 6.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [24.9508, -68.3201, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 10",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget7",
        type: "LocationTarget",
        value: 9.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [28.57, -73.4253, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 11",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget8",
        type: "LocationTarget",
        value: 7.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [33.9376, -71.8452, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 12",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget9",
        type: "LocationTarget",
        value: 6.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [42.1501, -72.1374, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 13",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget10",
        type: "LocationTarget",
        value: 8.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [42.2978, -79.1555, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 14",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget11",
        type: "LocationTarget",
        value: 9.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [26.1523, -73.8904, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 15",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget12",
        type: "LocationTarget",
        value: 10.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [42.4119, -83.5763, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 16",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget13",
        type: "LocationTarget",
        value: 1.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [42.1433, -72.8791, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 17",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget14",
        type: "LocationTarget",
        value: 9.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [32.7075, -86.3633, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 18",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget15",
        type: "LocationTarget",
        value: 7.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [39.0056, -81.4615, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 19",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget16",
        type: "LocationTarget",
        value: 10.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [25.8377, -86.0766, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 20",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget17",
        type: "LocationTarget",
        value: 6.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [31.4352, -85.0574, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 21",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget18",
        type: "LocationTarget",
        value: 5.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [41.3147, -70.5308, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 22",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget19",
        type: "LocationTarget",
        value: 8.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [21.8966, -73.62, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 23",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget20",
        type: "LocationTarget",
        value: 3.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [14.342, -66.0327, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 24",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget21",
        type: "LocationTarget",
        value: 5.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [27.0044, -56.8051, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 25",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget22",
        type: "LocationTarget",
        value: 9.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [8.68892, -69.1923, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 26",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget23",
        type: "LocationTarget",
        value: 6.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [16.7749, -64.2946, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 27",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget24",
        type: "LocationTarget",
        value: 9.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [15.6312, -71.5238, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 28",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget25",
        type: "LocationTarget",
        value: 8.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [23.3103, -60.9747, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 29",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget26",
        type: "LocationTarget",
        value: 6.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [23.904, -70.8981, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 30",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget27",
        type: "LocationTarget",
        value: 3.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [11.7375, -65.8809, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 31",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget28",
        type: "LocationTarget",
        value: 7.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [17.7953, -62.0185, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 32",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget29",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [16.9117, -58.1819, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 33",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget30",
        type: "LocationTarget",
        value: 7.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [20.9263, -56.8142, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 34",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget31",
        type: "LocationTarget",
        value: 7.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [22.1873, -65.0557, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 35",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget32",
        type: "LocationTarget",
        value: 8.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [23.0937, -73.2275, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 36",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget33",
        type: "LocationTarget",
        value: 9.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [13.5205, -73.0141, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 37",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget34",
        type: "LocationTarget",
        value: 10.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [21.5941, -70.8498, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 38",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget35",
        type: "LocationTarget",
        value: 8.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [21.102, -59.1857, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 39",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget36",
        type: "LocationTarget",
        value: 6.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [11.2522, -70.9144, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 40",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget37",
        type: "LocationTarget",
        value: 9.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [31.2857, -85.4829, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 41",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget38",
        type: "LocationTarget",
        value: 6.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [19.8705, -85.921, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 42",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget39",
        type: "LocationTarget",
        value: 1.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [33.5853, -76.384, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 43",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget40",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [21.9997, -71.4167, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 44",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget41",
        type: "LocationTarget",
        value: 9.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [18.9319, -68.3198, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 45",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget42",
        type: "LocationTarget",
        value: 5.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [20.0217, -84.4019, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 46",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget43",
        type: "LocationTarget",
        value: 9.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [27.3209, -75.6235, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 47",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget44",
        type: "LocationTarget",
        value: 3.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [24.4658, -77.6122, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 48",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget45",
        type: "LocationTarget",
        value: 6.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [22.0332, -86.762, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 49",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget46",
        type: "LocationTarget",
        value: 7.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [31.6166, -80.2575, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 50",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget47",
        type: "LocationTarget",
        value: 1.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [26.7053, -83.7564, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 51",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget48",
        type: "LocationTarget",
        value: 7.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [25.9945, -71.1143, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 52",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget49",
        type: "LocationTarget",
        value: 4.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [33.3439, -80.7757, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 53",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget50",
        type: "LocationTarget",
        value: 1.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [20.7168, -76.4293, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 54",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget51",
        type: "LocationTarget",
        value: 5.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [30.144, -83.687, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 55",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget52",
        type: "LocationTarget",
        value: 3.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [30.0746, -74.9604, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 56",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget53",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [22.6089, -81.7406, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 57",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget54",
        type: "LocationTarget",
        value: 3.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [26.3564, -73.9184, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 58",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget55",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [29.7843, -96.3113, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 59",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget56",
        type: "LocationTarget",
        value: 3.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [30.963, -90.0043, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 60",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget57",
        type: "LocationTarget",
        value: 1.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [25.0108, -92.8026, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 61",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget58",
        type: "LocationTarget",
        value: 7.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [17.6764, -81.9986, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 62",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget59",
        type: "LocationTarget",
        value: 4.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [20.5795, -89.3717, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 63",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget60",
        type: "LocationTarget",
        value: 6.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [34.2667, -79.787, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 64",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget61",
        type: "LocationTarget",
        value: 7.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [19.0476, -94.3631, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 65",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget62",
        type: "LocationTarget",
        value: 5.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [32.5163, -92.7239, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 66",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget63",
        type: "LocationTarget",
        value: 6.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [26.7668, -95.0892, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 67",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget64",
        type: "LocationTarget",
        value: 5.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [35.9227, -95.2786, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 68",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget65",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [17.5635, -80.6142, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 69",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget66",
        type: "LocationTarget",
        value: 5.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [24.8536, -86.4059, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 70",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget67",
        type: "LocationTarget",
        value: 9.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [18.1331, -87.0028, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 71",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget68",
        type: "LocationTarget",
        value: 9.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [35.238, -95.1009, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 72",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget69",
        type: "LocationTarget",
        value: 3.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [16.0927, -80.9394, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 73",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget70",
        type: "LocationTarget",
        value: 3.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [31.4982, -85.5589, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 74",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget71",
        type: "LocationTarget",
        value: 6.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [32.3461, -90.981, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 75",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget72",
        type: "LocationTarget",
        value: 7.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [33.3739, -87.735, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 76",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget73",
        type: "LocationTarget",
        value: 5.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [16.0362, 71.8338, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 77",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget74",
        type: "LocationTarget",
        value: 3.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [9.51933, 75.0782, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 78",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget75",
        type: "LocationTarget",
        value: 10.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [12.7983, 68.9291, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 79",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget76",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [10.4664, 69.6395, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 80",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget77",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [11.6782, 85.841, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 81",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget78",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [12.7991, 86.1227, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 82",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget79",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [16.3453, 78.5042, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 83",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget80",
        type: "LocationTarget",
        value: 7.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [8.99309, 68.1956, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 84",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget81",
        type: "LocationTarget",
        value: 6.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [26.0543, 71.6956, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 85",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget82",
        type: "LocationTarget",
        value: 1.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [26.8957, 74.0632, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 86",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget83",
        type: "LocationTarget",
        value: 9.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [17.8173, 83.4239, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 87",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget84",
        type: "LocationTarget",
        value: 8.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [17.7851, 67.3081, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 88",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget85",
        type: "LocationTarget",
        value: 8.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [14.7544, 67.8605, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 89",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget86",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [26.0011, 70.3798, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 90",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget87",
        type: "LocationTarget",
        value: 9.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [15.3849, 79.9823, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 91",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget88",
        type: "LocationTarget",
        value: 9.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [10.2241, 81.6344, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 92",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget89",
        type: "LocationTarget",
        value: 10.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [23.605, 79.9549, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 93",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget90",
        type: "LocationTarget",
        value: 9.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [15.7948, 76.0185, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 94",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget91",
        type: "LocationTarget",
        value: 8.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [14.9402, 127.353, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 95",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget92",
        type: "LocationTarget",
        value: 6.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [9.92642, 126.897, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 96",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget93",
        type: "LocationTarget",
        value: 3.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [18.8939, 123.886, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 97",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget94",
        type: "LocationTarget",
        value: 5.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [7.7791, 118.572, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 98",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget95",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [17.7355, 127.232, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 99",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget96",
        type: "LocationTarget",
        value: 1.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [7.67022, 121.657, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 100",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget97",
        type: "LocationTarget",
        value: 9.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [11.3697, 118.015, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 101",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget98",
        type: "LocationTarget",
        value: 4.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [16.5124, 129.78, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 102",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget99",
        type: "LocationTarget",
        value: 4.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [19.6045, 128.519, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 103",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget100",
        type: "LocationTarget",
        value: 4.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [5.62251, 122.003, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 104",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget101",
        type: "LocationTarget",
        value: 5.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [22.5877, 123.45, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 105",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget102",
        type: "LocationTarget",
        value: 7.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [19.5143, 122.741, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 106",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget103",
        type: "LocationTarget",
        value: 1.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [13.7358, 115.155, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 107",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget104",
        type: "LocationTarget",
        value: 9.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [12.7172, 117.025, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 108",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget105",
        type: "LocationTarget",
        value: 6.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [12.9357, 120.418, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 109",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget106",
        type: "LocationTarget",
        value: 9.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [10.127, 115.61, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 110",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget107",
        type: "LocationTarget",
        value: 4.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [14.1702, 127.886, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 111",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget108",
        type: "LocationTarget",
        value: 5.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [14.2154, 114.895, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 112",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget109",
        type: "LocationTarget",
        value: 1.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-5.48156, 107.435, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 113",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget110",
        type: "LocationTarget",
        value: 3.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-6.58584, 105.348, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 114",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget111",
        type: "LocationTarget",
        value: 7.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-5.44671, 108.934, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 115",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget112",
        type: "LocationTarget",
        value: 4.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-1.28603, 109.376, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 116",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget113",
        type: "LocationTarget",
        value: 9.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-3.77795, 111.483, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 117",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget114",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [8.46759, 113.157, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 118",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget115",
        type: "LocationTarget",
        value: 10.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-1.39585, 104.71, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 119",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget116",
        type: "LocationTarget",
        value: 6.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-6.30367, 108.25, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 120",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget117",
        type: "LocationTarget",
        value: 7.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [8.09762, 119.02, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 121",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget118",
        type: "LocationTarget",
        value: 10.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [9.59497, 103.584, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 122",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget119",
        type: "LocationTarget",
        value: 4.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-1.2226, 121.577, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 123",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget120",
        type: "LocationTarget",
        value: 5.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-7.77762, 117.607, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 124",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget121",
        type: "LocationTarget",
        value: 5.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-4.83871, 112.772, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 125",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget122",
        type: "LocationTarget",
        value: 8.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-1.8256, 114.571, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 126",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget123",
        type: "LocationTarget",
        value: 8.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [1.89792, 107.746, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 127",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget124",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-4.75577, 112.177, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 128",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget125",
        type: "LocationTarget",
        value: 3.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [2.05686, 122.262, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 129",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget126",
        type: "LocationTarget",
        value: 4.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [4.22432, 113.936, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 130",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget127",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [16.4227, 93.1352, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 131",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget128",
        type: "LocationTarget",
        value: 6.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [10.6319, 104.075, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 132",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget129",
        type: "LocationTarget",
        value: 4.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [15.778, 100.883, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 133",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget130",
        type: "LocationTarget",
        value: 3.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [18.4812, 106.581, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 134",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget131",
        type: "LocationTarget",
        value: 3.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [19.5827, 105.301, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 135",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget132",
        type: "LocationTarget",
        value: 9.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [13.9103, 109.074, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 136",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget133",
        type: "LocationTarget",
        value: 7.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [13.3487, 108.818, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 137",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget134",
        type: "LocationTarget",
        value: 5.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [25.7596, 97.6833, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 138",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget135",
        type: "LocationTarget",
        value: 9.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [6.75478, 104.975, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 139",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget136",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [23.7034, 94.9562, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 140",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget137",
        type: "LocationTarget",
        value: 8.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [24.2657, 91.6108, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 141",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget138",
        type: "LocationTarget",
        value: 8.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [21.9237, 105.881, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 142",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget139",
        type: "LocationTarget",
        value: 6.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [7.97425, 101.0, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 143",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget140",
        type: "LocationTarget",
        value: 3.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [11.2374, 100.598, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 144",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget141",
        type: "LocationTarget",
        value: 6.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [12.7071, 109.094, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 145",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget142",
        type: "LocationTarget",
        value: 4.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [19.5946, 103.197, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 146",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget143",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [8.73106, 103.353, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 147",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget144",
        type: "LocationTarget",
        value: 3.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [20.4246, 108.189, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 148",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget145",
        type: "LocationTarget",
        value: 9.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-10.8902, -175.637, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 149",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget146",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-15.4656, -175.649, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 150",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget147",
        type: "LocationTarget",
        value: 3.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-23.3416, -177.551, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 151",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget148",
        type: "LocationTarget",
        value: 1.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-22.2014, 170.997, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 152",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget149",
        type: "LocationTarget",
        value: 5.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-9.26976, -178.808, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 153",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget150",
        type: "LocationTarget",
        value: 1.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-26.4265, 178.372, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 154",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget151",
        type: "LocationTarget",
        value: 9.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-17.202, -172.541, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 155",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget152",
        type: "LocationTarget",
        value: 3.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-23.6415, -179.02, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 156",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget153",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-7.42639, -175.993, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 157",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget154",
        type: "LocationTarget",
        value: 4.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-12.7461, 177.076, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 158",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget155",
        type: "LocationTarget",
        value: 5.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-16.9906, 176.648, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 159",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget156",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-17.5782, -175.494, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 160",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget157",
        type: "LocationTarget",
        value: 10.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-25.8076, 169.669, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 161",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget158",
        type: "LocationTarget",
        value: 4.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-13.3606, 170.663, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 162",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget159",
        type: "LocationTarget",
        value: 4.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-26.1514, 171.468, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 163",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget160",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-25.5711, 175.819, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 164",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget161",
        type: "LocationTarget",
        value: 4.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-16.567, -175.372, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 165",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget162",
        type: "LocationTarget",
        value: 1.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-25.0654, -175.933, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 166",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget163",
        type: "LocationTarget",
        value: 6.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-13.7906, 132.054, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 167",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget164",
        type: "LocationTarget",
        value: 8.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-7.01485, 145.757, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 168",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget165",
        type: "LocationTarget",
        value: 7.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-4.46248, 136.382, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 169",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget166",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-6.66401, 139.457, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 170",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget167",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-1.8628, 141.957, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 171",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget168",
        type: "LocationTarget",
        value: 8.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-2.44053, 149.855, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 172",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget169",
        type: "LocationTarget",
        value: 9.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-9.16032, 139.355, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 173",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget170",
        type: "LocationTarget",
        value: 6.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-6.36698, 150.661, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 174",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget171",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-14.6903, 137.029, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 175",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget172",
        type: "LocationTarget",
        value: 8.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [4.68127, 145.022, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 176",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget173",
        type: "LocationTarget",
        value: 4.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-11.6566, 144.327, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 177",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget174",
        type: "LocationTarget",
        value: 4.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-12.8757, 141.783, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 178",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget175",
        type: "LocationTarget",
        value: 8.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-7.5518, 144.962, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 179",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget176",
        type: "LocationTarget",
        value: 1.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-11.0376, 144.331, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 180",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget177",
        type: "LocationTarget",
        value: 1.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-5.20625, 134.563, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 181",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget178",
        type: "LocationTarget",
        value: 7.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-8.21013, 133.56, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 182",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget179",
        type: "LocationTarget",
        value: 6.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [4.03261, 150.982, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 183",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget180",
        type: "LocationTarget",
        value: 6.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [3.40664, 134.422, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 184",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget181",
        type: "LocationTarget",
        value: 8.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [11.202, -158.698, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 185",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget182",
        type: "LocationTarget",
        value: 7.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [21.774, -154.73, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 186",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget183",
        type: "LocationTarget",
        value: 8.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [28.1873, -161.354, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 187",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget184",
        type: "LocationTarget",
        value: 4.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [23.9335, -160.581, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 188",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget185",
        type: "LocationTarget",
        value: 7.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [14.3587, -154.048, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 189",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget186",
        type: "LocationTarget",
        value: 6.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [17.9283, -161.084, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 190",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget187",
        type: "LocationTarget",
        value: 5.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [19.7645, -149.902, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 191",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget188",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [30.1828, -146.737, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 192",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget189",
        type: "LocationTarget",
        value: 8.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [13.6781, -151.785, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 193",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget190",
        type: "LocationTarget",
        value: 4.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [27.6605, -159.512, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 194",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget191",
        type: "LocationTarget",
        value: 6.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [23.4453, -154.709, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 195",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget192",
        type: "LocationTarget",
        value: 8.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [18.0754, -164.235, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 196",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget193",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [14.3685, -148.264, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 197",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget194",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [19.1151, -148.797, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 198",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget195",
        type: "LocationTarget",
        value: 6.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [20.1904, -150.035, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 199",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget196",
        type: "LocationTarget",
        value: 5.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [12.9622, -161.175, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 200",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget197",
        type: "LocationTarget",
        value: 9.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [22.3402, -154.503, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 201",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget198",
        type: "LocationTarget",
        value: 8.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [15.0738, -165.94, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 202",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget199",
        type: "LocationTarget",
        value: 8.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-8.96888, 58.3235, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 203",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget200",
        type: "LocationTarget",
        value: 1.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-22.4737, -30.1829, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 204",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget201",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-40.6218, 123.094, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 205",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget202",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-38.5481, 119.85, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 206",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget203",
        type: "LocationTarget",
        value: 8.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-9.25372, -87.6812, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 207",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget204",
        type: "LocationTarget",
        value: 9.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-48.6925, 40.8459, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 208",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget205",
        type: "LocationTarget",
        value: 7.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [11.8228, 29.6097, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 209",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget206",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-3.48909, 14.6662, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 210",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget207",
        type: "LocationTarget",
        value: 8.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [23.5139, 133.179, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 211",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget208",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [23.9865, -84.6796, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 212",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget209",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [16.6237, -65.4933, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 213",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget210",
        type: "LocationTarget",
        value: 7.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-55.9675, -137.083, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 214",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget211",
        type: "LocationTarget",
        value: 4.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-51.7433, 158.339, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 215",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget212",
        type: "LocationTarget",
        value: 7.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-21.648, 52.3987, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 216",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget213",
        type: "LocationTarget",
        value: 8.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [3.70371, -7.39324, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 217",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget214",
        type: "LocationTarget",
        value: 6.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [18.5335, 50.1541, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 218",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget215",
        type: "LocationTarget",
        value: 8.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-11.0857, 16.0978, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 219",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget216",
        type: "LocationTarget",
        value: 3.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [38.3977, 53.0321, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 220",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget217",
        type: "LocationTarget",
        value: 8.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [26.2031, 15.7989, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 221",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget218",
        type: "LocationTarget",
        value: 10.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [56.2379, 79.5768, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 222",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget219",
        type: "LocationTarget",
        value: 9.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [3.76007, 8.09831, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 223",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget220",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-20.9825, 177.734, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 224",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget221",
        type: "LocationTarget",
        value: 4.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-47.3245, -101.276, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 225",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget222",
        type: "LocationTarget",
        value: 4.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [13.315, -141.913, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 226",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget223",
        type: "LocationTarget",
        value: 7.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [33.4563, -140.509, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 227",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget224",
        type: "LocationTarget",
        value: 6.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-9.18565, -157.107, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 228",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget225",
        type: "LocationTarget",
        value: 8.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-49.1012, -34.3512, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 229",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget226",
        type: "LocationTarget",
        value: 4.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-28.0234, -18.5858, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 230",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget227",
        type: "LocationTarget",
        value: 3.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-41.5612, -48.3062, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 231",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget228",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-26.2794, 94.8617, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 232",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget229",
        type: "LocationTarget",
        value: 8.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-7.18978, 46.0427, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 233",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget230",
        type: "LocationTarget",
        value: 3.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [3.25713, 97.9129, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 234",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget231",
        type: "LocationTarget",
        value: 4.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-5.10908, 155.827, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 235",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget232",
        type: "LocationTarget",
        value: 6.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [45.0446, 170.187, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 236",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget233",
        type: "LocationTarget",
        value: 3.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [2.16625, -110.87, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 237",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget234",
        type: "LocationTarget",
        value: 7.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [53.2347, -130.005, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 238",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget235",
        type: "LocationTarget",
        value: 5.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [16.5251, 70.6559, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 239",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget236",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [54.9233, -146.225, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 240",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget237",
        type: "LocationTarget",
        value: 8.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-31.1152, 9.14559, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 241",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget238",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [21.1347, 10.9239, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 242",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget239",
        type: "LocationTarget",
        value: 4.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-25.3123, 130.01, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 243",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget240",
        type: "LocationTarget",
        value: 3.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [20.617, -5.4528, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 244",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget241",
        type: "LocationTarget",
        value: 6.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [23.4169, -38.3557, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 245",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget242",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-51.8409, 61.7152, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 246",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget243",
        type: "LocationTarget",
        value: 5.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-29.4252, 86.8529, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 247",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget244",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-33.1152, 7.21889, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 248",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget245",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [20.1399, -54.8234, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 249",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget246",
        type: "LocationTarget",
        value: 8.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [41.3271, -126.001, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 250",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget247",
        type: "LocationTarget",
        value: 4.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-18.6645, 30.9931, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 251",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget248",
        type: "LocationTarget",
        value: 6.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [33.6624, -85.6277, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 252",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget249",
        type: "LocationTarget",
        value: 10.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [21.0398, -163.997, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 253",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget250",
        type: "LocationTarget",
        value: 5.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-59.1942, 91.776, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 254",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget251",
        type: "LocationTarget",
        value: 7.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [12.2605, -92.5973, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 255",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget252",
        type: "LocationTarget",
        value: 8.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-13.5875, -20.7352, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 256",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget253",
        type: "LocationTarget",
        value: 5.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [49.9189, 67.6066, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 257",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget254",
        type: "LocationTarget",
        value: 7.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-59.8619, -50.6778, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 258",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget255",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-4.5061, 85.0824, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 259",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget256",
        type: "LocationTarget",
        value: 9.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-9.07812, -37.9053, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 260",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget257",
        type: "LocationTarget",
        value: 3.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-4.69004, 66.0297, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 261",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget258",
        type: "LocationTarget",
        value: 3.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [32.4192, 73.4571, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 262",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget259",
        type: "LocationTarget",
        value: 8.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-21.3034, -20.7701, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 263",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget260",
        type: "LocationTarget",
        value: 5.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [34.1687, -172.952, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 264",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget261",
        type: "LocationTarget",
        value: 8.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-3.43714, -60.8912, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 265",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget262",
        type: "LocationTarget",
        value: 5.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-55.7085, -27.2486, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 266",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget263",
        type: "LocationTarget",
        value: 3.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-38.8951, -82.7026, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 267",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget264",
        type: "LocationTarget",
        value: 1.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [26.611, -109.061, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 268",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget265",
        type: "LocationTarget",
        value: 7.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-3.18168, 115.82, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 269",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget266",
        type: "LocationTarget",
        value: 5.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-41.6735, -25.2283, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 270",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget267",
        type: "LocationTarget",
        value: 5.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-19.065, 139.598, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 271",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget268",
        type: "LocationTarget",
        value: 6.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [12.8867, -39.1741, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 272",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget269",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-36.9906, 96.8812, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 273",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget270",
        type: "LocationTarget",
        value: 4.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [28.6112, -37.1551, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 274",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget271",
        type: "LocationTarget",
        value: 8.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-30.858, 111.065, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 275",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget272",
        type: "LocationTarget",
        value: 7.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [50.0909, 91.8278, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 276",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget273",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-27.7126, -44.1376, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 277",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget274",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [31.86, -102.233, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 278",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget275",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-37.3606, 104.547, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 279",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget276",
        type: "LocationTarget",
        value: 1.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-25.5002, 161.749, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 280",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget277",
        type: "LocationTarget",
        value: 5.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-49.0664, -62.0764, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 281",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget278",
        type: "LocationTarget",
        value: 7.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [9.14513, 61.6552, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 282",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget279",
        type: "LocationTarget",
        value: 8.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [22.0036, -22.0878, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 283",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget280",
        type: "LocationTarget",
        value: 6.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [5.59117, 120.06, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 284",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget281",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-8.91254, 96.7875, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 285",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget282",
        type: "LocationTarget",
        value: 7.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [17.3331, -119.789, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 286",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget283",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [17.7141, 130.313, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 287",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget284",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [21.482, 176.354, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 288",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget285",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [16.2944, 5.19244, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 289",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget286",
        type: "LocationTarget",
        value: 2.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [53.4209, 138.341, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 290",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget287",
        type: "LocationTarget",
        value: 3.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-34.9278, 31.6894, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 291",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget288",
        type: "LocationTarget",
        value: 3.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [25.1138, -124.289, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 292",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget289",
        type: "LocationTarget",
        value: 4.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-31.6523, -108.049, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 293",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget290",
        type: "LocationTarget",
        value: 4.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-45.6724, -33.4963, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 294",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget291",
        type: "LocationTarget",
        value: 3.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [12.8765, 89.5341, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 295",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget292",
        type: "LocationTarget",
        value: 3.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-5.98348, 117.21, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 296",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget293",
        type: "LocationTarget",
        value: 9.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-4.95294, 104.387, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 297",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget294",
        type: "LocationTarget",
        value: 7.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [19.4334, -65.3313, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 298",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget295",
        type: "LocationTarget",
        value: 6.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [32.4343, 12.2631, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
    {
      name: "IMAGING Task 299",
      type: "IMAGING",
      maxTimes: 10.0,
      target: {
        name: "imagetarget296",
        type: "LocationTarget",
        value: 3.0,
        dynamicState: {
          type: "STATIC_LLA",
          integratorType: "None",
          stateData: [-17.9738, -147.618, 0.0],
          eoms: {
            type: "static",
          },
        },
      },
    },
  ],
};

const flattenedInitTasks = flattenTasks(initTaskList);
export default flattenedInitTasks;
