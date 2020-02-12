(function() {
	function makeCopyName(fn) {
		return new Electron_MenuItem({
			id: "copy-name",
			label: "Copy name",
			click: fn
		});
	}
	function makeCopyPath(fn) {
		return new Electron_MenuItem({
			id: "copy-path",
			label: "Copy path",
			click: fn
		});
	}
	function insertAtMenuItem(menu, refID, items, after) {
		var insertAt = 0;
		while (insertAt < menu.items.length) {
			var check = menu.items[insertAt++];
			if (check.id == refID) {
				if (!after) insertAt--;
				break;
			}
		}
		for (var i = 0; i < items.length; i++) {
			menu.insert(insertAt++, items[i]);
		}
	}
	function initTree(isDir) {
		var targetEl;
		var TreeView = $gmedit["ui.treeview.TreeView"];
		var copyName = makeCopyName(function() {
			var text = targetEl.getAttribute(isDir ? TreeView.attrLabel : TreeView.attrIdent);
			navigator.clipboard.writeText(text);
		});
		var copyPath = makeCopyPath(function() {
			var text = isDir
				? $gmedit["gml.Project"].current.fullPath(targetEl.getAttribute(TreeView.attrRel))
				: targetEl.getAttribute(TreeView.attrPath);
			navigator.clipboard.writeText(text);
		});
		var TreeViewMenus = $gmedit["ui.treeview.TreeViewMenus"];
		var menu = (isDir ? TreeViewMenus.dirMenu : TreeViewMenus.itemMenu);
		var refID = (isDir ? "show-in-directory" : "find-references");
		insertAtMenuItem(menu, refID, [copyName, copyPath], isDir);
		if (isDir) {
			TreeView.on("dirMenu", function(e) {
				targetEl = e.element;
				copyPath.enabled = targetEl.getAttribute(TreeView.attrFilter) == "file";
			});
		} else {
			TreeView.on("itemMenu", function(e) {
				targetEl = e.element;
				copyPath.enabled = targetEl.hasAttribute("data-full-path");
			});
		}
	}
	function initTabs() {
		var targetFile;
		var copyName = makeCopyName(function() {
			navigator.clipboard.writeText(targetFile.name);
		});
		var copyPath = makeCopyPath(function() {
			navigator.clipboard.writeText(targetFile.path);
		});
		var copySep = new Electron_MenuItem({
			id: "copy-sep",
			type: "separator",
		});
		var menu = $gmedit["ui.ChromeTabMenu"].menu;
		insertAtMenuItem(menu, "find-references", [copyName, copyPath]);
	}
	GMEdit.register("copy-path", {
		init: function(state) {
			initTree(false);
			initTree(true);
			initTabs();
		},
		cleanup: function() {}
	});
})();