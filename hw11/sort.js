let up;

function find_panel(el, name) {
if (el.classList.contains(name)) {
  return el
} else {
  return find_panel(el.parentNode, name)
}
}

function getattr(el, by) {
    res = el.querySelector("." + by).getAttribute("data-" + by) * 1;
    return res;
}

function insertEl(target, el, by, up) {
    target = find_panel(target, "album");
    if (target.children.length) {
        let rows = target.querySelectorAll(".row");
      for (let i = 0; i < rows.length; i++) {
        if (getattr(rows[i], by) > getattr(el, by) && !up || getattr(rows[i], by) < getattr(el, by) && up) {
          target.insertBefore(el, rows[i]);
          break;
        }
        if (i == target.children.length - 1) {
          target.appendChild(el);
        }
      }
    } else {
      target.appendChild(el);
    }
}

function chClassIcon(btn_icon, change, dates) {
    let gl_classes = ["glyphicon-sort", "glyphicon-sort-by-order", "glyphicon-sort-by-order-alt"];
    if ( change ) {
        if ( btn_icon.classList.contains(gl_classes[0]) || btn_icon.classList.contains(gl_classes[2]) ) {
            btn_icon.classList.remove(gl_classes[0]);
            btn_icon.classList.remove(gl_classes[2]);
            btn_icon.classList.add(gl_classes[1]);
            if (dates) {
                up = false;
            }
            up = true;
        } else if ( btn_icon.classList.contains(gl_classes[1]) ) {
            btn_icon.classList.remove(gl_classes[1]);
            btn_icon.classList.add(gl_classes[2]);
            if (dates) {
                up = true;
            }
            up = false;
        }
    } else {
        btn_icon.classList = "glyphicon " + gl_classes[0];
    }
}

function sort(sort_by, album_id) {
    let sort_album = document.getElementById(album_id),
        rows,
        btns,
        btn;
    rows = sort_album.querySelectorAll(".row");
    btns = sort_album.querySelectorAll(".btn");
    btn = sort_album.querySelector(".btn-" + sort_by);
    for (let i = 0; i < btns.length; i++) {
        chClassIcon(btns[i].querySelector(".glyphicon"), btns[i] == btn, sort_by == 'dates');
    }
    for (let i = rows.length; i > 0; i--) {
        insertEl(sort_album, rows[i-1], sort_by, up);
    }
}