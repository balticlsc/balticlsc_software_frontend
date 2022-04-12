import { _ } from 'vue-underscore';

import { copy, paste, deleteCollection, reroute } from './CopyPasteDelete';

//Context menu
var ContextMenu = function(e, context, menu, params) {
	this.params = params || [];
	this.menu = menu;
	this.context = context;

	this.createMenu(e, menu);
}

ContextMenu.prototype = {

	createMenu: function(e, menu) {
		this.showAjooMenu(e, {menu: menu});
	},

	selectMenuItem: function(e, context) {
		var proc_name = $(e.target).closest(".context-menu-item-li").find(".context-menu-item").attr("procedure");

		var function_map = {copy: copy,
			                  paste: paste,
			                  delete: deleteCollection,
			                  reroute: reroute,
			                };

		if (!function_map[proc_name]) {
			this.hide();
			console.error("No function for context menu", proc_name);
			return;
		}

		function_map[proc_name](e, context);
		this.hide(context);
	},

	hide: function(context) {
		context.style = "display:none; position:absolute; left: 0px; top: 0px;";
		context.contextMenu = undefined;
	},

	showAjooMenu: function(e, obj) {
		var editor = this.context.editor;
		if (obj) {
	    
	    	var mouse_state_obj = editor.getMouseStateObject();
			var pos = mouse_state_obj.getPageMousePosition(e);

			var x = pos["x"];
			var y = pos["y"]

			obj["display"] = "block";
			obj["x"] = x;
			obj["y"] = y;

			obj["left"] = x + "px";
			obj["top"] = y + "px";

			var style = "display:" + obj.display + "; position:absolute; left:" + obj.left + "; top:" + obj.top + ";";
			_.extend(this.context, {x: obj.x, y: obj.y, style: style, menu: this.menu});

			editor.data.ev = e;			
		}
	},

}

export default ContextMenu
