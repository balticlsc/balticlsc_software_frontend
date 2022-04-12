import { _ } from 'vue-underscore';

var generate_palette = function() {

    var palette = [{_id: 1, type: "Box", data: {elementTypeId: "fafa"}, defaultSize: {width: 100, height: 100}},
                    {_id: 2, type: "Line", data: {elementTypeId: "abc"}},
                    {_id: 3, type: "Box", data: {elementTypeId: "xyz"}},
                ];

    var palette_buttons = _.each(palette, function(palette_button) {
      
        if (palette_button["type"] == "Box") {

          	palette_button["style"] = {elementStyle: {
                                       // dash: Array[2]
                                        fill: "#ffff80",
                                        fillPriority: "color",
                                        opacity: 1,
                                        shadowBlur: 0,
                                        shadowColor: "red",
                                        shadowOffsetX: 0,
                                        shadowOffsetY: 0,
                                        shadowOpacity: 1,
                                        shape: "Circle",
                                        stroke: "#000000",
                                        strokeWidth: "1",
                                        tension: 0,
                                       // imageSrc: 'http://konvajs.github.io/assets/darth-vader.jpg',
                                      },
                                  };
        }

        else {

          palette_button["style"] = {elementStyle: {
                                                    //opacity: 1,
                                                    shadowBlur: 0,
                                                    shadowColor: "red",
                                                    shadowOffsetX: 0,
                                                    shadowOffsetY: 0,
                                                    shadowOpacity: 1,
                                                    stroke: "rgb(65,113,156)",
                                                    strokeWidth: 1,
                                                    tension: 0,
                                                  },
                                    endShapeStyle: {

                                                  fill: "rgb(65,113,156)",
                                                  fillPriority: "color",
                                                  opacity: 1,
                                                  radius: 12,
                                                  shadowBlur: 0,
                                                  shadowColor: "red",
                                                  shadowOffsetX: 0,
                                                  shadowOffsetY: 0,
                                                  shadowOpacity: 1,
                                                  shape: "Triangle",
                                                  stroke: "rgb(65,113,156)",
                                                  strokeWidth: 1,
                                                  tension: 0,
                                    },

                                    startShapeStyle: {
                                                 // dash: Array[0],
                                                  fill: "rgb(65,113,156)",
                                                  fillPriority: "color",
                                                  opacity: 1,
                                                  radius: 7,
                                                  shadowBlur: 0,
                                                  shadowColor: "red",
                                                  shadowOffsetX: 0,
                                                  shadowOffsetY: 0,
                                                  shadowOpacity: 1,
                                                  shape: "Triangle",
                                                  stroke: "rgb(65,113,156)",
                                                  strokeWidth: 1,
                                                  tension: 0,
                                    },
                                    lineType: "Orthogonal",
                                }
        }

        return palette_button;
    });


	return palette;
}


export default generate_palette