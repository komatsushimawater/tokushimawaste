window.addEventListener("DOMContentLoaded", function (aEvent) {

function hCounter (aHeaddingCounts, aDocument) {
  this.mH = aHeaddingCounts;
  this.mRootList = aDocument.createElement("ol");
  this.mCurrentList = this.mRootList;
  this.mHTMLDocument = aDocument;
}

hCounter.prototype = {
  mH:[0, 0, 0, 0, 0, 0],
  mLevel:0,
  mCurrentList: null,
  mRootList: null,
  mHTMLDocument: null,
  toString: function () {
    var str = "h";
    for (i = 0; i < this.mLevel; i++) {
      str += "-" + this.mH[i].toString(10);
    }
    return str;
  },

  goUp: function() {
    this.mLevel++;
    var tmp = this.mHTMLDocument.createElement("ol");
    this.mCurrentList.appendChild(tmp);
    this.mCurrentList = this.mCurrentList.lastChild;
  },

  goDown: function() {
    this.mH[this.mLevel - 1] = 0;
    this.mLevel--;
    this.mCurrentList = this.mCurrentList.parentNode;
  },

  newItem: function(aTitle, aURI) {
    var link =  this.mHTMLDocument.createElement("a");
    link.setAttribute("href", aURI);
    link.textContent = aTitle;
    var list =  this.mHTMLDocument.createElement("li");
    list.appendChild(link);
    return list;
  },

  append: function (aLevel, aTitle, aId) {
    while (this.mLevel < aLevel) {
      this.goUp();
    }
    while (aLevel < this.mLevel) {
      this.goDown();
    }

    this.mH[this.mLevel - 1]++;

    if (!aId) {
      aId = this.toString();
    }

    this.mCurrentList.appendChild(this.newItem(aTitle, "#" + aId));
    return aId;
  }
};

var hc = new hCounter([0, 0, 0, 0, 0, 0], document);

var tw = document.createTreeWalker(document, NodeFilter.SHOW_ELEMENT,
function(aNode) {
  var level = 0;
  switch (aNode.tagName.toLowerCase()) {
    case "h1": level = 1; break;
    case "h2": level = 2; break;
    case "h3": level = 3; break;
    case "h4": level = 4; break;
    case "h5": level = 5; break;
    case "h6": level = 6; break;
 }
 
 /* hack */
 level--;

 if (level > 0) {
   var newId = hc.append(level, aNode.textContent, aNode.id);
   if (aNode.id != newId) {
     aNode.setAttribute("id", newId);
   }
 }

 return (level > 0)? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;;
}, false);
while(tw.nextNode()){}
var figure = document.createElement("div");
var caption = document.createElement("div");
var ia = document.getElementById("h2toc:insertAfter");
caption.textContent = ia.getAttribute("tocTitle");
caption.id = "indexcap";
figure.style.cssText = "text-align:left;float:left;border:thin solid skyblue;" +
               "margin-bottom: 1em;box-shadow:0px 7px 5px -7px #525356;";
caption.style.cssText = "text-align:center;cursor:pointer;min-width:25em;"+
                        "color:blue;background-color:#eef;font-weight:bold;padding:0.1em";
caption.addEventListener("click", function (aEvent) {
  var list = document.getElementById("indexcap").nextSibling;
  list.classList.toggle("tocListDisplayNone");
}, false);
figure.appendChild(caption);
hc.mRootList.classList.add("tocListDisplayNone");
figure.appendChild(hc.mRootList);
ia.parentNode.insertBefore(figure, ia.nextSibling);
}, false);

