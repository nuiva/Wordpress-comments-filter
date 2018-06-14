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

function hideComments() {
  $("li.comment").each(function(){
    var $this = $(this);
    var $comment = $this.children(":first");
    var name = $comment.find("b.fn").text();
    if (isFiltered(name)) {
      $this.hide();
    } else {
      $this.show();
    }
  });
}


var $unfilterdiv = $("#comments").append("<div><p>Filtered:</p></div>");
function addUnfilterButton(name) {
  var $button = $("<button>"+name+"</button>");
  $unfilterdiv.append($button);
  $button.click(function(){
    GM_deleteValue(name);
    $button.hide();
    hideComments();
  });
}
GM_listValues().forEach(addUnfilterButton);

function addFilterButtons() {
  $("li.comment").each(function(){
    var $this = $(this);
    var $comment = $this.children(":first");
    var name = $comment.find("b.fn").text();
    $comment.find(".comment-metadata").append("<button style=\"margin-left: 10px; padding: 2px;\">Filter</button>").click(function(){
      filterName(name);
      hideComments();
      addUnfilterButton(name);
    });
  });
}

hideComments();
addFilterButtons();

