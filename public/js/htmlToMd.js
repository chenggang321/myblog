(function () {
	var editor = new Editor();
	editor.render();
	var form = $("#main_form").on('submit', function (e) {
		e.preventDefault();
		var textarea = $("#code");
		var html = textarea.val();
		var text = new reMarked().render(html);
		editor.value(text);
	});
})();