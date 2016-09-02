var Controller = {
    musicRoute: function() {
        return Model.getMusic().then(function(music) {
            results.innerHTML = View.render('music', {list: music});
        });
    },
    friendsRoute: function() {
        return Model.getFriends().then(function(friends) {
            results.innerHTML = View.render('friends', {list: friends});
        });
    },
    newsRoute: function() {
        return Model.getNews().then(function(news) {
            results.innerHTML = View.render('news', {list: news.items});
        });
    },
    groupsRoute: function() {
        return Model.getGroups().then(function(groups) {
            results.innerHTML = View.render('groups', {list: groups.items});
        });
    },
    photosRoute: function() {
        let bar = document.body.querySelector(".progress"),
            bar_albums = bar.querySelector(".progress-albums"),
            bar_photos = bar.querySelector(".progress-photos"),
            bar_comments = bar.querySelector(".progress-comments");
        bar_albums.style = "";
        bar_photos.style = "";
        bar_comments.style = "";
        bar.style.display = "block";
        Model.getPhotoAlbums().then(function(albums){
            let albums_dict = {}, count = 0, progress = 0, step = 200/albums.items.length, color = "";
            for (let i = 0; i < albums.items.length; i++) {
                let album = albums.items[i];
                if (album.id != -15) {
                    albums_dict[album.id] = {id: album.id,title: album.title, items: [], count: album.size};
                    count += album.size;
                }
                progress += step;
                if (progress > 199) {
                    color = "background-color: green; color: white";
                }
                bar_albums.style = "width:" + progress + "px;" + color;
            }
            return [albums_dict, count];
        }).then(resp => {
            document.getElementById("results").innerHTML = View.render('albums', resp[0] );
            return resp;
        }).then(resp => {
            let promise_list = [], progress = 0, step = 200/resp[1], color = "";
            for (let i = 0; i < resp[1]/200 + 1; i++) {
                promise_list.push(
                    Model.getPhotos(i * 200).then(function(photos) {
                        return photos.items;
                    })
                );
            }
            Promise.all(promise_list).then(resp => {
                for (let i = 0; i < resp.length; i++) {
                    for (let j = 0; j < resp[i].length; j++) {
                        let photo = resp[i][j], el = document.createElement('DIV');
                        el.classList = ['row'];
                        el.innerHTML = View.render('photos', photo);
                        document.getElementById(photo.album_id).appendChild(el);
                        progress += step;
                        if (progress > 199) {
                            color = "background-color: green; color: white";
                        }
                        bar_photos.style = "width:" + progress + "px;" + color;
                    }
                }
                return true;
            }).then(
                Model.callApi('photos.getAllComments', {extended: 1, offset: 0, count: 1, v:"5.53"}).then((resp) => {
                    let promise_list = [], users = [], progress = 0, step = 200/resp.count, color = "";
                    for (let i = 0; i < resp.count/100; i++) {
                        promise_list.push(
                            Model.getComments(i * 100).then(function(comments) {
                                return comments.items;
                            })
                        );
                    }
                    Promise.all(promise_list).then(comments => {
                        for (let i = 0; i < comments.length; i++) {
                            for (let j = 0; j < comments[i].length; j++) {
                                let comment = comments[i][j],
                                    photo = comment.pid,
                                    comment_el = document.createElement('DIV'),
                                    photo_el = document.querySelector('[data-pid="' + photo + '"]'),
                                    count = photo_el.parentNode.querySelector('.comments-count');
                                comment_el.classList = ['comment-blk'];
                                comment_el.dataset.user = comment.from_id;
                                if (users.indexOf(comment.from_id) == -1) {
                                    users.push(comment.from_id);
                                }
                                comment_el.innerHTML = View.render('comments', comment);
                                if (photo_el.querySelector('.no-comments')) {
                                    photo_el.innerHTML = '';
                                }
                                photo_el.appendChild(comment_el);
                                count.innerHTML = parseInt( count.innerText ) + 1;

                                progress += step;
                                if (progress > 199) {
                                    color = "background-color: green; color: white";
                                }
                                bar_comments.style = "width:" + progress + "px;" + color;
                            }
                        }
                    }).then(response => {
                        let promise_list = [];
                        for (let i = 0; i < users.length/1000; i++) {
                            promise_list.push(
                                Model.callApi('users.get', {user_ids: users.slice(i * 1000, (i + 1) * 1000 - 1).join(","), fields: "photo_50", name_case: "Nom", v:"5.53"}).then((resp) => {
                                    return resp
                                })
                            );
                        }
                        Promise.all(promise_list).then(users => {
                            setTimeout(bar.style.display = "", 0);
                            for (let i = 0; i < users.length; i++) {
                                for (let j = 0; j < users[i].length; j++) {
                                    let user = users[i][j],
                                        user_comments = document.querySelectorAll('[data-user="' + user.id + '"]');
                                    for (let k = 0; k < user_comments.length; k++) {
                                        user_comment = user_comments[k];
                                        user_comment.querySelector('img').src = user.photo_50;
                                        user_comment.querySelector('.user-name').innerHTML = [user.first_name, user.last_name].join(" ");
                                    }
                                }
                            }
                        })
                    });
                })
            )
        });
    }
};
