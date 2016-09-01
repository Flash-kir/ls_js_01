var lastcall_time = new Date().getTime(),
    Model = {
    login: function(appId, perms) {
        return new Promise(function(resolve, reject) {
            VK.init({
                apiId: appId
            });

            VK.Auth.login(function(response) {
                if (response.session) {
                    resolve(response);
                } else {
                    reject(new Error('Не удалось авторизоваться'));
                }
            }, perms);
        });
    },
    callApi: function(method, params) {
        return new Promise(function(resolve, reject) {
            let now = new Date().getTime();
            while ( now - lastcall_time < 340) {
                now = new Date().getTime();
            }
            lastcall_time = new Date().getTime();
            VK.api(method, params, function(response) {
                if (response.error) {
                    reject(new Error(response.error.error_msg));
                } else {
                   resolve(response.response);
                }
            });
        });
    },
    getUser: function(uid = '', fields = '') {
        return this.callApi('users.get', {user_ids: uid, fields: fields, v:"5.53"});
    },
    getMusic: function() {
        return this.callApi('audio.get', {});
    },
    getFriends: function() {
        return this.callApi('friends.get', {fields: 'photo_100'});
    },
    getNews: function() {
        return this.callApi('newsfeed.get', {filters: 'post', count: 20});
    },
    getGroups: function() {
        return this.callApi('groups.get', {extended: 1, v:"5.53"});
    },
    getPhotos: function(album_id) {
        return this.callApi('photos.get', {extended: 1, album_id: album_id, count: 1000, skip_hidden: 1, v:"5.53"});
    },
    getComments: function(photo_id) {
        return this.callApi('photos.getComments', {extended: 1, photo_id: photo_id, fields: "photo_50", count: 100, v:"5.53"});
    },
    getPhotoAlbums: function() {
        return this.callApi('photos.getAlbums', {need_system: 1, v:"5.53"});
    }
};