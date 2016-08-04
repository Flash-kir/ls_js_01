new Promise(function(resolve) {
  if (document.readyState === 'complete') {
    resolve();
  } else {
    window.onload = resolve;
  }
}).then(function() {
  return new Promise(function(resolve, reject) {
    VK.init({
      apiId: 5572480
    });

    VK.Auth.login(function(response) {
      if (response.session) {
        resolve(response);
      } else {
        reject(new Error('Не удалось авторизоваться'));
      }
    }, 8);
  });
}).then(function() {
  function month(m1, m2, d1, d2) {
    if (m1-m2>0) {
      return m1-m2
    } else if (m1-m2<0) {
      return 12-m2+m1
    } else {
      if (d1<d2) {
        return 12-m2+m1
      } else {
        return m1-m2
      }
    }
  }

  function day(d1, d2, now) {
    if (d1-d2>0) {
      if (d1>=now && d2>=now) {
        return 1
      } else if (d1>now && d2<now) {
        return -1
      }
    } else if (d1 == d2) {
      return 0
    } else {
      if (d1>=now && d2>=now) {
        return -1
      } else if (d1<now && d2>now) {
        return 1
      }
    }
  }

  function sortByDate(list) {
    let now_date = new Date(), now_month = now_date.getMonth()+1, now_day = now_date.getDate();
    list.sort(function (a, b) {
    if (a.bdate && b.bdate) {
        let monthA = a.bdate.split(".")[1], dayA = a.bdate.split(".")[0];
        let monthB = b.bdate.split(".")[1], dayB = b.bdate.split(".")[0];

        if (month(monthA, now_month, dayA, now_day) < month(monthB, now_month, dayB, now_day)) {
          return -1;
        } else if (month(monthA, now_month, dayA, now_day) > month(monthB, now_month, dayA, now_day)) {
          return 1;
        } else {
           if (now_month == monthA || now_month == monthB) {
           }
          return day(dayA, dayB, now_day)
        }
    } else if (a.bdate && !b.bdate) {
      return -1
    } else if (!a.bdate && b.bdate) {
      return 1
    } else {
      return 0
    }
    });

    return list;

  }

  return new Promise(function(resolve, reject) {
    VK.api('friends.get', {name_case:"nom", v:"5.53", fields: "bdate,photo_50"}, function(response) {
      if (response.error) {
        reject(new Error(response.error.error_msg));
      } else {

        let source = document.getElementById('friendItemTemplate').innerHTML;
        let templateFn = Handlebars.compile(source);
        let template = templateFn({list: sortByDate(response.response.items) });

        
        document.getElementById("friends").innerHTML = template;

        resolve();
      }
    });
  })
}).catch(function(e) {
  alert(`Ошибка: ${e.message}`);
});

