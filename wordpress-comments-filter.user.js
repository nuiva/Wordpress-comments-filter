// ==UserScript==
// @name wordpress-comments-filter
// @namespace wordpress-comments-filter
// @match *://*.wordpress.com/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// ==/UserScript==

// Clear all entries in cache
function clearall() {
  GM_listValues().forEach(function(k){
    GM_deleteValue(k);
  });
  console.log("Cleared cache.");
}
// Clear entries for some identifier in cache
function unfilterName(name) {
  GM_deleteValue(name);
}
// List all cache data to console, usable from webconsole for debug
listcache = function(filter) {
  GM_listValues().forEach(function(k){
    if (k.match(filter)) {
      console.log(k);
    }
  });
}

function filterName(name) {
  GM_setValue(name, 1);
}

function isFiltered(name) {
  return GM_getValue(name, 0);
}

var $unfilterdiv = $("<div><p>Filtered:</p></div>");
$("#comments").append($unfilterdiv);
function addUnfilterButton(name) {
  var $button = $("<button>"+name+"</button>");
  $unfilterdiv.append($button);
  $button.click(function(){
    GM_deleteValue(name);
    $button.hide();
    hideComments();
  });
}

function msgFilterCondition(msg) {
  var numwords = msg.trim().split(/\s+/).length;
  if (numwords <= 3 ||
      (msg.match(/(^|\W)(thanks|thx)/i) && numwords <= 10)) {
    return true;
  }
  return false;
}

function hideComments() {
  $unfilterdiv.find("button").remove();
  var buttons = [];
  $("li.comment").each(function(){
    var $this = $(this);
    var $comment = $this.children(":first");
    var name = $comment.find("b.fn").text();
    if (isFiltered(name)) {
      $this.hide();
      if (!buttons.includes(name)) {
        buttons.push(name);
        addUnfilterButton(name);
      }
      return;
    }
    var msg = "";
    $comment.find(".comment-content p:not(:last-of-type)").each(function() {
      msg += $(this).text();
    });
    if (msgFilterCondition(msg)) {
      $this.hide();
      return;
    }
    $this.show();
  });
}

function addFilterButtons() {
  $("li.comment").each(function(){
    var $this = $(this);
    var $comment = $this.children(":first");
    var name = $comment.find("b.fn").text();
    $comment.find(".comment-metadata").append("<button style=\"margin-left: 10px; padding: 2px;\">Filter</button>").click(function(){
      filterName(name);
      hideComments();
    });
  });
}

hideComments();
addFilterButtons();
