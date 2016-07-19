'use strict';

function prepender(container, newElement) {
  container.insertBefore(newElement, container.firstChild);
}

function deleteTextNodes(el) {
  let cn = el.childNodes;
  for (let i = cn.length; i > 0; i--) {
    if (cn[i-1].nodeType == 3) {
      el.removeChild(cn[i-1]);
    } else if (cn[i-1].childNodes.length > 0) {
      deleteTextNodes(cn[i-1]);
    }
  }
}

let dict = {};

function add(dict, elem) {
  if (dict[elem]) {
    dict[elem] += 1;
  } else {
    dict[elem] = 1;
  }
}

function log(dict) {
  let tagKeys = Object.keys(dict.tag);
  for (let i = tagKeys.length; i > 0; i--) {
    console.log("Тэгов " + tagKeys[i-1] + ": " + dict.tag[tagKeys[i-1]])
  }
  console.log("Текстовых узлов: " + dict.text.text);
  let classKeys = Object.keys(dict.class);
  for (let i = classKeys.length; i > 0; i--) {
    console.log("Элементов с классом " + classKeys[i-1] + ": " + dict.class[classKeys[i-1]])
  }
  
}

function scanDOM(el) {
  if (Object.keys(dict).length == 0){
    dict = {tag:{}, text:{text: 0}, class:{}};
  }
  if (el.nodeType == 3) {
    add(dict.text, 'text');
  } else if (el.nodeType == 1) {
    add(dict.tag, el.nodeName.toLowerCase());
    if (el.classList.length) {
      for (let i = el.classList.length; i > 0; i--) {
        add(dict.class, el.classList[i-1]);
      }
    }
  }
  
  if (el.childNodes.length) {
    for (let i = el.childNodes.length; i > 0; i--) {
      scanDOM(el.childNodes[i-1])
    }
  }

  if (el == document) {
    log(dict);
    dict = {};
  }
}

module.exports = {prepender, deleteTextNodes, scanDOM};