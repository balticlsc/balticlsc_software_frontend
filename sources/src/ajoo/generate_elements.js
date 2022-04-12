
var generate_elements = function() {

  return {
     "boxes" : [
      {
        "_id": "Node1",
        "id": "Node1",
        "elementTypeId": "Action",
        "type": "Box",
        "location": {
          "height": 50,
          "width": 260,
          "x": 95,
          "y": 100
        },
        "style": {
          "elementStyle": {
            "fill": "#EDBB99 ",
            "opacity": 1,
            "stroke": "#000000",
            "strokeWidth": 1,
            "shape": "RoundRectangle",
            "perfectDrawEnabled": false
          }
        },
        "compartments": [
          {
            "_id": 12323234,
            "input": "cmpr1",
            "value": "<<data input>> Input hull parameters",
            "style": {
              "align": "center",
              "fill": "#000000",
              "fontFamily": "Arial",
              "fontSize": 14,
              "fontStyle": "bold",
              "fontVariant": "normal",
              "strokeWidth": 1,
              "visible": true,
              "y": 0,
              "text": "<<data input>> Input hull parameters",
              "listening": false,
              "perfectDrawEnabled": false,
              "width": "auto",
              "height": "auto"
            }
          },
          {
            "_id": 756888,
            "input": "fhd2",
            "value": "Output1: Hull parameters",
            "style": {
              "align": "center",
              "fill": "#000000",
              "fontFamily": "Arial",
              "fontSize": 14,
              "fontStyle": "normal",
              "fontVariant": "normal",
              "strokeWidth": 1,
              "visible": true,
              "y": 0,
              "text": "Output1: Hull parameters",
              "listening": false,
              "perfectDrawEnabled": false,
              "width": "auto",
              "height": "auto"
            }
          },
          {
            "_id": 8867868,
            "input": "fhd2",
            "value": "Output2: Hull raw data",
            "style": {
              "align": "center",
              "fill": "#000000",
              "fontFamily": "Arial",
              "fontSize": 14,
              "fontStyle": "normal",
              "fontVariant": "normal",
              "strokeWidth": 1,
              "visible": true,
              "y": 0,
              "text": "Output2: Hull parameters",
              "listening": false,
              "perfectDrawEnabled": false,
              "width": "auto",
              "height": "auto"
            }
          },
        ]
      },
      {
        "_id": "Node2",
        "type": "Box",
        "elementTypeId": "Start",
        "location": {
          "height": 50,
          "width": 50,
          "x": 200,
          "y": 25
        },
        "style": {
          "elementStyle": {
            "fill": "brown",
            "fillPriority": "color",
            "opacity": 1,
            "stroke": "#000000",
            "strokeWidth": 1,
            "shape": "Circle",
            "perfectDrawEnabled": false
          }
        },
      },
      {
        "_id": "Node3",
        "type": "Box",
        "elementTypeId": "Action",
        "location": {
          "height": 50,
          "width": 240,
          "x": 105,
          "y": 175
        },
        "style": {
          "elementStyle": {
            "fill": "#A3E4D7 ",
            "opacity": 1,
            "stroke": "#000000",
            "strokeWidth": 1,
            "shape": "RoundRectangle",
            "perfectDrawEnabled": false
          }
        },
        "compartments": [
          {
            "_id": 56547567,
            "input": "cmpr2",
            "value": "<<call>> Section the hull",
            "style": {
              "align": "center",
              "fill": "#000000",
              "fontFamily": "Arial",
              "fontSize": 14,
              "fontStyle": "bold",
              "fontVariant": "normal",
              "strokeWidth": 1,
              "visible": true,
              "y": 0,
              "text": "<<call>> Section the hull",
              "listening": false,
              "perfectDrawEnabled": false,
              "width": "auto",
              "height": "auto"
            }
          },
          {
            "_id": 478568453,
            "input": "fhd2",
            "value": "Output1: Hull sections",
            "style": {
              "align": "center",
              "fill": "#000000",
              "fontFamily": "Arial",
              "fontSize": 14,
              "fontStyle": "normal",
              "fontVariant": "normal",
              "strokeWidth": 1,
              "visible": true,
              "y": 0,
              "text": "Output1: Hull sections",
              "listening": false,
              "perfectDrawEnabled": false,
              "width": "auto",
              "height": "auto"
            }
          },
          {
            "_id": 8867868,
            "input": "fhd2",
            "value": "Output2: Hull sections simplified",
            "style": {
              "align": "center",
              "fill": "#000000",
              "fontFamily": "Arial",
              "fontSize": 14,
              "fontStyle": "normal",
              "fontVariant": "normal",
              "strokeWidth": 1,
              "visible": true,
              "y": 0,
              "text": "Output2: Hull sections simplified",
              "listening": false,
              "perfectDrawEnabled": false,
              "width": "auto",
              "height": "auto"
            }
          },
        ]
      },
      {
        "_id": "Node4",
        "type": "Box",
        "elementTypeId": "Action",
        "location": {
          "height": 50,
          "width": 250,
          "x": 100,
          "y": 250
        },
        "style": {
          "elementStyle": {
            "fill": "#EDBB99 ",
            "opacity": 1,
            "stroke": "#000000",
            "strokeWidth": 1,
            "shape": "RoundRectangle",
            "perfectDrawEnabled": false
          }
        },
        "compartments": [
          {
            "_id": 2323235,
            "input": "cmpr1",
            "value": "<<data input>> Visualize data?",
            "style": {
              "align": "center",
              "fill": "#000000",
              "fontFamily": "Arial",
              "fontSize": 14,
              "fontStyle": "bold",
              "fontVariant": "normal",
              "strokeWidth": 1,
              "visible": true,
              "y": 0,
              "text": "<<data input>> Visualize data?",
              "listening": false,
              "perfectDrawEnabled": false,
              "width": "auto",
              "height": "auto"
            }
          },
          {
            "_id": 554754343,
            "input": "cmpr1",
            "value": "Test: decision",
            "style": {
              "align": "center",
              "fill": "#000000",
              "fontFamily": "Arial",
              "fontSize": 14,
              "fontStyle": "normal",
              "fontVariant": "normal",
              "strokeWidth": 1,
              "visible": true,
              "y": 0,
              "text": "Test: decision",
              "listening": false,
              "perfectDrawEnabled": false,
              "width": "auto",
              "height": "auto"
            }
          },
        ]
      },
      {
        "_id": "Node5",
        "type": "Box",
        "elementTypeId": "Action",
        "location": {
          "height": 50,
          "width": 180,
          "x": 135,
          "y": 325
        },
        "style": {
          "elementStyle": {
            "fill": "#A3E4D7 ",
            "opacity": 1,
            "stroke": "#000000",
            "strokeWidth": 1,
            "shape": "RoundRectangle",
            "perfectDrawEnabled": false
          }
        },
        "compartments": [
          {
            "_id": 45446546,
            "input": "cmpr2",
            "value": "<<call>> Optimize the hull",
            "style": {
              "align": "center",
              "fill": "#000000",
              "fontFamily": "Arial",
              "fontSize": 14,
              "fontStyle": "bold",
              "fontVariant": "normal",
              "strokeWidth": 1,
              "visible": true,
              "y": 0,
              "text": "<<call>> Optimize the hull",
              "listening": false,
              "perfectDrawEnabled": false,
              "width": "auto",
              "height": "auto"
            }
          },
          {
            "_id": 456546772,
            "input": "fhd2",
            "value": "Output: Hull final",
            "style": {
              "align": "center",
              "fill": "#000000",
              "fontFamily": "Arial",
              "fontSize": 14,
              "fontStyle": "normal",
              "fontVariant": "normal",
              "strokeWidth": 1,
              "visible": true,
              "y": 0,
              "text": "Output: Hull final",
              "listening": false,
              "perfectDrawEnabled": false,
              "width": "auto",
              "height": "auto"
            }
          },
        ]
      },
      {
        "_id": "Node6",
        "type": "Box",
        "elementTypeId": "End",
        "location": {
          "height": 50,
          "width": 50,
          "x": 200,
          "y": 400
        },
        "style": {
          "elementStyle": {
            "fill": "black",
            "fillPriority": "color",
            "opacity": 1,
            "stroke": "#000000",
            "strokeWidth": 1,
            "shape": "Circle",
            "perfectDrawEnabled": false
          }
        },
      },
      {
        "_id": "Node7",
        "type": "Box",
        "elementTypeId": "Action",
        "location": {
          "height": 50,
          "width": 250,
          "x": 480,
          "y": 250
        },
        "style": {
          "elementStyle": {
            "fill": "#A9DFBF",
            "opacity": 1,
            "stroke": "#000000",
            "strokeWidth": 1,
            "shape": "RoundRectangle",
            "perfectDrawEnabled": false
          }
        },
        "compartments": [
          {
            "_id": 674556456,
            "input": "cmpr2",
            "value": "<<visualization>> Show hull sections",
            "style": {
              "align": "center",
              "fill": "#000000",
              "fontFamily": "Arial",
              "fontSize": 14,
              "fontStyle": "bold",
              "fontVariant": "normal",
              "strokeWidth": 1,
              "visible": true,
              "y": 0,
              "text": "<<visualization>> Show hull sections",
              "listening": false,
              "perfectDrawEnabled": false,
              "width": "auto",
              "height": "auto"
            }
          },
          
        ]
      },
      {
        "_id": "Node8",
        "type": "Box",
        "elementTypeId": "Action",
        "location": {
          "height": 50,
          "width": 250,
          "x": 480,
          "y": 325
        },
        "style": {
          "elementStyle": {
            "fill": "#EDBB99 ",
            "opacity": 1,
            "stroke": "#000000",
            "strokeWidth": 1,
            "shape": "RoundRectangle",
            "perfectDrawEnabled": false
          }
        },
        "compartments": [
          {
            "_id": 3236452,
            "input": "cmpr1",
            "value": "<<data input>> Continue?",
            "style": {
              "align": "center",
              "fill": "#000000",
              "fontFamily": "Arial",
              "fontSize": 14,
              "fontStyle": "bold",
              "fontVariant": "normal",
              "strokeWidth": 1,
              "visible": true,
              "y": 0,
              "text": "<<data input>> Continue?",
              "listening": false,
              "perfectDrawEnabled": false,
              "width": "auto",
              "height": "auto"
            }
          },
          {
            "_id": 88884456,
            "input": "cmpr1",
            "value": "Test: decision",
            "style": {
              "align": "center",
              "fill": "#000000",
              "fontFamily": "Arial",
              "fontSize": 14,
              "fontStyle": "normal",
              "fontVariant": "normal",
              "strokeWidth": 1,
              "visible": true,
              "y": 0,
              "text": "Test: decision",
              "listening": false,
              "perfectDrawEnabled": false,
              "width": "auto",
              "height": "auto"
            }
          },
        ]
      },
     ],

     lines: [],

     // "lines" : [
     //  {
     //    "_id": "Edge1",
     //    "elementTypeId": "Action",
     //    "startElement": "Node2",
     //    "endElement": "Node1",
     //    "compartments": [],
     //    "points": [
     //      225,
     //      75,
     //      225,
     //      100
     //    ],
     //    "style": {
     //      "elementStyle": {
     //        "stroke": "black",
     //        "strokeWidth": 1,
     //        "perfectDrawEnabled": false
     //      },
     //      "startShapeStyle": {
     //        "shape": "None",
     //        "stroke": "#000000",
     //        "strokeWidth": 1,
     //        "radius": 10,
     //        "width": 10,
     //        "height": 10,
     //        "fill": "#f0f0f0",
     //        "perfectDrawEnabled": false,
     //        "listening": false
     //      },
     //      "endShapeStyle": {
     //        "shape": "Arrow",
     //        "stroke": "#000000",
     //        "strokeWidth": 1,
     //        "radius": 10,
     //        "width": 10,
     //        "height": 10,
     //        "fill": "#f0f0f0",
     //        "perfectDrawEnabled": false,
     //        "listening": false
     //      },
     //      "lineType": "Orthogonal"
     //    }
     //  },
     //  {
     //    "_id": "Edge2",
     //    "startElement": "Node1",
     //    "endElement": "Node3",
     //    "compartments": [],
     //    "points": [
     //      225,
     //      150,
     //      225,
     //      175
     //    ],
     //    "style": {
     //      "elementStyle": {
     //        "stroke": "black",
     //        "strokeWidth": 1,
     //        "perfectDrawEnabled": false
     //      },
     //      "startShapeStyle": {
     //        "shape": "None",
     //        "stroke": "#000000",
     //        "strokeWidth": 1,
     //        "radius": 10,
     //        "width": 10,
     //        "height": 10,
     //        "fill": "#f0f0f0",
     //        "perfectDrawEnabled": false,
     //        "listening": false
     //      },
     //      "endShapeStyle": {
     //        "shape": "Arrow",
     //        "stroke": "#000000",
     //        "strokeWidth": 1,
     //        "radius": 10,
     //        "width": 10,
     //        "height": 10,
     //        "fill": "#f0f0f0",
     //        "perfectDrawEnabled": false,
     //        "listening": false
     //      },
     //      "lineType": "Orthogonal"
     //    }
     //  },
     //  {
     //    "_id": "Edge3",
     //    "startElement": "Node3",
     //    "endElement": "Node4",
     //    "compartments": [],
     //    "points": [
     //      225,
     //      225,
     //      225,
     //      250
     //    ],
     //    "style": {
     //      "elementStyle": {
     //        "stroke": "black",
     //        "strokeWidth": 1,
     //        "perfectDrawEnabled": false
     //      },
     //      "startShapeStyle": {
     //        "shape": "None",
     //        "stroke": "#000000",
     //        "strokeWidth": 1,
     //        "radius": 10,
     //        "width": 10,
     //        "height": 10,
     //        "fill": "#f0f0f0",
     //        "perfectDrawEnabled": false,
     //        "listening": false
     //      },
     //      "endShapeStyle": {
     //        "shape": "Arrow",
     //        "stroke": "#000000",
     //        "strokeWidth": 1,
     //        "radius": 10,
     //        "width": 10,
     //        "height": 10,
     //        "fill": "#f0f0f0",
     //        "perfectDrawEnabled": false,
     //        "listening": false
     //      },
     //      "lineType": "Orthogonal"
     //    }
     //  },
     //  {
     //    "_id": "Edge4",
     //    "startElement": "Node4",
     //    "endElement": "Node5",
     //    "compartments": [
     //      {
     //        _id: 234234221,
     //        input: "[decision = NO]",
     //        value: "[decision = NO]",
     //        style: {
     //          align: "left",
     //          fill: "0",
     //          fontFamily: "Arial",
     //          fontSize: 12,
     //          fontStyle: "normal",
     //          fontVariant: "normal",
     //          padding: 0,
     //          placement: "start-right",
     //          strokeWidth: "1",
     //          visible: true,
     //        },
     //      },
     //      {
     //        _id: 123456,
     //        input: "Hull sections",
     //        value: "Hull sections",
     //        style: {
     //          align: "left",
     //          fill: "0",
     //          fontFamily: "Arial",
     //          fontSize: 12,
     //          fontStyle: "normal",
     //          fontVariant: "normal",
     //          padding: 0,
     //          placement: "start-left",
     //          strokeWidth: "1",
     //          visible: true,
     //        },
     //      },
     //    ],
     //    "points": [
     //      225,
     //      300,
     //      225,
     //      325
     //    ],
     //    "style": {
     //      "elementStyle": {
     //        "stroke": "black",
     //        "strokeWidth": 1,
     //        "perfectDrawEnabled": false
     //      },
     //      "startShapeStyle": {
     //        "shape": "None",
     //        "stroke": "#000000",
     //        "strokeWidth": 1,
     //        "radius": 10,
     //        "width": 10,
     //        "height": 10,
     //        "fill": "#f0f0f0",
     //        "perfectDrawEnabled": false,
     //        "listening": false
     //      },
     //      "endShapeStyle": {
     //        "shape": "Arrow",
     //        "stroke": "#000000",
     //        "strokeWidth": 1,
     //        "radius": 10,
     //        "width": 10,
     //        "height": 10,
     //        "fill": "#f0f0f0",
     //        "perfectDrawEnabled": false,
     //        "listening": false
     //      },
     //      "lineType": "Orthogonal"
     //    }
     //  },
     //  {
     //    "_id": "Edge5",
     //    "startElement": "Node5",
     //    "endElement": "Node6",
     //    "compartments": [],
     //    "points": [
     //      225,
     //      375,
     //      225,
     //      400
     //    ],
     //    "style": {
     //      "elementStyle": {
     //        "stroke": "black",
     //        "strokeWidth": 1,
     //        "perfectDrawEnabled": false
     //      },
     //      "startShapeStyle": {
     //        "shape": "None",
     //        "stroke": "#000000",
     //        "strokeWidth": 1,
     //        "radius": 10,
     //        "width": 10,
     //        "height": 10,
     //        "fill": "#f0f0f0",
     //        "perfectDrawEnabled": false,
     //        "listening": false
     //      },
     //      "endShapeStyle": {
     //        "shape": "Arrow",
     //        "stroke": "#000000",
     //        "strokeWidth": 1,
     //        "radius": 10,
     //        "width": 10,
     //        "height": 10,
     //        "fill": "#f0f0f0",
     //        "perfectDrawEnabled": false,
     //        "listening": false
     //      },
     //      "lineType": "Orthogonal"
     //    }
     //  },
     //  {
     //    "_id": "Edge6",
     //    "startElement": "Node7",
     //    "endElement": "Node8",
     //    "compartments": [],
     //    "points": [
     //      605,
     //      300,
     //      605,
     //      325
     //    ],
     //    "style": {
     //      "elementStyle": {
     //        "stroke": "black",
     //        "strokeWidth": 1,
     //        "perfectDrawEnabled": false
     //      },
     //      "startShapeStyle": {
     //        "shape": "None",
     //        "stroke": "#000000",
     //        "strokeWidth": 1,
     //        "radius": 10,
     //        "width": 10,
     //        "height": 10,
     //        "fill": "#f0f0f0",
     //        "perfectDrawEnabled": false,
     //        "listening": false
     //      },
     //      "endShapeStyle": {
     //        "shape": "Arrow",
     //        "stroke": "#000000",
     //        "strokeWidth": 1,
     //        "radius": 10,
     //        "width": 10,
     //        "height": 10,
     //        "fill": "#f0f0f0",
     //        "perfectDrawEnabled": false,
     //        "listening": false
     //      },
     //      "lineType": "Orthogonal"
     //    }
     //  },
     //  {
     //    "_id": "Edge9",
     //    "startElement": "Node4",
     //    "endElement": "Node7",
     //    "compartments": [
     //      {
     //        _id: 234234221,
     //        input: "[decision = YES]",
     //        value: "[decision = YES]",
     //        style: {
     //          align: "left",
     //          fill: "0",
     //          fontFamily: "Arial",
     //          fontSize: 12,
     //          fontStyle: "normal",
     //          fontVariant: "normal",
     //          padding: 0,
     //          placement: "start-right",
     //          strokeWidth: "1",
     //          visible: true,
     //        },
     //      },
     //      {
     //        _id: 3433455655,
     //        input: "Hull sections simplified",
     //        value: "Hull sections simplified",
     //        style: {
     //          align: "left",
     //          fill: "0",
     //          fontFamily: "Arial",
     //          fontSize: 12,
     //          fontStyle: "normal",
     //          fontVariant: "normal",
     //          padding: 0,
     //          placement: "start-left",
     //          strokeWidth: "1",
     //          visible: true,
     //        },
     //      },
     //    ],
     //    "points": [
     //      350,
     //      275,
     //      480,
     //      275
     //    ],
     //    "style": {
     //      "elementStyle": {
     //        "stroke": "black",
     //        "strokeWidth": 1,
     //        "perfectDrawEnabled": false
     //      },
     //      "startShapeStyle": {
     //        "shape": "None",
     //        "stroke": "#000000",
     //        "strokeWidth": 1,
     //        "radius": 10,
     //        "width": 10,
     //        "height": 10,
     //        "fill": "#f0f0f0",
     //        "perfectDrawEnabled": false,
     //        "listening": false
     //      },
     //      "endShapeStyle": {
     //        "shape": "Arrow",
     //        "stroke": "#000000",
     //        "strokeWidth": 1,
     //        "radius": 10,
     //        "width": 10,
     //        "height": 10,
     //        "fill": "#f0f0f0",
     //        "perfectDrawEnabled": false,
     //        "listening": false
     //      },
     //      "lineType": "Orthogonal"
     //    }
     //  },
     //  {
     //    "_id": "Edge7",
     //    "startElement": "Node8",
     //    "endElement": "Node5",
     //    "compartments": [
     //      {
     //        _id: 2432422,
     //        input: "[decision = YES]",
     //        value: "[decision = YES]",
     //        style: {
     //          align: "left",
     //          fill: "0",
     //          fontFamily: "Arial",
     //          fontSize: 12,
     //          fontStyle: "normal",
     //          fontVariant: "normal",
     //          padding: 0,
     //          placement: "start-right",
     //          strokeWidth: "1",
     //          visible: true,
     //        },
     //      },
     //    ],
     //    "points": [
     //      480,
     //      350,
     //      315,
     //      350
     //    ],
     //    "style": {
     //      "elementStyle": {
     //        "stroke": "black",
     //        "strokeWidth": 1,
     //        "perfectDrawEnabled": false
     //      },
     //      "startShapeStyle": {
     //        "shape": "None",
     //        "stroke": "#000000",
     //        "strokeWidth": 1,
     //        "radius": 10,
     //        "width": 10,
     //        "height": 10,
     //        "fill": "#f0f0f0",
     //        "perfectDrawEnabled": false,
     //        "listening": false
     //      },
     //      "endShapeStyle": {
     //        "shape": "Arrow",
     //        "stroke": "#000000",
     //        "strokeWidth": 1,
     //        "radius": 10,
     //        "width": 10,
     //        "height": 10,
     //        "fill": "#f0f0f0",
     //        "perfectDrawEnabled": false,
     //        "listening": false
     //      },
     //      "lineType": "Orthogonal"
     //    }
     //  },
     //  {
     //    "_id": "Edge8",
     //    "startElement": "Node8",
     //    "endElement": "Node6",
     //    "compartments": [
     //      {
     //        _id: 2344,
     //        input: "[decision = NO]",
     //        value: "[decision = NO]",
     //        style: {
     //          align: "left",
     //          fill: "0",
     //          fontFamily: "Arial",
     //          fontSize: 12,
     //          fontStyle: "normal",
     //          fontVariant: "normal",
     //          padding: 0,
     //          placement: "start-right",
     //          strokeWidth: "1",
     //          visible: true,
     //        },
     //      },
     //    ],
     //    "points": [
     //      605,
     //      375,
     //      605,
     //      425,
     //      250,
     //      425
     //    ],
     //    "style": {
     //      "elementStyle": {
     //        "stroke": "black",
     //        "strokeWidth": 1,
     //        "perfectDrawEnabled": false
     //      },
     //      "startShapeStyle": {
     //        "shape": "None",
     //        "stroke": "#000000",
     //        "strokeWidth": 1,
     //        "radius": 10,
     //        "width": 10,
     //        "height": 10,
     //        "fill": "#f0f0f0",
     //        "perfectDrawEnabled": false,
     //        "listening": false
     //      },
     //      "endShapeStyle": {
     //        "shape": "Arrow",
     //        "stroke": "#000000",
     //        "strokeWidth": 1,
     //        "radius": 10,
     //        "width": 10,
     //        "height": 10,
     //        "fill": "#f0f0f0",
     //        "perfectDrawEnabled": false,
     //        "listening": false
     //      },
     //      "lineType": "Orthogonal"
     //    }
     //  },
     // ]
   };
    

}


export default generate_elements