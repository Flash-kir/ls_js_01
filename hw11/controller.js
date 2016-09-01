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
            let albums_dict = {}, count = 0, step = 200/albums.items.length, progress = 0, color = "";
            for (let i = 0; i < albums.items.length; i++) {
                let album = albums.items[i];
                albums_dict[album.id] = {id: album.id,title: album.title, items: [], count: album.size};
                count += album.size;
                progress += step;
                if (progress > 99) {
                    color = "background-color: green; color: white";
                }
                bar_albums.style = "width:" + progress + "px;" + color;
            }
            return [albums_dict, count];
        }).then(resp => {
            document.getElementById("results").innerHTML = View.render('albums', resp[0] );
            return resp;
        }).then(resp => {
            let promise_list = [];
            for (let i = 0; i < Object.keys( resp[0] ).length ; i++) {
                promise_list.push(
                    Model.getPhotos(Object.keys( resp[0] )[i], 0).then(function(photos) {
                        return photos.items;
                    })
                );
            }
            Promise.all(promise_list).then(resp => {
                let count = 0, photo_list = [],
                    step = 200/resp[1],
                    progress = 0,
                    color = "";
                for (let i = 0; i < resp.length; i++) {
                    for (let j = 0; j < resp[i].length; j++) {
                        let photo = resp[i][j], el = document.createElement('DIV');
                        el.classList = ['row'];
                        el.innerHTML = View.render('photos', photo);
                        document.getElementById(photo.album_id).appendChild( el );
                        if ( photo['comments'] ) {
                            if (photo.comments.count > 0) {
                                photo_list.push(photo);
                                count += photo.comments.count;
                            }
                        }
                        progress += step;
                        if (progress > 99) {
                            color = "background-color: green; color: white";
                        }
                        bar_photos.style = "width:" + progress + "px;" + color;
                    }
                }
                return [photo_list, count];
            }).then(resp => {
                let step = 200/resp[1],
                    progress = 0,
                    color = "";
                for (let i = 0; i < resp[0].length; i++) {
                    let photo = resp[0][i];
                    Model.getComments(photo.id).then(function (comments) {
                        let user = {};
                        for (let i = 0; i < comments.profiles.length; i++) {
                            let profile = comments.profiles[i];
                            user[profile.id] = {
                                photo: profile.photo_50,
                                name: [profile.first_name, profile.last_name].join(" ")
                            }
                        }
                        for (let i = 0; i < comments.items.length; i++) {
                            let comment = comments.items[i],
                                photo_el = document.getElementById("results").querySelector('[data-pid="' + photo.id + '"]'),
                                comment_el = document.createElement('DIV');
                            comment_el.classList = ['comment-blk'];
                            comment.user = user[comment.from_id];
                            comment_el.innerHTML = View.render('comments', comment);
                            photo_el.appendChild(comment_el);
                            progress += step;
                            if (progress > 99) {
                                color = "background-color: green; color: white";
                            }
                            bar_photos.style = "width:" + progress + "px;" + color;
                        }
                    })
                }
                setTimeout(bar.style.display = '', 2000)
            });
        });
    }
};
