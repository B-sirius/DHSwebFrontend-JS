"use strict";

var danmu_choose_wrap = document.getElementById("danmu-type-choose");
var danmu_wrap = document.getElementById("danmu-wrap")
var topHighest = 0;
var bottomHighest = 0;
//定义弹幕类
var danmu = {
    type: function() {
        scroll.show();
    },
    content: "",
};

//够直白了....
var getText = function() {
    var input_text = document.getElementById("input-text");
    var text = input_text.value;
    if (text.length > 15) {
        alert("抱歉我记不住15个以上的字请重新输入_(:3 」∠ )_");
        return "";
    } else {
        input_text.value = "";
        return text;
    }
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

// 安全删除class属性
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

// 标记当前选中类型
var scrollMark = function() {
    danmu.type = function() {
        scroll.show();
    };
};
var topMark = function() {
    danmu.type = function() {
        top_fixed.show();
    };
};
var bottomMark = function() {
    danmu.type = function() {
        bottom_fixed.show();
    };
};

//销毁弹幕功能
var removeDanmu = function(element) {
    danmu_wrap.removeChild(element);
}
var deleteScrollDanmu = function(element, time) {
    setTimeout(function() {
        removeDanmu(element);
    }, time); //注意setTimeout的写法，需执行函数外面要有function包裹
}
var deleteFixedDanmu = function(element, time) {
    setTimeout(function() {
        removeDanmu(element);
    }, time); //注意setTimeout的写法，需执行函数外面要有function包裹
}

//得到当前有几种同类型弹幕来计算高度
var getTopHeight = function(parent) {
    var exist_danmu_num = parent.getElementsByClassName("top-danmu").length;
    topHighest = (exist_danmu_num === 0) ? 0 : topHighest;
    var height = topHighest * 36;
    return height;
}

var getBottomHeight = function(parent) {
    var exist_danmu_num = parent.getElementsByClassName("bottom-danmu").length;
    bottomHighest = (exist_danmu_num === 0) ? 0 : bottomHighest;
    var height = bottomHighest * 36;
    return height;
}
// 弹幕功能具体实现
var scroll = {
    show: function() {
        var scroll_danmu = document.createElement("div");
        scroll_danmu.innerHTML = danmu.content;
        scroll_danmu.className = "scroll-danmu";
        var y_position = Math.random() * 350;
        scroll_danmu.style.top = y_position + "px";
        danmu_wrap.appendChild(scroll_danmu);
        deleteScrollDanmu(scroll_danmu, 5000);
    }
}

var top_fixed = {
    show: function() {
        var top_fixed = document.createElement("div");
        top_fixed.innerHTML = danmu.content;
        top_fixed.className = "fixed-danmu";
        top_fixed.className += " top-danmu" //只是用来标记个数
        var y_position = getTopHeight(danmu_wrap);
        top_fixed.style.top = y_position + "px";
        danmu_wrap.appendChild(top_fixed);
        ++topHighest;
        deleteFixedDanmu(top_fixed, 3000);
    }
}
var bottom_fixed = {
    show: function() {
        var bottom_fixed = document.createElement("div");
        bottom_fixed.innerHTML = danmu.content;
        bottom_fixed.className = "fixed-danmu"
        bottom_fixed.className += " bottom-danmu"
        var y_position = getBottomHeight(danmu_wrap);
        bottom_fixed.style.bottom = 40 + y_position + "px";
        danmu_wrap.appendChild(bottom_fixed);
        ++bottomHighest;
        deleteFixedDanmu(bottom_fixed, 3000)
    }
}

// 弹幕种类默认值
var defaultSettingButton = function(element) {
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
fireButton.onclick = function() {
    danmu.content = getText();
    danmu.type();
}
