
function addLink() {
    var linkURL = prompt('Enter a URL:', 'http://');
    var selection = document.getSelection();
    selection.document.execCommand('createlink', false, prompt('Enter a URL:', 'http://'));
}


function htmlDecode(input){
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes[0].nodeValue;
}


$("#apply").click(function(){
    console.log($("#editable").html())
  $("#holder").html($("#editable").html());
});

$('#editable').on('keydown', function (event) {
    if (window.getSelection && event.which == 8) { // backspace
        // fix backspace bug in FF
        // https://bugzilla.mozilla.org/show_bug.cgi?id=685445
        var selection = window.getSelection();
        if (!selection.isCollapsed || !selection.rangeCount) {
            return;
        }

        var curRange = selection.getRangeAt(selection.rangeCount - 1);
        if (curRange.commonAncestorContainer.nodeType == 3 && curRange.startOffset > 0) {
            // we are in child selection. The characters of the text node is being deleted
            return;
        }

        var range = document.createRange();
        if (selection.anchorNode != this) {
            // selection is in character mode. expand it to the whole editable field
            range.selectNodeContents(this);
            range.setEndBefore(selection.anchorNode);
        } else if (selection.anchorOffset > 0) {
            range.setEnd(this, selection.anchorOffset);
        } else {
            // reached the beginning of editable field
            return;
        }
        range.setStart(this, range.endOffset - 1);


        var previousNode = range.cloneContents().lastChild;
        if (previousNode && previousNode.contentEditable == 'false') {
            // this is some rich content, e.g. smile. We should help the user to delete it
            range.deleteContents();
            event.preventDefault();
        }
    }
});



/************************************/

document.getElementById('editable').addEventListener('paste', function(event){

  // get pasted data; Source: http://codingmiles.com/pasting-image-contenteditable-div/
  var pastedData = event.clipboardData.items[0];


  // If the clipboard data is of type image, read the data
  if(pastedData.type.indexOf("image") === 0) {
    composeThumbnail(pastedData.getAsFile()); // this still works!
  }
});

function composeThumbnail(file) { // source: https://developer.mozilla.org/en-US/docs/Using_files_from_web_applications

  if (!/^image\//.test(file.type)) { // if not an image; 0 since we take only 1 image, if multiple dragged at once, consider only the first one in the array
    return false;
  }

  // compose an <img> for the thumbnail
  var thumbnailImage = document.createElement("img");
  thumbnailImage.file = file;
  document.getElementById('target').appendChild(thumbnailImage);

  var reader = new FileReader();

  reader.onload = (function(thumbnailImage) {
    // this image is part of the data, so send typing notification to the agent
    return function(event) {
      thumbnailImage.src = event.target.result;
    };
  })(thumbnailImage);

  reader.readAsDataURL(file);

}

