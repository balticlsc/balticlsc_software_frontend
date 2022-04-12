import { _ } from 'vue-underscore';
import {NewOrthogonalLine} from './Elements/Lines/draw_new_line';
import axios from '../utils/axios'


function copy(e, context) {
	var editor = context.editor;

	var selected_elements = editor.getSelectedElements();

	var left_point = {x: Infinity, y: Infinity};
	_.each(selected_elements, function(elem) {

		if (elem["type"] == "Box") {
			var size = elem.getSize();
			var x = size.x;
			var y = size.y;

			if (x < left_point["x"] && y < left_point["y"]) {
				left_point["x"] = x;
				left_point["y"] = y;
			}
		}
	});

	var drag_layer = editor.getLayer("DragLayer");
	var drag_group = editor.findChild(drag_layer, "DragGroup");
	left_point["x"] = left_point["x"] + drag_group.x();
	left_point["y"] = left_point["y"] + drag_group.y();

	var selected_elem_list = _.keys(selected_elements);

	var clipboard = {elements: selected_elem_list,
					 leftPoint: left_point,
					 count: 1,
					};

	editor.clipboard = clipboard;
}

function paste(e, context) {
	var editor = context.editor;
	editor.selection.clearSelection();

	var clipboard = editor.clipboard;
	if (!clipboard) {
		console.error("No clipboard ", editor);
		return;
	}

	var e;
	if (editor.data.ev) {
		e = editor.data.ev;
	}

	var x, y;
	if (e) {
		var mouse_state_obj = editor.getMouseStateObject();
		var mouse_pos = mouse_state_obj.getMousePosition(e);
		x = mouse_pos["x"];
		y = mouse_pos["y"];
	}

	var new_ids = {};

	var offset_x, offset_y;
	if (x && y) {
		var left_most = clipboard["leftPoint"];

		offset_x = x - (left_most["x"] || 0);
		offset_y = y - (left_most["y"] || 0);
	}

	else {
		var count = clipboard["count"];
		var offset = count * 10;
		offset_x = offset;
		offset_y = offset;
	}

	var element_ids = clipboard["elements"];
	var elements = _.filter(editor.elements.elementList, function(elem) {
						return element_ids.includes(elem._id); 
					});

	var old_new_id_list = {};

	//iterates over boxes
	var boxes = [];
	var copied_boxes = [];
	_.each(elements, function(element) {
		var box_out = _.find(context.data.boxes, function(box) {
							return box._id == element._id;
						});
		if (box_out) {
			copied_boxes.push({source: box_out, representation: element});
		}
	});


	_.each(copied_boxes, function(obj) {
		var source = obj.source;
		var element = obj.representation;

		var box = {_id: _.uniqueId(["box_"]),
					type: "Box",
					elementTypeId: source.elementTypeId,
					location: {
								x: source.location.x + offset_x,
								y: source.location.y + offset_y,
								height: source.location.height,
								width: source.location.width,
					        },
					style: source.style,
					compartments: source.compartments,
				};

		boxes.push(box);

		old_new_id_list[element._id] = box._id;
	});

	//iterates over lines
	var lines = [];

	var copied_lines = [];
	_.each(elements, function(element) {
		var line_out = _.find(context.data.lines, function(line) {
							return line._id == element._id;
						});

		if (line_out) {
			copied_lines.push({source: line_out, representation: element});		
		}

	});

	_.each(copied_lines, function(obj) {

		var source = obj.source;
		var element = obj.representation;

		//sets a new start element id for line
		var start_elem_id = source["startElement"];
		var new_start_elem_id = old_new_id_list[start_elem_id];

		//sets a new end element id for line
		var end_elem_id = source["endElement"];
		var new_end_elem_id = old_new_id_list[end_elem_id];

		if (new_start_elem_id && new_end_elem_id) {

			var points = source.points;
			var new_points = _.map(points, function(point, i) {
									if (i % 2 == 0) {
										return point + offset_x;
									}
									else {
										return point + offset_y;
									}
								});

			var line = {_id: _.uniqueId(["link_"]),
						type: "Line",
						elementTypeId: source.elementTypeId,
						startElement: new_start_elem_id,
						endElement: new_end_elem_id,
				        points: new_points,
						style: source.style,
						compartments: source.compartments,
					};

			lines.push(line);
		}
	});

	editor.addElements({boxes: boxes, lines: lines,});

	if (!x && !y) {
		editor.clipboard.count++;
	}

	editor.data = {};
}

function deleteCollection(e, context) {
	var editor = context.editor;

	var box_ids = [];
	var line_ids = [];
	var port_ids = [];

	var elements = editor.getSelectedElements();
	_.each(elements, function(elem) {

		if (elem.type.toLowerCase() == "box") {
			box_ids.push(elem._id);
		}
		else {
			if (elem.type.toLowerCase() == "line") {
				line_ids = _.union(line_ids, [elem._id]);
			}

			else if (elem.type.toLowerCase() == "port") {
				port_ids.push(elem._id);
			}

			else {
				console.error("No element type", elem.type);
			}
		}

		_.each(elem.inLines, function(line) {
			line_ids = _.union(line_ids, [line._id]);
		});

		_.each(elem.outLines, function(line) {
			line_ids = _.union(line_ids, [line._id]);
		});

	});


	// removing ports that are linked to boxes that are deleted
	_.each(box_ids, function(box_id) {
		var ports = _.filter(context.data.ports, function(tmp_port) {
						return tmp_port.parentId == box_id;
					});

		var box_ports_ids = _.map(ports, function(tmp_port) {
							return tmp_port._id;
						});

		port_ids = _.union(port_ids, box_ports_ids);
	});


	// collecting linked lines to ports
	var element_list = editor.getElements();
	_.each(port_ids, function(port_id) {
		var elem = element_list[port_id];

		_.each(elem.inLines, function(line) {
			line_ids = _.union(line_ids, [line._id]);
		});

		_.each(elem.outLines, function(line) {
			line_ids = _.union(line_ids, [line._id]);
		});

	});

	var backend = context.SERVER_URL();
	_.each(box_ids, function(elem_id) {
        axios.delete(backend + "editor/box/" + elem_id);
	});

	_.each(port_ids, function(elem_id) {
        axios.delete(backend + "editor/port/" + elem_id);
	});

	_.each(line_ids, function(elem_id) {
        axios.delete(backend + "editor/line/" + elem_id);
	});

	editor.removeElements(_.union(box_ids, port_ids, line_ids), true);
}

function reroute(e, context) {
	var editor = context.editor;

	var elements = editor.getSelectedElements();
	if (_.size(elements) == 1) {
		var elem_list = editor.getElements();

		var keys = _.keys(elements);
		var link_id = keys[0];
		var link = elem_list[link_id];

		var start_elem_id = link.startElementId;
		var end_elem_id = link.endElementId;

		var start_elem = elem_list[start_elem_id];
		var end_elem = elem_list[end_elem_id];

		// var points = link.getPoints();
		// var last = _.size(points);
		// var points_in = [points[0], points[1], points[last-2], points[last-1],];

		var start_size = start_elem.getSize();
		var end_size = end_elem.getSize();

		var points_in = [start_size.x + Math.round(start_size.width / 2),
						 start_size.y + Math.round(start_size.height / 2),
						 end_size.x + Math.round(end_size.width / 2),
						 end_size.y + Math.round(end_size.height / 2),
						];

		var recomputed_points = new NewOrthogonalLine(points_in, start_elem, end_elem);
		if (_.isArray(recomputed_points)) {
			link.rerouteLine(recomputed_points, {index: 2,});
			editor.getLayer("DragLayer").batchDraw();

			var body = {lines: [{id: link._id, delta: {points: link.getPoints(),},}]};

			// saving line points
			var backend = context.SERVER_URL();
			axios.put(backend + "editor/element", body)
			    .then(response => {
			        if (response.status != 200) {
			          console.error("Error", response);
			        }
			    });

		}
		else {
			console.error("Error in recompute points", recomputed_points);
		}

	}

}


export {copy, paste, deleteCollection, reroute}