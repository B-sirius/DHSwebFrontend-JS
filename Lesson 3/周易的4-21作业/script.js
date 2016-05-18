"use strict";

var danmuChooseWrap = document.getElementById("danmu-type-choose");
var danmu = {
    type: "scroll",
    content: "",
};

var getText = function() {
    var input_text = document.getElementById("input-text");
    var text = input_text.value;
    if (text.length > 15) {
        alert("抱歉我记不住15个以上的字请重新输入_(:3 」∠ )_");
        return "";
    } else
        return text;
};

//用于值使元素只被创建一次
var getSingle = function(fn) {
    var result;
    return function() {
        return result || (result = fn.apply(this, arguments));
    }
};

//创建选择框
var createSelectionPanel = function() {
    var selectionPanel = document.createElement("div");
    selectionPanel.id = "danmu-type-choose";
    selectionPanel.innerHTML = "<div>滚动弹幕</div><div>顶端弹幕</div><div>底端弹幕</div>";
    return selectionPanel;
};

// js没有提供向后插入函数，需自己编写
var insertAfter = function(newElement, targetElement) {
    var parent = targetElement.parentNode;
    if (parent.lastChild == targetElement) {
        parent.appendChild(newElement);
    } else {
        parent.insertBefore(newElement, targetElement.nextSibling);
    }
};

//安全删除class属性
var removeClass = function(element, className) {
    if (!element) return;
    var elementClassName = element.className;
    if (elementClassName == 0) return;
    if (elementClassName == className) {
        element.className = "";
        return;
    }
    if (elementClassName.match(new RegExp("(^|\\s)" + className + "(\\s|$)"))) {
        element.className = elementClassName.replace(new RegExp(("(^|\\s)" + className + "(\\s|$)")), " ");
    }
};

//标记当前选中类型
var scrollMark = function() {
    danmu.type = "scroll";
};
var topMark = function() {
    danmu.type = "top_fixed";
};
var bottomMark = function() {
    danmu.type = "bottom_fixed";
};

var scroll = {
    show: function() {
        var scroll_danmu = document.createElement("p");
        scroll.innerHTML = danmu.content;
        scroll.className = "dan-mu";
        var y_position = Math.random() * 450;
    }
}

var top_fixed = {
    show: function() {
        var top_fixed = document.createElement("p");
        top_fixed.innerHTML = danmu.content;
    }
}

var bottom_fixed = {
    show: function() {
        var bottom_fixed = document.createElement("p");
        bottom_fixed.innerHTML = danmu.content;
    }
}

var defaultSettingButton = function(element){
    element.className += "chosen";
}

var setButton = function() {
    return function() {
        var selectionPanel = this;
        var buttons = selectionPanel.getElementsByTagName("div");
        var choose_scroll = buttons[0];
        defaultSettingButton(choose_scroll);
        var choose_top = buttons[1];
        var choose_bottom = buttons[2];
        choose_scroll.addEventListener("click", scrollMark);
        choose_top.addEventListener("click", topMark);
        choose_bottom.addEventListener("click", bottomMark);
        for (var i = 0; i < buttons.length; i++) {
            (function(i) {
                buttons[i].onclick = function() {
                    for (var j = 0; j < buttons.length; j++) {
                        removeClass(buttons[j], "chosen")
                    }
                    buttons[i].className += " chosen";
                    selectionPanel.style.display = "none";
                }
            })(i)
        }
    }
};
// 创建只能被创建一次的选择框
var createSingleSelectionPanel = getSingle(function() {
    var singleSelectionPanel = createSelectionPanel();
    setButton().apply(singleSelectionPanel, arguments);
    var target = document.getElementsByTagName("video")[0];
    insertAfter(singleSelectionPanel, target);
    return singleSelectionPanel;
});

var selectButton = document.getElementById("danmu-type");

//点击按钮，进行创建和插入
selectButton.onclick = function() {
    var singleSelectionPanel = createSingleSelectionPanel();
    singleSelectionPanel.style.display = "flex";
}

var fireButton = document.getElementById("fire");
fireButton.onclick = function(type) {
    danmu.content = getText();
    type.show();
}
