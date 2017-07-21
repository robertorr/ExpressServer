/**
 * Created by orrro on 7/5/2017.
 */

var organizeByTag = function (todoObjects) {
    "use strict";

    // loop over all tasks and create list of tags
    var tags = [];
    todoObjects.forEach(function (todoObj) {
        todoObj.tags.forEach(function (tag) {
            if (tags.indexOf(tag) === -1) {
                tags.push(tag);
            }
        });
    });

    return tags.map(function (tag) {
        var taggedTodos = [];
        todoObjects.forEach(function (todoObj) {
            if (todoObj.tags.indexOf(tag) !== -1) {
                taggedTodos.push(todoObj.description);
            }
        });
        return {"name": tag, "todos": taggedTodos};
    });
};

var main = function (todoObjs) {
    "use strict";

    const mainSelector = "main .content";
    const inputSelector = mainSelector + " input";
    const buttonSelector = mainSelector + " button";
    const tabsSelector = ".tabs a span";

    var todos = [];
    var updateTodos = function (todoObjects) {
        todos = todoObjects.map(function (todo) {
            return todo.description;
        });
    };
    var addNewTodo = function () {
        var description = $(inputSelector + ".description").val();
        if (description !== "") {
            var tags = $(inputSelector + ".tags").val().split(",");
            todoObjs.push({"description": description, "tags": tags});
            updateTodos(todoObjs);
            $(inputSelector).val("");
        }
    };

    updateTodos(todoObjs);
    $(tabsSelector).toArray().forEach(function (element) {
        $(element).on("click", function () {

            var jqContent = null;
            var jqElement = $(element);
            $(tabsSelector).removeClass("active");
            jqElement.addClass("active");
            $(mainSelector).empty();

            if (jqElement.parent().is(":nth-child(1)")) {
                jqContent = $("<ul>");
                var index = todos.length - 1;
                while (index >= 0) {
                    jqContent.append($("<li>").text(todos[index]));
                    index -= 1;
                }
                $(mainSelector).append(jqContent);
            } else if (jqElement.parent().is(":nth-child(2)")) {
                jqContent = $("<ul>");
                todos.forEach(function (todo) {
                    jqContent.append($("<li>").text(todo));
                });
                $(mainSelector).append(jqContent);
            } else if (jqElement.parent().is(":nth-child(3)")) {
                var todosByTags = organizeByTag(todoObjs);
                todosByTags.forEach(function (tag) {
                    var jqTagName = $("<h3>").text(tag.name);
                    jqContent = $("<ul>");
                    tag.todos.forEach(function (description) {
                        var jqli = $("<li>").text(description);
                        jqContent.append(jqli);
                    });
                    $(mainSelector).append(jqTagName);
                    $(mainSelector).append(jqContent);
                    $(mainSelector).append($("<br>"));
                });
            } else if (jqElement.parent().is(":nth-child(4)")) {
                jqContent = $("<h3>").text("Description (required):");
                $(mainSelector).append(jqContent);
                jqContent = $("<input type=\"text\" />").addClass("description");
                $(mainSelector).append(jqContent);
                $(mainSelector).append($("<br>"));
                $(mainSelector).append($("<br>"));
                jqContent = $("<h3>").text("Tags (optional):");
                $(mainSelector).append(jqContent);
                jqContent = $("<input type=\"text\" />").addClass("tags");
                $(mainSelector).append(jqContent);
                $(mainSelector).append($("<br>"));
                $(mainSelector).append($("<br>"));
                jqContent = $("<button>Add Task</button>");
                $(mainSelector).append(jqContent);
                $(inputSelector).on("keypress", function (event) {
                    if (event.keyCode === 13) {
                        addNewTodo();
                    }
                });
                $(buttonSelector).on("click", function () {
                    addNewTodo();
                });
                $(inputSelector + ".description").focus();
            }
            return false;
        });
    });

    $(".tabs a:first-child span").trigger("click");
};

$(document).ready(function () {
    "use strict";
    $.getJSON("todos.json", function (todoObjects) {
        main(todoObjects);
    });
});
