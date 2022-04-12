import { mymixin } from '../mixins/mixins.js';
import { _ } from 'vue-underscore';
import utils from '../../utils/utils';
import blsc_axios from '../../utils/axios';

import AjooEditor from '../../ajoo/AjooEditor';
import KeyStrokes from '../../ajoo/keystrokes';
import ContextMenu from '../../ajoo/contextMenu';

import {BoxCompartments} from '../../ajoo/Elements/Boxes/box_compartments'

import {generateCALMMInstance1} from "./Diagram2CALInstance.js";
import {setModuleDefinitions, getModuleDefinitionByID} from "./CallableUnitDefinitions.js"

export default {
    mixins: [mymixin, utils,],
    props: ["isReadOnly",],
    mounted: function() {
        var self = this;
        const backend = this.SERVER_URL();
        
        var app_id = this.$route.params['applicationId'];

        const request_diagram = blsc_axios.get(backend + "editor/diagram/" + app_id);
        const request_toolbox = blsc_axios.get(backend + "dev/toolbox");
		
        const request_datatypes = blsc_axios.get(backend + "task/dataTypes");
        const request_accesstypes = blsc_axios.get(backend + "task/accessTypes");
        const request_datastructures = blsc_axios.get(backend + "task/dataStructures");

        Promise
          .all([request_diagram, request_toolbox, request_datatypes, request_accesstypes, request_datastructures])
          .then((responses) => {
            var responses_good = true;
            _.each(responses, function(resp) {
                responses_good = self.noErrorsInResponse(resp) && responses_good
            });
            if (responses_good) {
              self.initialize_lists(responses[1], responses[2], responses[3], responses[4]);
              self.init(app_id, responses[0]);
            }
          })
          .catch(error => {
            self.processErrorInPromise(error)
          });
    },

    data: function() {
        var self = this;

        var diagram_type = {id: "CALDiagram",
                            diagramContextMenu: [{index: 1, data: "", procedure: "paste", text: "Paste"},],
                            collectionContextMenu: [{index: 1, data: "", procedure: "copy", text: "Copy"},
                                                    {index: 2, data: "", procedure: "delete", text: "Delete"}
                                                  ],
                          };

        var element_types = self.getElementTypes();
        var element_types_without_ports = _.filter(element_types, function(elem_type) {
                                              return elem_type.type != "Port";
                                          });

        var palette = _.map(element_types_without_ports, function(element_type, i) {
                          return{_id: i,
                                 type: element_type.type,
                                 data: {elementTypeId: element_type.id},
                                 defaultSize: element_type.defaultSize,
                                 style: element_type.style,
                                };
                      });

        var data = {boxes:[], lines:[], ports: [],};
        //var style = self.getContextMenuStyle();

        return {applicationId: "",
                editor: {},
                activeElementId: undefined,
                elementTypes: element_types,
                diagramType: diagram_type,
                palette: palette,
                dialog: {},
                data: data,
                x: 0,
                y: 0,
                style: self.getContextMenuStyle(),
                contextMenu: undefined,
                menu: [],
                accessTypes:[],
                dataTypes:[],
                dataStructures:[],
                dynamicTypes: [],
              };
    },

    methods: {

      initialize_lists: function(response_toolbox, response_dataTypes, response_accessTypes, response_dataStructures) {
        var self = this;
        if (self.noErrorsInResponse(response_dataTypes) && self.noErrorsInResponse(response_accessTypes) && 
        self.noErrorsInResponse(response_dataStructures) && self.noErrorsInResponse(response_toolbox)) 
        {
          this.dataTypes = _.sortBy(_.map(response_dataTypes.data.data, function(dt) {
            return {
              name: dt.name + " (" + dt.version + ")",
              uid: dt.uid,
              isStructured: dt.isStructured,
            }
          }), function(dt) {
            return dt.name
          });
      
          this.accessTypes = _.sortBy(_.map(response_accessTypes.data.data, function(at) {
            return {
              name: at.name + " (" + at.version + ")",
              uid: at.uid,
            }
          }), function(at) {
            return at.name
          });
          this.dataStructures = _.sortBy(response_dataStructures.data.data, function(ds) { return ds.name});
          this.dynamic_types = self.getDynamicTypes(response_toolbox.data.data);
          this.elementTypes = self.elementTypes.concat(self.dynamic_types);
          var dynamic_palette = _.map(self.dynamic_types, function(element_type, i) {
            return {_id: self.palette.length + i,
                   type: element_type.type,
                   data: {elementTypeId: element_type.id},
                   defaultSize: element_type.defaultSize,
                   style: element_type.style,
                  };
          });
          this.palette = self.palette.concat(dynamic_palette);
          
        }
      },

      init: function(app_id, response_diagram) {
          var self = this;

          var backend = this.SERVER_URL();

          console.log("response_diagram ", response_diagram) 

          if (self.noErrorsInResponse(response_diagram)) {

            self.applicationId = app_id;                        
            self.data = {boxes: self.processResponse(response_diagram).data.boxes, lines: self.processResponse(response_diagram).data.lines, ports: self.processResponse(response_diagram).data.ports};  
            
            var palette = self.palette;

            var settings = {container: "editor",

                            width: $(document).width(),
                            height: $(document).height() - 100,

                            isEditModeEnabled: true,
                            isGridEnabled: false,
                            data: {
                                   boxes: self.processElementId(self.data.boxes),
                                   lines: self.processElementId(self.data.lines),
                                   ports: self.processElementId(self.data.ports),
                                 },

                            area: {
                                background: {
                                            fill: "white",
                                            fillPriority: "color",
                                        },
                            },

                            palette: {elements: palette,
                                      settings: {width: 40, height: 30, padding: 3},
                                    },

                            selectionStyle: {
                                            fill: "grey",
                                            opacity: 0.4,
                                            stroke: "black",
                                            strokeWidth: 0.6,
                                        },

                            events: {

                              collectionPositionChanged: function(data) {

                                  var drag_layer = editor.getLayer("DragLayer");
                                  var drag_group = editor.findChild(drag_layer, "DragGroup");

                                  var boxes = _.map(data.boxes, function(box_id) {
                                                  var elem_list = editor.getElements();
                                                  var box = elem_list[box_id];
                                                  var box_size = box.getSize();

                                                  box_size.x += drag_group.x();
                                                  box_size.y += drag_group.y();

                                                  return {id: box_id, location: box_size};
                                              });

                                  var lines = _.map(data.lines, function(line) {
                                                  return {id: line.id, points: self.transformPoints(line.points)}
                                              });

                                  var ports = _.map(data.ports, function(port_in) {
                                                  var elem_list = editor.getElements();
                                                  var port_id = port_in.id;

                                                  var port = elem_list[port_id];
                                                  var port_size = port.getSize();

                                                  var port_parent_size = port.parent.getSize();
                                                  var location = {x: Math.round(port_size.x - port_parent_size.x + drag_group.x()),
                                                                  y: Math.round(port_size.y - port_parent_size.y + drag_group.y()),
                                                                  width: Math.round(port_size.width),
                                                                  height: Math.round(port_size.height),
                                                                };

                                                  return {id: port_id, location: location};
                                              });

                                  var body = {};
                                  if (_.size(boxes) > 0) {
                                    body.boxes = boxes;
                                  }

                                  if (_.size(lines) > 0) {
                                    body.lines = lines;
                                  }

                                  if (_.size(ports) > 0) {
                                    body.ports = ports;
                                  }

                                  blsc_axios.put(backend + "editor/element", body)
                                        .then(response => {
                                            self.noErrorsInResponse(response);
                                        });
                              },

                              //Clicks
                              // eslint-disable-next-line no-unused-vars
                              clickedOnDiagram: function(data) {
                                self.activeElementId = undefined;
                                self.hideContextMenu();
                              },

                              clickedOnElement: function(data) {
                                self.activeElementId = data.element._id;

                                self.hideContextMenu();

                                var elem_type_id = data.element.elementTypeId;
                                var elem_type = self.getActiveElementType(elem_type_id);
                                if (!elem_type) {
                                  if (!self.isReadOnly) {
                                    self.addNotification("You have no tool in the toolbox used to create this diagram. No element type " + elem_type_id + " for element with id=" + data.element._id,"error")
                                    self.dialog = [];
                                    return;
                                  } else {
                                    elem_type = self.getDefaultElementType();  
                                  };
                                }

                                self.buildDialog(data.element, elem_type);
                              },

                              // eslint-disable-next-line no-unused-vars
                              clickedOnCollection: function(data) {
                                self.activeElementId = undefined;
                              },

                              //RClicks
                              rClickedOnDiagram: function(data) {
                                self.activeElementId = undefined;
                                self.hideContextMenu();

                                var menu = self.diagramType.diagramContextMenu;
                                var ev = data.ev;
                                var context_menu = new ContextMenu(ev, self, menu);

                                self.contextMenu = context_menu;
                              },

                              rClickedOnElement: function(data) {
                                self.hideContextMenu();

                                var menu = [];
                                var elem_type = self.getActiveElementType(data.element.elementTypeId);
                                if (elem_type) {
                                  menu = elem_type.contextMenu;
                                }

                                var ev = data.ev;
                                var context_menu = new ContextMenu(ev, self, menu);

                                self.contextMenu = context_menu;
                              },

                              rClickedOnCollection: function(data) {
                                self.activeElementId = undefined;

                                self.hideContextMenu();
                                var menu = self.diagramType.collectionContextMenu;

                                var ev = data.ev;
                                var context_menu = new ContextMenu(ev, self, menu);

                                self.contextMenu = context_menu;
                              },

                              keystrokes: function() {
                                console.log("keystroke pressed", KeyStrokes)
                              },

                              newBoxCreated: function(data) {
                                  var elem_type = self.getActiveElementType(data.elementTypeId);

                                  var new_elem = {
                                                  _id: data._id,
                                                  diagramId: app_id,
                                                  elementTypeId: elem_type.id,
                                                  type: 0,
                                                  style: elem_type.style,
                                                  compartments: _.map(elem_type.compartmentTypes, function(compart_type, i) {
                                                                    var id = $.now() + i.toString();
                                                                    return {id: id,
                                                                            _id: id,
                                                                            input: compart_type.defaultValue || id,
                                                                            value: compart_type.defaultValue || id,
                                                                            style: compart_type.style,
                                                                            compartmentTypeId: compart_type.id,
                                                                            compartmentType: compart_type,
                                                                            underline: compart_type.underline || false,
                                                                          };
                                                                }),
                                                  location: data.getElementPosition(),
                                                };

                                  if( 'callable_unit_uid' in elem_type ){
                                    //following does NOT work - backend ignores 'callable unit id'
                                    //new_elem['callable_unit_uid'] = elem_type['callable_unit_uid']
                                    
                                    //stringify is needed, because backend does not accept data as JavaScript object
                                    //it accepts it as a string
                                    new_elem['data'] =  JSON.stringify({callable_unit_uid : elem_type['callable_unit_uid']});

                                    const module_defs = getModuleDefinitionByID(elem_type['callable_unit_uid']);
                                    var req_pins = [];
                                    var prv_pins = []
                                    _.each(module_defs.declared_pins, function(dec_pin) {
                                        if(dec_pin.pin_type == "required"){
                                          req_pins.push(dec_pin)
                                        } else {
                                          prv_pins.push(dec_pin)
                                        }
                                    });
                                    //console.log("req pins", req_pins , "prv_pins", prv_pins);

                                    //new_elem.location.width = 300
                                  }
                                
                                  var editor_element = data;

                                  //adding texts group
                                  // eslint-disable-next-line no-undef
                                  var texts_group = new Konva.Group({listening: false});
                                  texts_group["name"] = "TextsGroup";
                                  editor_element.presentation.add(texts_group);
                                  texts_group.moveToTop();


                                  //adds element compartments
                                  var compartments = new_elem["compartments"];
                                  editor_element.compartments = new BoxCompartments(editor_element, compartments);

                                  blsc_axios.post(backend + "editor/element", [new_elem])
                                        .then(response => {
                                            if (self.noErrorsInResponse(response)) {
                                                var elem_list = editor.getElements();
                                                delete elem_list[data._id];

                                                var new_id = self.processResponse(response).data.boxesId[0];
                                                _.extend(new_elem, {_id: new_id, id: new_id, type: "Box",});
                                                self.data.boxes.push(new_elem);

                                                editor_element._id = new_id;
                                                self.activeElementId = new_id;
                                                elem_list[new_id] = editor_element;

                                                self.buildDialog(new_elem, elem_type);

                                                if( 'callable_unit_uid' in elem_type ){
                                                  const left_dash_size = Math.floor((new_elem.location.height - _.size(req_pins) * 30) / (_.size(req_pins) + 1))
                                                  const right_dash_size = Math.floor((new_elem.location.height - _.size(prv_pins) * 30) / (_.size(prv_pins) + 1))   
                                                  let lastUsedY_forIn = left_dash_size
                                                  let lastUsedY_forOut = right_dash_size
                                                  
                                                  _.each(req_pins, function(req_pin){
                                                    let data = JSON.stringify({declared_pin_uid : req_pin.uid})
                                                    self.addPort(-30 , lastUsedY_forIn, data, req_pin.name, 
                                                                  req_pin.multiplicity, req_pin.dataMultiplicity, 
                                                                  "RequiredComputedPin", req_pin.access_type, req_pin.data_type);
                                                    lastUsedY_forIn += 30 + left_dash_size
                                                  })
                                                  _.each(prv_pins, function(prv_pin){
                                                    let data = JSON.stringify({declared_pin_uid : prv_pin.uid})
                                                    self.addPort(new_elem.location.width, lastUsedY_forOut, data, prv_pin.name, 
                                                                  prv_pin.multiplicity, prv_pin.dataMultiplicity,
                                                                  "ProvidedComputedPin", prv_pin.access_type, prv_pin.data_type);
                                                    lastUsedY_forOut += 30 + right_dash_size
                                                  })
                                                }
                                        
                                            }
                                        });
                                  
                                  //console.log(new_elem)
                              },
                                
                              newLineCreated: function(data) {
                                  var elem_type = self.getActiveElementType(data.elementTypeId);
                                  var new_elem = {_id: data._id,
                                                  diagramId: app_id,
                                                  elementTypeId: elem_type.id,
                                                  type: 1,
                                                  style: elem_type.style,
                                                  compartments: _.map(elem_type.compartmentTypes, function(compart_type, i) {
                                                                    var id = $.now() + i.toString();
                                                                    return {id: id,
                                                                            _id: id,
                                                                            input: compart_type.defaultValue || id,
                                                                            value: compart_type.defaultValue || id,
                                                                            style: compart_type.style,
                                                                            compartmentTypeId: compart_type.id,
                                                                          };
                                                                }),
                                                  points: self.transformPoints(data.getPoints()),
                                                  startElement: data.startElementId,
                                                  endElement: data.endElementId,
                                                };

                                  var editor_element = data;

                                  blsc_axios.post(backend + "editor/element", [new_elem])
                                        .then(response => {
                                            if (self.noErrorsInResponse(response)) {
                                                var elem_list = editor.getElements();
                                                
                                                var new_id = self.processResponse(response).data.linesId[0];
                                                var old_line_id = data._id;
                                                delete elem_list[old_line_id];

                                                var start_elem_id = new_elem.startElement;
                                                var start_elem = elem_list[start_elem_id];
                                                start_elem.outLines[new_id] = start_elem.outLines[old_line_id];
                                                delete start_elem.outLines[old_line_id];

                                                var end_elem_id = new_elem.endElement;
                                                var end_elem = elem_list[end_elem_id];
                                                end_elem.inLines[new_id] = end_elem.inLines[old_line_id];
                                                delete end_elem.inLines[old_line_id];
                                                
                                                _.extend(new_elem, {_id: new_id, id: new_id, type: "Line",});
                                                self.data.lines.push(new_elem);

                                                editor_element._id = new_id;
                                                self.activeElementId = new_id;
                                                elem_list[new_id] = editor_element;

                                                self.buildDialog(new_elem, elem_type);
                                            }
                                        });
                              },

                              creatingNewLine: function(data) {
                                console.log("creating new line ", data)

                                return;

                              },

                              deleteElements: function(elements) {
                                console.log("in delete elemetns", elements)

                              },

                              elementResized: function(data) {
                                  var elem_id = data.elementId;
                                  var location = {x: data.x,
                                                  y: data.y,
                                                  width: data.width,
                                                  height: data.height,
                                                };

                                  var boxes = [{id: elem_id, location: location},];
                                  var lines = _.map(data.lines, function(line) {

                                                  return {id: line._id, points: self.transformPoints(line.points)};
                                              });

                                  var ports = _.map(data.ports, function(port) {
                                                  return {id: port._id, location: port.location};
                                              });


                                  var body = {boxes: boxes,};
                                  if (_.size(lines) > 0) {
                                    body.lines = lines;
                                  }

                                  if (_.size(ports) > 0) {
                                    body.ports = ports;
                                  }

                                  blsc_axios.put(backend + "editor/element", body)
                                        .then(response => {
                                            self.noErrorsInResponse(response);
                                        });
                              },

                              checkingNewLineConstraints: function(state) {

                                  if (!state.end) {
                                    return;
                                  }

                                  var line_type = _.find(self.elementTypes, function(elem_type) {
                                                      return elem_type.id == state.object.elementTypeId;
                                                  });

                                  if (!line_type) {
                                    return;
                                  }

                                  var start_elem = state.start.element;
                                  var start_elem_type_id = start_elem.elementTypeId;

                                  var end_elem = state.end;
                                  var end_elem_type_id = end_elem.elementTypeId;

                                  var constraint = _.find(line_type.constraints, function(constraint) {
                                                      return constraint.startTypeId == start_elem_type_id && constraint.endTypeId == end_elem_type_id;
                                                  });

                                  if (!constraint) { 
                                    self.addNotification("Flow between these elements is not allowed!", "error");
                                    return false;
                                  }

                                  var start_cardinality = line_type.startCardinality || constraint.startCardinality || Infinity;
                                  var end_cardinality = line_type.endCardinality || constraint.endCardinality || Infinity;
                                  if (start_cardinality > _.size(start_elem.outLines) && end_cardinality > _.size(end_elem.inLines)) {
                                      return true;
                                  }
                                  else {
                                      self.addNotification("Can't attach one more flow!", "error"); 
                                      return false;
                                  }
                              },

                              newElementStarted: function(data) {
                                  console.log("new elmeent started ", data)
                              },

                            },
                        };

            settings.isEditModeEnabled = !self.isReadOnly;

            var editor = new AjooEditor(settings);
            self.editor = editor;
          }
        },
        // eslint-disable-next-line no-unused-vars
        deleteDiagram: function(e) {
          var self = this;

          blsc_axios.delete(self.SERVER_URL() + "dev/unit/" + self.applicationId)
                .then(response => {
                    if (self.noErrorsInResponse(response)) {
                      self.$router.push({name: "ComputationApplications"});
                    }              
                });
        },

        addPort: function(x, y, data, portName, multiplicity, dataMultiplicity, typeName, accessTypeUid, dataTypeUid) {
          var self = this;

          var editor = self.editor;
          var selected_elements = editor.getSelectedElements();

          if (_.size(selected_elements) == 1) {
              var selected_element = _.values(selected_elements)[0];

              var port_type = _.find(self.elementTypes, function(elem_type) {
                                  return elem_type.id == typeName;
                              });

              if (!port_type) {
                self.addNotification("No Port Type has been found!")
                return;
              }

              var style = (multiplicity=="single") ? port_type.style["elementStyle"] : port_type.style["secondStyle"];
              
              let shape = "";
              if(multiplicity == "single"){//tokenMultiplicity
                if(dataMultiplicity == "single"){
                  shape = "PortIn";
                }else{
                  shape = "PortInMultiple";
                }
              }else{
                if(dataMultiplicity == "single"){
                  shape = "PortOut";
                }else{
                  shape = "PortOutMultiple";
                }
              }

              style.shape = shape;
              
              //console.log("style", style , port_type)
              var size = {width: 30, height: 30,};

              var location = null
              if( x == null || y == null ){
                //use default values
                location = {x: -size.width, y: -size.height,};
              }else{
                //use provided values
                location = {x: x, y: y};
              }
              _.extend(location, size);


              var port_id = "port_" + $.now();
              var port_in = {
                              _id: port_id,
                              type: 2,
                              location: location,
                              parentId: selected_element._id,
                              elementTypeId: port_type.id,
                              style: {elementStyle: style},
                              diagramId: this.applicationId,
                              compartments: _.map(port_type.compartmentTypes, function(compart_type, i) {
                                                var id = $.now() + i.toString();
                                                var compValue = "";
                                                switch (compart_type.name) {
                                                  case "Name":
                                                    compValue = portName;
                                                    break;
                                                  case "Access Type":
                                                    var atype = _.find(self.accessTypes, function(at) { return at.uid==accessTypeUid}) ;
                                                    compValue = atype ? atype.name : "unknown";
                                                    break;
                                                  case "Data Type":
                                                    var dtype = _.find(self.dataTypes, function(dt) { return dt.uid==dataTypeUid}) ;
                                                    compValue = dtype ? dtype.name : "unknown";
                                                    break;
                                                  default:
                                                    compValue = compart_type.defaultValue;
                                                  };
                                                return {id: id,
                                                        _id: id,
                                                        input: compValue,
                                                        value: compValue,
                                                        style: compart_type.style,
                                                        compartmentTypeId: compart_type.id
                                                      };
                                            }),
                              data: ( data == null ? "" : data),
                            };
              
              editor.addElements({ports: [port_in]}, true);

              blsc_axios.post(self.SERVER_URL() + "editor/element", [port_in])
                    .then(response => {
                        if (self.noErrorsInResponse(response)) {
                            var elem_list = editor.getElements();
                            var editor_element = elem_list[port_id];
                            delete elem_list[port_id];

                            var new_id = self.processResponse(response).data.portsId[0];
                            _.extend(port_in, {_id: new_id, id: new_id,});
                            self.data.ports.push(port_in);


                            editor_element._id = new_id;
                            editor_element.presentation.objId = new_id;
                            self.activeElementId = new_id;
                            elem_list[new_id] = editor_element;


                            editor.selection.unselect(undefined, true);
                            editor.selectElements([editor_element]);

                            self.buildDialog(port_in, port_type);
                        }
                    });
          }

        },

        transformPoints: function(points_in) {
            return _.map(points_in, function(p) {
                      return Math.round(p);
                  });
        },

        processElementId: function(elems) {
            var self = this;
            var types = {0: "Box", 1: "Line", 2: "Port"};

            return _.map(elems, function(elem) {
                      var compartments = self.processCompartmentId(elem);
                      _.extend(elem, {_id: elem.id, type: types[elem.type], compartments: compartments,});
                      return elem;
                  });
        },

        sortCompartments: function(compartments, compart_types) {
          var self = this;  
          var compartments_out = [];
            _.each(compart_types, function(compart_type) {
                var compart = _.find(compartments, function(compartment) {
                                  return compartment.compartmentTypeId == compart_type.id;
                              });

                if (!compart) {
                    if (!self.isReadOnly) {
                      console.error("No compartment for ", compart_type.id, compart_type);
                      return;
                    } else {
                      // hack to show Call unit compartments
                      compart = _.find(compartments, function(compartment) {
                        return compartment.compartmentTypeId.endsWith(compart_type.id.substring(4)) 
                      });
                      if (!compart) {
                        console.error("No compartment for ", compart_type.id, compart_type);
                        return;
                      } 
                    }
                }

                compartments_out.push(compart);
            });

            return compartments_out;
        },

        processCompartmentId: function(elem) {
            var self = this;

            var elem_type = self.getActiveElementType(elem.elementTypeId);
            if (!elem_type) {
              if (!self.isReadOnly) {
                self.addNotification("No element type " + elem.elementTypeId + " found for the element " + elem.id, "error");
                return [];
              } else {
                elem_type = self.getDefaultElementType();
              }  
            }
            var sorted_compartments = self.sortCompartments(elem.compartments, elem_type.compartmentTypes);
            return _.map(sorted_compartments, function(compartment) {
                      _.extend(compartment, {_id: compartment.id});
                      _.extend(compartment, {compartmentType: self.getCompartmentTypeByIdFromElementType(elem_type, compartment.compartmentTypeId)});
                      return compartment;
                    });
        },

        addMissingCompartments: function(elem, compartments) {
            var self = this;

            var elem_type = self.getActiveElementType(elem.elementTypeId);
            if (!elem_type) {
                self.addNotification("No element type " + elem.elementTypeId + " found for the element " + elem.id, "error");
                return [];
            }

            return _.map(elem_type.compartmentTypes, function(compart_type, i) {

                      var compart = _.find(compartments, function(compart) {
                                        return compart.compartmentTypeId == compart_type.id;
                                    });

                      if (!compart) {
                        var id = $.now() + i.toString();
                        compart = {id: id,
                                    _id: id,
                                    input: compart_type.defaultValue || id,
                                    value: compart_type.defaultValue || id,
                                    style: compart_type.style,
                                    compartmentTypeId: compart_type.id,
                                    compartmentType: compart_type,
                                    underline: compart_type.underline || false,
                                  };
                      }

                      return compart;
                  });
        },

        executeMenuProcedure: function(e) {
          e.preventDefault();
          var self = this;
          var context_menu = self.contextMenu;
          if (context_menu) {
            context_menu.selectMenuItem(e, self);
          }
          else {
            self.addNotification("No context menu found", "error")
          }

        },

        getContextMenuStyle: function() {
          return "display:none; position:absolute; left:0px; top:0px;";
        },

        hideContextMenu: function() {
          var self = this;
          var context_menu = self.contextMenu;
          if (context_menu) {
            context_menu.hide(self);
          }
        },

        processKeyStroke: function() {
            console.log("in process keystroke")
        },

        isActiveElement: function() {
            var self = this;

            var res = false;
            if (self.activeElementId) {
              res = true;
            }

            return res;
        },

        isAddPortButtonActive() {
            return false;
          
           /* var self = this;

            var res = false;
            if (self.activeElementId) {
                var elements_list = self.editor.getElements()
                var element = elements_list[self.activeElementId];
                if (element) {
                    var elem_type_id = element.elementTypeId;
                    //  drosi vien janem visi boxi, kas nav ne RequiredDataPin ne ProvidedDataPin 
                    if (elem_type_id == "Call1" || elem_type_id == "Call2" || elem_type_id == "Call3" || elem_type_id == "Call4" || elem_type_id == "Call5"  ) {
                        res = true;
                    }
                }
            }

            return res; */
        },

        getActiveElementType: function(elem_type_id) {
            var self = this;

            return _.find(self.elementTypes, function(e_type) {
                      return e_type.id == elem_type_id;
                  });
        },

        getCompartmentTypeByIdFromElementType: function(elem_type, compart_type_id) {
            var self = this;
            var comp_type = _.find(elem_type.compartmentTypes, function(compart_type) {
                      return compart_type.id == compart_type_id;
                  });
            if (!comp_type && self.isReadOnly) {
              // hack to show Call units in read only mode
              comp_type = _.find(elem_type.compartmentTypes.slice().reverse(), function(compart_type) {
                  return compart_type_id.endsWith(compart_type.id.substring(4));
              });  
            }      

            return comp_type;
        },

        
        updateElementStyleByValue: function(value, element, compart_type) {
          var self = this;

          var style_delta;
          if (compart_type.extensionPoints && compart_type.extensionPoints.dynamicElementStyleOnCompartmentUpdate) {
              style_delta = compart_type.extensionPoints.dynamicElementStyleOnCompartmentUpdate(value, element, compart_type, self);
          }

          else {
            style_delta = _.find(compart_type.styleDeltas, function(style_delta) {
                                  return style_delta.value == value;
                              });
          }

          if (style_delta) {
              var types_of_elements = {Box: "boxes", 0:"boxes", Line: "lines", 1:"lines", 2:"ports", Port: "ports",};

              var type_of_element = types_of_elements[element.type];
              if (!type_of_element) {
                  self.addNotification("No type " + element.type + " found ", "error");
                  return;
              }

              var elem_style = element.style.elementStyle;
              _.extend(elem_style, style_delta.elementStyle);

              var body = {};
              body[type_of_element] = [{id: element.id, style: {elementStyle: elem_style,},},];

              var elem_in = _.find(self.data[type_of_element], function(tmp_elem) {
                                return tmp_elem.id == element.id;
                            });

              if (!elem_in) {
                self.addNotification("No element with id="+ element.id +" found ","error");
                return;
              }

              var element_list = self.editor.getElements();
              var elem_id = element.id;
              var old_elem = element_list[elem_id];

              if (!old_elem) {
                self.addNotification("Problem with id-s in the diagram when changing element style!", "error");
                return;
              }

              self.editor.selection.unselect();
              var size = old_elem.getSize();
              _.extend(elem_in, {location: size});

              var new_elems = {};
              new_elems[type_of_element] = [elem_in];

              old_elem.presentation.remove();                  
              delete element_list[elem_id]

              self.editor.addElements(new_elems);
              var new_elem = element_list[elem_id];
              _.extend(new_elem, {inLines: old_elem.inLines,
                                  outLines: old_elem.outLines,
                                  ports: old_elem.ports,
                                });


              _.each(old_elem.ports, function(port) {
                  port.presentation.moveTo(new_elem.presentation);
                  port.presentation.moveToTop();
                  port.parent = new_elem;
              });

              self.editor.selectElements([new_elem], false);

              blsc_axios.put(this.SERVER_URL() + "editor/element", body)
                    .then(response => {
                        self.noErrorsInResponse(response)
                    });
          }

        },


        getActiveElement: function() {
          var self = this;

          return _.find(_.union(self.data.boxes, self.data.lines, self.data.ports), function(elem) {
                  return elem._id == self.activeElementId;
                });
        },

        getElementById: function(elem_id) {
          var self = this;
          return _.find(_.union(self.data.boxes, self.data.lines, self.data.ports), function(elem) {
            return elem._id == elem_id;
          });

        },

        // eslint-disable-next-line no-unused-vars
        editApp: function(ev) {
            console.log("in edit app");
        },

        // eslint-disable-next-line no-unused-vars
        zoomIn: function(ev) {
          this.editor.zoomIn();
        },
        
        // eslint-disable-next-line no-unused-vars
        zoomOut: function(ev) {
          this.editor.zoomOut();
        },

        // eslint-disable-next-line no-unused-vars
        togglePanning: function(ev) {
          var editor = this.editor;

          if (editor.panning.isPanningEnabled()) {
            editor.disablePanning();
          }
          else {
            editor.enablePanning();
          }
        },

        // eslint-disable-next-line no-unused-vars
        toggleGrid: function(ev) {
          var grid = this.editor.grid;
          if (grid.isGridEnabled) {
            grid.removeGrid();
          }
          else {
            grid.showGrid();
          }
        },

        buildDialog: function(elem_in, elem_type) {
            var self = this;

            if (!elem_type) {
              self.addNotification("No element type for element " + elem_in.id, "error");
              self.dialog = [];
              return;
            }

            var element_id = elem_in._id;
            var elements = _.union(self.data.boxes, self.data.lines, self.data.ports);
            var element = _.find(elements, function(elem) {
                              return elem._id == element_id;
                          });

            if (!element) {
              self.addNotification("No element found by id="+element_id,"error");
              return;
            }

            self.dialog = _.map(elem_type.compartmentTypes, function(compart_type, i) {
                              var compart_id = "compart_" + i;
                              var compart_value = "";
                              if (_.size(element.compartments) > 0) {
                                  var compart = _.find(element.compartments, function(comp) { return comp.compartmentTypeId==compart_type.id});
                                  if (compart) {
                                    compart_value = compart.value;
                                    compart_id = compart._id;
                                  } else {
                                    if (self.isReadOnly) {
                                      // hack to show Call units in Read only mode
                                      compart = _.find(element.compartments, function(comp) {
                                        return comp.compartmentTypeId.endsWith(compart_type.id.substring(4));
                                      });
                                      if (compart) {
                                        compart_value = compart.value;
                                        compart_id = compart._id;
                                      }
                                    }
                                  }
                              }

                              if (compart_type.inputType.inputType == "checkbox") {
                                  if (compart_value == "true") {
                                      compart_value = "checked";
                                  }
                                  else {  
                                    compart_value = "";
                                  }
                              }

                              return {_id: compart_id,
                                      name: compart_type.name,
                                      inputType: compart_type.inputType,
                                      value: compart_value,
                                      elementId: element_id
                                    };
                          });
        },

        shouldSelectBeVisible:function(row){
          //console.log("row", row)
          if(row.name == "Data Structure"){
            const data_type = this.dialog.filter(d=>d.name == "Data Type");
            if( data_type && data_type[0] ){
              const selected_data_type_uid = data_type[0].value;
              const dt = this.dataTypes.filter(dt=>dt.uid == selected_data_type_uid);
              if(dt && dt[0]){
                //console.log("dt", dt);
                return dt[0].isStructured;
              }
            }
            return false;
          }
          return true;
        },

        updateInput: function(e) {
            var self = this;

            var input_field = $(e.target);

            var list = {
              id: input_field.attr("id"),
              elem_id: input_field.attr("elem_id"),
              value: input_field.val()
            };

            self.updateCompartment(list);
        },

        updateCheckbox: function(e) {
            var self = this;
            var input_field = $(e.target);
            var list = {
              id: input_field.attr("id"),
              elem_id: input_field.attr("elem_id"),
              value: input_field.prop('checked').toString(),
            };
            
            self.updateCompartment(list);
        },

        updateSelect: function(e){
            var self = this;

            var input_field = $(e.target); 
            var list = {
              id: input_field.attr("id"),
              elem_id: input_field.attr("elem_id"),
              value: input_field[0].selectedOptions[0].value,
              input: input_field[0].selectedOptions[0].innerHTML,
            };

            self.updateCompartment(list);
        },

        updateCompartment: function(list) {
            var self = this;

            var elem = self.getElementById(list["elem_id"]);
            if (!elem) {
              self.addNotification("No element found with id=" + list["elem_id"],"error");
              return;
            }

            var compartment = _.find(elem.compartments, function(compart) {
                                  return compart._id == list["id"];
                              });

            if (compartment) {
                _.extend(compartment, {value: list["value"], input: list["input"] || list["value"],});
            }

            var body = {value: list["value"], input: list["input"] || list["value"],};
            blsc_axios.put(self.SERVER_URL() + "editor/compartment/" + list["id"], body)
                  .then(response => {
                    self.noErrorsInResponse(response);
                  });

            var elem_type = self.getActiveElementType(elem.elementTypeId);
            var compart_type = self.getCompartmentTypeByIdFromElementType(elem_type, compartment.compartmentTypeId);

            self.updateElementStyleByValue(list.value, elem, compart_type);

            var prop = self.getEditorCompartment(list["id"]);

            if (prop) {

                prop.presentation.text(list["value"]);
                var editor_element = _.find(self.editor.getElements(), function(tmp_elem) {
                                        return tmp_elem._id == elem._id;
                                    });

                if (editor_element) {
                    if (editor_element.compartments) {
                      editor_element.compartments.recomputeCompartmentsPosition();
                    }

                    // editor_element.presentation.draw();
                    self.editor.getLayer("DragLayer").draw();
                    self.editor.getLayer("ShapesLayer").draw();
                }
            }
        },

        getEditorCompartment: function(compart_id) {
          var self = this;

          var editor = self.editor;
          return _.find(editor.compartmentList, function(compart) {
                    return compart._id == compart_id;
                });
        },

        getDynamicTypes: function(toolbox_data) {
          var toolbox = [];
          toolbox = _.map(toolbox_data, function(ca) {
              var call_unit = {
                      "uid": ca.uid,
                      "name": ca.unit.name + " " + ca.version, 
                      "cu_type": ca.isApp ? "CA" : "CU", 
                      "image_ref": ca.yaml,
                      "icon": ca.unit.icon,
                      "declared_pins": _.map(ca.pins, function(pin) {
                        return {
                            "uid":pin.uid, 
                            "pin_type":pin.binding==2 || pin.binding==3 ? "provided" : "required", 
                            "binding":pin.binding==2 || pin.binding==3 ? "provided" : pin.binding ==1 ? "required_strong" : "required_weak",
                            "name":pin.name, 
                            "multiplicity":pin.tokenMultiplicity==0 ? "single" : "multiple",
                            "dataMultiplicity":pin.dataMultiplicity==0 ? "single" : "multiple",
                            "mandatory":pin.binding>0,
                            "data_type":pin.dataTypeUid,
                            "access_type":pin.accessTypeUid,
                            "data_structure":pin.dataStructureUid,
                        }
                      })
                  };
              return call_unit;
          })
          setModuleDefinitions(toolbox);
              
          var type_list = _.map(toolbox, function(cu) {
              const pin_count = _.countBy(cu.declared_pins, function(dec_pin) {
                return dec_pin.pin_type == "required" ? 'req' : 'prv';
              });
              const max_pin_count = _.max([pin_count["req"],pin_count["prv"]]);
              const default_height = 30 * max_pin_count + 25 * (max_pin_count + 1)  
              return {
                id: "Call"+cu.uid,
                callable_unit_uid: cu.uid,
                type: "Box",
                name: cu.name,
                defaultSize: {width: 125, height: default_height},
                contextMenu: [{index: 1, data: "", procedure: "copy", text: "Copy"},
                          {index: 2, data: "", procedure: "delete", text: "Delete"}
                          ],
                style: {
                  elementStyle: {
                    fill: "#FFFFFF",
                    opacity: 1,
                    stroke: "#000000",
                    strokeWidth: 1,
                    shape: "RoundRectangle",
                    perfectDrawEnabled: false,
                    dash: [10,0],
                    imageSrc: cu.icon,
                  }
                },
                compartmentTypes: [
                  {
                    "id": "Call"+cu.uid+"Name",
                    "name": "Unit Call Name",
                    "inputType": {
                      "type": "input",
                      "inputType": "text",
                    },
                    "defaultValue":cu.name,
                    "underline": true,
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
                      "text": cu.name,
                      "listening": false,
                      "perfectDrawEnabled": false,
                      "width": "auto",
                      "height": "auto"
                    }
                  },
                  {
                    "id": "Call"+cu.uid+"CUName",
                    "name": "Computation Unit Name",
                    "inputType": {
                      "type": "input",
                      "inputType": "none",
                    },
                    "defaultValue":cu.name,
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
                      "text": cu.name,
                      "listening": false,
                      "perfectDrawEnabled": false,
                      "width": "auto",
                      "height": "auto"
                    }
                  },
                  {
                    "id": "Call"+cu.uid+"Binding",
                    "name": "Binding",
                    "inputType": {
                      "type": "input",
                      "inputType": "checkbox", // true - Strong, false - Weak
                    },
                    "defaultValue":"true",
                    "style": {
                      "align": "center",
                      "fill": "#000000",
                      "fontFamily": "Arial",
                      "fontSize": 14,
                      "fontStyle": "bold",
                      "fontVariant": "normal",
                      "strokeWidth": 1,
                      "visible": false,
                      "y": 0,
                      "text": "",
                      "listening": false,
                      "perfectDrawEnabled": false,
                      "width": "auto",
                      "height": "auto"
                    },
                    "styleDeltas": [
                      {"value": "true", "elementStyle":{"dash":[10,0]}},
                      {"value": "false", "elementStyle":{"dash":[10,10]}}
                    ]  
                  },
                ],
              }
          })
          return type_list;
         
        },
        
        updateRDPShape:function(value, element, compart_type, self) {
          const active_elem = self.getActiveElement();

          const token_multiplicity = active_elem.compartments.filter(compartment => 
            compartment.compartmentTypeId == "RequiredDataPinMultiplicity" );
          
          const data_multiplicity = active_elem.compartments.filter(compartment => 
            compartment.compartmentTypeId == "RequiredDataPinDataMultiplicity" );
          
          var style_delta = {};

          // console.log(token_multiplicity[0], data_multiplicity[0])
          if(!token_multiplicity[0] || !data_multiplicity[0]){
            console.log("Failed to get value of Data Multiplicity or Token multiplicity");
            return style_delta;
          }

          const data_multipl_val = data_multiplicity[0].value === 'true';//convert from str to bool
          const token_multipl_val = token_multiplicity[0].value === 'true';
          
          if(token_multipl_val){
            if(data_multipl_val){
              style_delta = {
                "elementStyle":{"shape":"RectangleAndThreeFilledTriangles"},
              };
            }else{
              style_delta = {
                "elementStyle":{"shape":"DeclaredRequiredMultiplePin"},
              };
            }
          }else{
            if(data_multipl_val){
              style_delta = {
                "elementStyle":{"shape":"RectangleAndThreeTriangles"},
              };
            }else{
              style_delta = {
                "elementStyle":{"shape":"ComputedDataPinSingle"},
              };
            }
          }

          // console.log("in updateElementStyle", value, element, compart_type, style_delta);
          
          return style_delta;
        },

        updateProvidedDataPinShape:function(value, element, compart_type, self) {
          
          // console.log(self);
          // console.log(this);
          // console.log("active element", self.getActiveElement() )

          const active_elem = self.getActiveElement();

          const token_multiplicity = active_elem.compartments.filter(compartment => 
            compartment.compartmentTypeId == "ProvidedDataPinMultiplicity" );
          
          const data_multiplicity = active_elem.compartments.filter(compartment => 
            compartment.compartmentTypeId == "ProvidedDataPinDataMultiplicity" );
          
          var style_delta = {};

          // console.log(token_multiplicity[0], data_multiplicity[0])
          if(!token_multiplicity[0] || !data_multiplicity[0]){
            console.log("Failed to get value of Data Multiplicity or Token multiplicity");
            return style_delta;
          }

          const data_multipl_val = data_multiplicity[0].value === 'true';//convert from str to bool
          const token_multipl_val = token_multiplicity[0].value === 'true';
          
          if(token_multipl_val){
            if(data_multipl_val){
              style_delta = {
                "elementStyle":{"shape":"ThreeFilledTrianglesAndRectangle"},
              };
            }else{
              style_delta = {
                "elementStyle":{"shape":"DeclaredProvidedMultiplePin"},
              };
            }
          }else{
            if(data_multipl_val){
              style_delta = {
                "elementStyle":{"shape":"ThreeTrianglesAndRectangle"},
              };
            }else{
              style_delta = {
                "elementStyle":{"shape":"ComputedDataPinMultiple"},
              };
            }
          }

          // console.log("in updateElementStyle", value, element, compart_type, style_delta);
          
          return style_delta;
        },
        getElementTypes: function() {
          // TODO: Values for dropdowns
          var baltic_lsc_element_types = [
          { id: "RequiredDataPin",
            type: "Box",
            name: "Required Data Pin",
            defaultSize: {width: 45, height: 35,},
            contextMenu: [{index: 1, data: "", procedure: "copy", text: "Copy"},
                          {index: 2, data: "", procedure: "delete", text: "Delete"}
                          ],
            style: {
              elementStyle: {
                fill: "none",
                opacity: 1,
                stroke: "#000000",
                strokeWidth: 1,
                //strokeLinejoin:"round",
                //shape: "Rectangle", // // Shape-DeclaredRequiredDataPin

                shape: "ComputedDataPinSingle", 
                perfectDrawEnabled: false
              },
            },

            compartmentTypes: [
              {
                "id": "RequiredDataPinName",
                "name": "Name",
                "inputType": {
                  "type": "input",
                  "inputType": "text",
                },
                "defaultValue":"RDP",
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
                  "text": "Required Data Pin",
                  "listening": false,
                  "perfectDrawEnabled": false,
                  "width": "auto",
                  "height": "auto"
                }
              },
              {
                "id": "RequiredDataPinDataType",
                "name": "Data Type",
                "inputType": {
                  "type": "input",
                  "inputType": "select",
                },
                "defaultValue": "",
                "style": {
                  "align": "center",
                  "fill": "#000000",
                  "fontFamily": "Arial",
                  "fontSize": 14,
                  "fontStyle": "bold",
                  "fontVariant": "normal",
                  "strokeWidth": 1,
                  "visible": false,
                  "y": 0,
                  "text": "",
                  "listening": false,
                  "perfectDrawEnabled": false,
                  "width": "auto",
                  "height": "auto"
                }
              },
              {
                "id": "RequiredDataPinDataStructure",
                "name": "Data Structure",
                "inputType": {
                  "type": "input",
                  "inputType": "select",
                },
                "defaultValue":"",
                "style": {
                  "align": "center",
                  "fill": "#000000",
                  "fontFamily": "Arial",
                  "fontSize": 14,
                  "fontStyle": "bold",
                  "fontVariant": "normal",
                  "strokeWidth": 1,
                  "visible": false,
                  "y": 0,
                  "text": "",
                  "listening": false,
                  "perfectDrawEnabled": false,
                  "width": "auto",
                  "height": "auto"
                }
              },
              {
                "id": "RequiredDataPinAccessType",
                "name": "Access Type",
                "inputType": {
                  "type": "input",
                  "inputType": "select",
                },
                "defaultValue":"",
                "style": {
                  "align": "center",
                  "fill": "#000000",
                  "fontFamily": "Arial",
                  "fontSize": 14,
                  "fontStyle": "bold",
                  "fontVariant": "normal",
                  "strokeWidth": 1,
                  "visible": false,
                  "y": 0,
                  "text": "",
                  "listening": false,
                  "perfectDrawEnabled": false,
                  "width": "auto",
                  "height": "auto"
                }
              },
              {
                "id": "RequiredDataPinMultiplicity",
                "name": "Multiple Tokens",
                "inputType": {
                  "type": "input",
                  "inputType": "checkbox", // true - Multiple, false - Single
                },
                "defaultValue":"false",
                "style": {
                  "align": "center",
                  "fill": "#000000",
                  "fontFamily": "Arial",
                  "fontSize": 14,
                  "fontStyle": "bold",
                  "fontVariant": "normal",
                  "strokeWidth": 1,
                  "visible": false,
                  "y": 0,
                  "text": "",
                  "listening": false,
                  "perfectDrawEnabled": false,
                  "width": "auto",
                  "height": "auto"
                },
                "styleDeltas": [
















                  //{"value": "true", "elementStyle":{"shape":"DeclaredRequiredMultiplePin"}},
                  //{"value": "false", "elementStyle":{"shape":"ComputedDataPinSingle"}}
                ],
                "extensionPoints": {
                  "dynamicElementStyleOnCompartmentUpdate": function(value, element, compart_type, self) {
                    return self.updateRDPShape(value, element, compart_type, self);
                  },
                },

              },
              {
                "id": "RequiredDataPinDataMultiplicity",
                "name": "Multiple Data",
                "inputType": {
                  "type": "input",
                  "inputType": "checkbox", // true - Multiple, false - Single
                },
                "defaultValue":"false",
                "style": {
                  "align": "center",
                  "fill": "#000000",
                  "fontFamily": "Arial",
                  "fontSize": 14,
                  "fontStyle": "bold",
                  "fontVariant": "normal",
                  "strokeWidth": 1,
                  "visible": false,
                  "y": 0,
                  "text": "",
                  "listening": false,
                  "perfectDrawEnabled": false,
                  "width": "auto",
                  "height": "auto"
                },
                "styleDeltas": [
                  //{"value": "true", "elementStyle":{"shape":"RectangleAndThreeTriangles"}},
                  //{"value": "false", "elementStyle":{"shape":"ComputedDataPinSingle"}}
                ],
                "extensionPoints": {
                  "dynamicElementStyleOnCompartmentUpdate": function(value, element, compart_type, self) {
                      return self.updateRDPShape(value, element, compart_type, self);
                  },
                },
              },
              {
                "id": "RequiredDataPinMandatory",
                "name": "Mandatory",
                "inputType": {
                  "type": "input",
                  "inputType": "checkbox",
                },
                "defaultValue":"true",
                "style": {
                  "align": "center",
                  "fill": "#000000",
                  "fontFamily": "Arial",
                  "fontSize": 14,
                  "fontStyle": "bold",
                  "fontVariant": "normal",
                  "strokeWidth": 1,
                  "visible": false,
                  "y": 0,
                  "text": "",
                  "listening": false,
                  "perfectDrawEnabled": false,
                  "width": "auto",
                  "height": "auto"
                }
              },
            ],
          },
          { id: "DataFlow",
            type: "Line",
            name: "Data Flow",
            contextMenu: [{index: 1, data: "", procedure: "delete", text: "Delete"},
                          // {index: 2, data: "", procedure: "reroute", text: "Reroute"},
                        ],
            compartmentTypes: [],

            constraints: [{startTypeId:"RequiredDataPin", endTypeId:"RequiredComputedPin", startCardinality:1, endCardinality:100},
                          {startTypeId:"ProvidedComputedPin", endTypeId:"RequiredComputedPin", startCardinality:1, endCardinality:100},
                          {startTypeId:"ProvidedComputedPin", endTypeId:"ProvidedDataPin", startCardinality:1, endCardinality:100},
                          {startTypeId:"RequiredDataPin", endTypeId:"ProvidedDataPin", startCardinality:1, endCardinality:100}
                        ],
            customConstraints: undefined,
            startCardinality: 1,
            endCardinality: 100,

            style: {
              elementStyle: {
                //opacity: 1,
                // shadowBlur: 0,
                // shadowColor: "red",
                // shadowOffsetX: 0,
                // shadowOffsetY: 0,
                // shadowOpacity: 1,
                stroke: "rgb(0,0,0)",
                strokeWidth: 1,
                "perfectDrawEnabled": false,
                // tension: 0,
              },
              endShapeStyle: {
                fill: "rgb(255,255,255)",
                // fillPriority: "color",
                // opacity: 1,
                radius: 1,
                 "width":10,
                 "height":10,

                // shadowBlur: 0,
                // shadowColor: "red",
                // shadowOffsetX: 0,
                // shadowOffsetY: 0,
                // shadowOpacity: 1,
                shape: "Arrow",
                stroke: "rgb(0,0,0)",
                strokeWidth: 1,
                // tension: 0,
                "perfectDrawEnabled":false,
                "listening":false,
              },

              startShapeStyle: {
                // dash: Array[0],
                fill: "rgb(0,0,0)",
                // fillPriority: "color",
                // opacity: 1,
                radius: 1,
                 "width":1,
                 "height":1,

                // shadowBlur: 0,
                // shadowColor: "red",
                // shadowOffsetX: 0,
                // shadowOffsetY: 0,
                // shadowOpacity: 1,
                shape: "None",
                stroke: "rgb(0,0,0)",
                strokeWidth: 1,
                // tension: 0,
                "perfectDrawEnabled":false,
                "listening":false,
              },
            lineType: "Orthogonal",
            },
          },
          { id: "ProvidedDataPin",
            type: "Box",
            name: "Provided Data Pin",
            defaultSize: {width: 45, height: 35,},
            contextMenu: [{index: 1, data: "", procedure: "copy", text: "Copy"},
                          {index: 2, data: "", procedure: "delete", text: "Delete"}
                          ],
            style: {
              elementStyle: {
                fill: "#000000",
                opacity: 1,
                stroke: "#000000",
                strokeWidth: 1,
                //shape: "Rectangle", // Shape-DeclaredProvidedDataPin
                shape: "ComputedDataPinMultiple", // Shape-DeclaredProvidedDataPin
                //shape:"DeclaredProvidedMultiplePin",
                perfectDrawEnabled: false
              },
            },

            compartmentTypes: [
              {
                "id": "ProvidedDataPinName",
                "name": "Name",
                "inputType": {
                  "type": "input",
                  "inputType": "text",
                },
                "defaultValue":"PDP",
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
                  "text": "Provided Data Pin",
                  "listening": false,
                  "perfectDrawEnabled": false,
                  "width": "auto",
                  "height": "auto"
                }
              },
              {
                "id": "ProvidedDataPinDataType",
                "name": "Data Type",
                "inputType": {
                  "type": "input",
                  "inputType": "select",
                },
                "defaultValue":"",
                "style": {
                  "align": "center",
                  "fill": "#000000",
                  "fontFamily": "Arial",
                  "fontSize": 14,
                  "fontStyle": "bold",
                  "fontVariant": "normal",
                  "strokeWidth": 1,
                  "visible": false,
                  "y": 0,
                  "text": "",
                  "listening": false,
                  "perfectDrawEnabled": false,
                  "width": "auto",
                  "height": "auto"
                }
              },
              {
                "id": "ProvidedDataPinDataStructure",
                "name": "Data Structure",
                "inputType": {
                  "type": "input",
                  "inputType": "select",
                },
                "defaultValue":"",
                "style": {
                  "align": "center",
                  "fill": "#000000",
                  "fontFamily": "Arial",
                  "fontSize": 14,
                  "fontStyle": "bold",
                  "fontVariant": "normal",
                  "strokeWidth": 1,
                  "visible": false,
                  "y": 0,
                  "text": "",
                  "listening": false,
                  "perfectDrawEnabled": false,
                  "width": "auto",
                  "height": "auto"
                }
              },
              {
                "id": "ProvidedDataPinAccessType",
                "name": "Access Type",
                "inputType": {
                  "type": "input",
                  "inputType": "select",
                },
                "defaultValue":"",
                "style": {
                  "align": "center",
                  "fill": "#000000",
                  "fontFamily": "Arial",
                  "fontSize": 14,
                  "fontStyle": "bold",
                  "fontVariant": "normal",
                  "strokeWidth": 1,
                  "visible": false,
                  "y": 0,
                  "text": "",
                  "listening": false,
                  "perfectDrawEnabled": false,
                  "width": "auto",
                  "height": "auto"
                }
              },
              {
                "id": "ProvidedDataPinMultiplicity",
                "name": "Multiple Tokens",
                "inputType": {
                  "type": "input",
                  "inputType": "checkbox", // true - Multiple, false - Single
                },
                "defaultValue":"false",
                "style": {
                  "align": "center",
                  "fill": "#000000",
                  "fontFamily": "Arial",
                  "fontSize": 14,
                  "fontStyle": "bold",
                  "fontVariant": "normal",
                  "strokeWidth": 1,
                  "visible": false,
                  "y": 0,
                  "text": "",
                  "listening": false,
                  "perfectDrawEnabled": false,
                  "width": "auto",
                  "height": "auto"
                },
                "styleDeltas": [
                  // {"value": "true", "elementStyle":{"shape":"DeclaredProvidedMultiplePin"}},
                  // {"value": "false", "elementStyle":{"shape":"ComputedDataPinMultiple"}}
                ],
                "extensionPoints": {
                  "dynamicElementStyleOnCompartmentUpdate": function(value, element, compart_type, self) {
                    return self.updateProvidedDataPinShape(value, element, compart_type, self);
                  },
                },
              },
              {
                "id": "ProvidedDataPinDataMultiplicity",
                "name": "Multiple Data",
                "inputType": {
                  "type": "input",
                  "inputType": "checkbox", // true - Multiple, false - Single
                },
                "defaultValue":"false",
                "style": {
                  "align": "center",
                  "fill": "#000000",
                  "fontFamily": "Arial",
                  "fontSize": 14,
                  "fontStyle": "bold",
                  "fontVariant": "normal",
                  "strokeWidth": 1,
                  "visible": false,
                  "y": 0,
                  "text": "",
                  "listening": false,
                  "perfectDrawEnabled": false,
                  "width": "auto",
                  "height": "auto"
                },
                "styleDeltas": [
                  // {"value": "true", "elementStyle":{"shape":"ThreeTrianglesAndRectangle"}},
                  // {"value": "false", "elementStyle":{"shape":"ComputedDataPinMultiple"}}
                ],
                "extensionPoints": {
                  "dynamicElementStyleOnCompartmentUpdate": function(value, element, compart_type, self) {
                    return self.updateProvidedDataPinShape(value, element, compart_type, self);
                  },
                },
              }
              ,
              {
                "id": "ProvidedDataPinMandatory",
                "name": "Mandatory",
                "inputType": {
                  "type": "input",
                  "inputType": "checkbox",
                },
                "defaultValue":"true",
                "style": {
                  "align": "center",
                  "fill": "#000000",
                  "fontFamily": "Arial",
                  "fontSize": 14,
                  "fontStyle": "bold",
                  "fontVariant": "normal",
                  "strokeWidth": 1,
                  "visible": false,
                  "y": 0,
                  "text": "",
                  "listening": false,
                  "perfectDrawEnabled": false,
                  "width": "auto",
                  "height": "auto"
                }
              },
            ],
          },
          { id: "RequiredComputedPin",
            type: "Port",
            name: "Required Pin",
            defaultSize: {width: 20, height: 20,},
            contextMenu: [
                          // {index: 1, data: "", procedure: "copy", text: "Copy"},
                          //{index: 2, data: "", procedure: "delete", text: "Delete"}
                          ],
            style: {
              elementStyle: {
                fill: "none",
                opacity: 1,
                stroke: "#000000",
                strokeWidth: 1,
                //strokeLinejoin:"round",
                //shape: "Rectangle", // // Shape-DeclaredRequiredDataPin

                shape: "PortIn", 
                perfectDrawEnabled: false
              },

              secondStyle: {
                //fill: "black",
                opacity: 1,
                stroke: "#000000",
                strokeWidth: 1,
                //strokeLinejoin:"round",
                // shape: "Rectangle", // // Shape-DeclaredRequiredDataPin

                shape: "PortOut", 

                perfectDrawEnabled: false
              },

            },

            compartmentTypes: [
              {
                "id": "RequiredPortName",
                "name": "Name",
                "inputType": {
                  "type": "input",
                  "inputType": "text",
                },

                "defaultValue":"Port",
                "style": {
                  "align": "right",
                  "fill": "#000000",
                  "fontFamily": "Arial",
                  "fontSize": 14,
                  "fontStyle": "bold",
                  "fontVariant": "normal",
                  "strokeWidth": 1,
                  "visible": true,
                  "y": 0,
                  "text": "Required Data Pin",
                  "listening": false,
                  "perfectDrawEnabled": false,
                  "width": "auto",
                  "height": "auto"
                }
              },
              {
                "id": "RequiredPortGroupName",
                "name": "Group",
                "inputType": {
                  "type": "input",
                  "inputType": "text",
                },

                "defaultValue":"",
                "style": {
                  "align": "center",
                  "fill": "#000000",
                  "fontFamily": "Arial",
                  "fontSize": 14,
                  "fontStyle": "bold",
                  "fontVariant": "normal",
                  "strokeWidth": 1,
                  "visible": false,
                  "y": 0,
                  "text": "Port Group Name",
                  "listening": false,
                  "perfectDrawEnabled": false,
                  "width": "auto",
                  "height": "auto"
                }
              },
              {
                "id": "RequiredPortGroupDepths",
                "name": "Group Depths",
                "inputType": {
                  "type": "input",
                  "inputType": "text",
                },

                "defaultValue":"",
                "style": {
                  "align": "center",
                  "fill": "#000000",
                  "fontFamily": "Arial",
                  "fontSize": 14,
                  "fontStyle": "bold",
                  "fontVariant": "normal",
                  "strokeWidth": 1,
                  "visible": false,
                  "y": 0,
                  "text": "Port Group Depths",
                  "listening": false,
                  "perfectDrawEnabled": false,
                  "width": "auto",
                  "height": "auto"
                }
              },
              {
                "id": "RequiredPortAccessType",
                "name": "Access Type",
                "inputType": {
                  "type": "input",
                  "inputType": "none",
                },

                "defaultValue":"",
                "style": {
                  "align": "center",
                  "fill": "#000000",
                  "fontFamily": "Arial",
                  "fontSize": 14,
                  "fontStyle": "bold",
                  "fontVariant": "normal",
                  "strokeWidth": 1,
                  "visible": false,
                  "y": 0,
                  "text": "Access Type",
                  "listening": false,
                  "perfectDrawEnabled": false,
                  "width": "auto",
                  "height": "auto"
                }
              },
              {
                "id": "RequiredPortDataType",
                "name": "Data Type",
                "inputType": {
                  "type": "input",
                  "inputType": "none",
                },

                "defaultValue":"",
                "style": {
                  "align": "center",
                  "fill": "#000000",
                  "fontFamily": "Arial",
                  "fontSize": 14,
                  "fontStyle": "bold",
                  "fontVariant": "normal",
                  "strokeWidth": 1,
                  "visible": false,
                  "y": 0,
                  "text": "Data Type",
                  "listening": false,
                  "perfectDrawEnabled": false,
                  "width": "auto",
                  "height": "auto"
                }
              },
            ]
          },
          { id: "ProvidedComputedPin",
            type: "Port",
            name: "Provided Pin",
            defaultSize: {width: 20, height: 20,},
            contextMenu: [
                          // {index: 1, data: "", procedure: "copy", text: "Copy"},
                          //{index: 2, data: "", procedure: "delete", text: "Delete"}
                          ],
            style: {
              elementStyle: {
                fill: "none",
                opacity: 1,
                stroke: "#000000",
                strokeWidth: 1,
                //strokeLinejoin:"round",
                //shape: "Rectangle", // // Shape-DeclaredRequiredDataPin

                shape: "PortIn", 
                perfectDrawEnabled: false
              },

              secondStyle: {
                fill: "none",
                opacity: 1,
                stroke: "#000000",
                strokeWidth: 1,
                //strokeLinejoin:"round",
                // shape: "Rectangle", // // Shape-DeclaredRequiredDataPin

                shape: "PortOut", 

                perfectDrawEnabled: false
              },

            },

            compartmentTypes: [
              {
                "id": "ProvidedPortName",
                "name": "Name",
                "inputType": {
                  "type": "input",
                  "inputType": "text",
                },

                "defaultValue":"Port",
                "style": {
                  "align": "left",
                  "fill": "#000000",
                  "fontFamily": "Arial",
                  "fontSize": 14,
                  "fontStyle": "bold",
                  "fontVariant": "normal",
                  "strokeWidth": 1,
                  "visible": true,
                  "y": 0,
                  "text": "Required Data Pin",
                  "listening": false,
                  "perfectDrawEnabled": false,
                  "width": "auto",
                  "height": "auto"
                }
              },
              {
                "id": "ProvidedPortGroupName",
                "name": "Group",
                "inputType": {
                  "type": "input",
                  "inputType": "text",
                },

                "defaultValue":"",
                "style": {
                  "align": "center",
                  "fill": "#000000",
                  "fontFamily": "Arial",
                  "fontSize": 14,
                  "fontStyle": "bold",
                  "fontVariant": "normal",
                  "strokeWidth": 1,
                  "visible": false,
                  "y": 0,
                  "text": "Port Group Name",
                  "listening": false,
                  "perfectDrawEnabled": false,
                  "width": "auto",
                  "height": "auto"
                }
              },
              {
                "id": "ProvidedPortGroupDepths",
                "name": "Group Depths",
                "inputType": {
                  "type": "input",
                  "inputType": "text",
                },

                "defaultValue":"",
                "style": {
                  "align": "center",
                  "fill": "#000000",
                  "fontFamily": "Arial",
                  "fontSize": 14,
                  "fontStyle": "bold",
                  "fontVariant": "normal",
                  "strokeWidth": 1,
                  "visible": false,
                  "y": 0,
                  "text": "Port Group Depths",
                  "listening": false,
                  "perfectDrawEnabled": false,
                  "width": "auto",
                  "height": "auto"
                }
              },
              {
                "id": "ProvidedPortAccessType",
                "name": "Access Type",
                "inputType": {
                  "type": "input",
                  "inputType": "none",
                },

                "defaultValue":"",
                "style": {
                  "align": "center",
                  "fill": "#000000",
                  "fontFamily": "Arial",
                  "fontSize": 14,
                  "fontStyle": "bold",
                  "fontVariant": "normal",
                  "strokeWidth": 1,
                  "visible": false,
                  "y": 0,
                  "text": "Access Type",
                  "listening": false,
                  "perfectDrawEnabled": false,
                  "width": "auto",
                  "height": "auto"
                }
              },
              {
                "id": "ProvidedPortDataType",
                "name": "Data Type",
                "inputType": {
                  "type": "input",
                  "inputType": "none",
                },

                "defaultValue":"",
                "style": {
                  "align": "center",
                  "fill": "#000000",
                  "fontFamily": "Arial",
                  "fontSize": 14,
                  "fontStyle": "bold",
                  "fontVariant": "normal",
                  "strokeWidth": 1,
                  "visible": false,
                  "y": 0,
                  "text": "Data Type",
                  "listening": false,
                  "perfectDrawEnabled": false,
                  "width": "auto",
                  "height": "auto"
                }
              },
            ]
          }
          ];

          return baltic_lsc_element_types;
        },
        
        getListOfDropDownValues: function(name) {
          if(name === "Data Type") {
            //return ["any_data", "any_picture", "MPEG4"];
            return this.dataTypes;
          }
          else if(name === "Access Type"){
            //return ["any_access", "file"];
            return this.accessTypes;
          }else if(name === "Data Structure"){
            //return [ {name:"DS 1"}, {name:"DS 2"}];
            return this.dataStructures;
          }
          return [];
        },

        generateCALMMInstance: function() {
          // console.log("generate CAL MM instance")
          //sanemt diagammu no /editor/diagram/:id
          var self = this;
          
          var backend = this.SERVER_URL();
          var app_id = this.$route.params['applicationId'];

          blsc_axios.get(backend + "editor/diagram/" + app_id)
                .then(response => {
                  if (self.noErrorsInResponse(response)) {
                    const responseProcessed = self.processResponse(response);
                    let diagramm_data = {
                      name:responseProcessed.data.name,
                      id:responseProcessed.data.id,
                      boxes: responseProcessed.data.boxes, 
                      lines: responseProcessed.data.lines, 
                      ports: responseProcessed.data.ports,
                    };
                    
                    //from_module()
                    generateCALMMInstance1(diagramm_data)
                  }

                });
        },

        // eslint-disable-next-line no-unused-vars
        exportDiagram: function(ev) {
            var data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.data));
            var link = document.createElement('a');
            link.setAttribute("href", data);
            link.setAttribute("download", this.applicationId + ".json");
            document.body.appendChild(link); // required for firefox
            link.click();
            link.remove();
        },

        // eslint-disable-next-line no-unused-vars
        importDiagram: function(ev) {
            document.getElementById("import-file").click();
        },

        importFileUploaded: function(ev) {
            var reader = new FileReader();
            reader.onload = this.onReaderLoad;
            reader.readAsText(ev.target.files[0]);
        },

        onReaderLoad: function(ev) {
            var self = this;

            var obj = JSON.parse(ev.target.result);

            var boxes = _.map(obj.boxes, function(box, i) {// eslint-disable-line no-unused-vars
                            var new_compartments = self.addMissingCompartments(box, box.compartments);
                            box = _.extend(box, {type: 0,
                                                  id: undefined,
                                                  diagramId: self.applicationId,
                                                  compartments: self.removeCompartmentsId(new_compartments),
                                                });
                            return box;
                        });

            var id_map = {};

            blsc_axios.post(this.SERVER_URL() + "editor/element", boxes)
                  .then(response => {
                      _.each(self.processResponse(response).data.boxesId, function(box_id, i) {
                          id_map[boxes[i]._id] = box_id;
                      });
                      
                      var ports = _.map(obj.ports, function(port, i) {// eslint-disable-line no-unused-vars
                                      var new_compartments = self.addMissingCompartments(port, port.compartments);
                                      port = _.extend(port, {type: 2,
                                                              id: undefined,
                                                              compartments: self.removeCompartmentsId(new_compartments),
                                                              diagramId: self.applicationId,
                                                              parentId: id_map[port.parentId],
                                                            });
                                      return port;
                                  });

                                  blsc_axios.post(this.SERVER_URL() + "editor/element", ports)
                            .then(response => {
                                _.each(self.processResponse(response).data.portsId, function(port_id, i) {
                                    id_map[ports[i]._id] = port_id;
                                });

                                var lines = _.map(obj.lines, function(line, i) {// eslint-disable-line no-unused-vars
                                                var new_compartments = self.addMissingCompartments(line, line.compartments);
                                                line = _.extend(line, {type: 1,
                                                                        id: undefined,
                                                                        compartments: self.removeCompartmentsId(new_compartments),
                                                                        diagramId: self.applicationId,
                                                                        startElement: id_map[line.startElement],
                                                                        endElement: id_map[line.endElement],
                                                                      });
                                                return line;
                                            });

                                            blsc_axios.post(this.SERVER_URL() + "editor/element", lines)
                                      .then(response => {// eslint-disable-line no-unused-vars

                                        blsc_axios.get(this.SERVER_URL() + "editor/diagram/" + self.applicationId)
                                              .then(response => {
                                                  this.init(self.applicationId, response);
                                              });
                                      });
                          });
                  });
        },

        removeCompartmentsId: function(compartments) {
            return _.map(compartments, function(compartment, i) {// eslint-disable-line no-unused-vars
                    _.extend(compartment, {id: undefined,});
                    return compartment;
                  });
        },

        replaceCompartmentsId: function(compartments) {
            return _.map(compartments, function(compartment, i) {// eslint-disable-line no-unused-vars
                    _.extend(compartment, {id: compartment._id,});
                    return compartment;
                  });
        },


        isDisabled: function() {
            return this.isReadOnly;
        },

        getDefaultElementType: function() { return {
          id: "DefaultCall",
          callable_unit_uid: null,
          type: "Box",
          name: "DefaultCall",
          defaultSize: {width: 125, height: 125},
          contextMenu: [{index: 1, data: "", procedure: "copy", text: "Copy"},
                    {index: 2, data: "", procedure: "delete", text: "Delete"}
                    ],
          style: {
            elementStyle: {
              fill: "#FFFFFF",
              opacity: 1,
              stroke: "#000000",
              strokeWidth: 1,
              shape: "RoundRectangle",
              perfectDrawEnabled: false,
              dash: [10,0],
              imageSrc: "https://www.balticlsc.eu/model/_icons/default.png",
            }
          },
          compartmentTypes: [
            {
              "id": "CallName",
              "name": "Unit Call Name",
              "inputType": {
                "type": "input",
                "inputType": "text",
              },
              "defaultValue":"Default Call Name",
              "underline": true,
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
                "text": "Default Call Name",
                "listening": false,
                "perfectDrawEnabled": false,
                "width": "auto",
                "height": "auto"
              }
            },
            {
              "id": "CallCUName",
              "name": "Computation Unit Name",
              "inputType": {
                "type": "input",
                "inputType": "none",
              },
              "defaultValue":"Default Call CU Name",
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
                "text": "Default Call CU Name",
                "listening": false,
                "perfectDrawEnabled": false,
                "width": "auto",
                "height": "auto"
              }
            },
            {
              "id": "CallBinding",
              "name": "Binding",
              "inputType": {
                "type": "input",
                "inputType": "checkbox", // true - Strong, false - Weak
              },
              "defaultValue":"true",
              "style": {
                "align": "center",
                "fill": "#000000",
                "fontFamily": "Arial",
                "fontSize": 14,
                "fontStyle": "bold",
                "fontVariant": "normal",
                "strokeWidth": 1,
                "visible": false,
                "y": 0,
                "text": "",
                "listening": false,
                "perfectDrawEnabled": false,
                "width": "auto",
                "height": "auto"
              },
              "styleDeltas": [
                {"value": "true", "elementStyle":{"dash":[10,0]}},
                {"value": "false", "elementStyle":{"dash":[10,10]}}
              ]  
            },
          ],
        }}

    },

}

