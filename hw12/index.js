ymaps.ready(function () {
    console.log("start");
    var myMap,
        currentId = 0,
        objects = {},
        MyClusterBalloonLayout = ymaps.templateLayoutFactory.createClass(
            '<div class="carousel-name">' +
                '{{ properties.place | raw}}' +
            '</div>' +
            '<div class="carousel-address">' +
                '{{ properties.address | raw}}' +
            '</div>' +
            '<div class="carousel-rewievs">' +
                '{{properties.rewievs | raw }}' +
            '</div>'
        ),
        objectManager = new ymaps.ObjectManager({
            // Чтобы метки начали кластеризоваться, выставляем опцию.
            clusterize: true,
            geoObjectOpenBalloonOnClick: true,
            clusterOpenBalloonOnClick: true,
            gridSize: 16,
            clusterDisableClickZoom: true,
            clusterBalloonContentLayout: 'cluster#balloonCarousel',
            clusterBalloonItemContentLayout: MyClusterBalloonLayout
        }),
        MyBalloonLayout = ymaps.templateLayoutFactory.createClass(
            '<div class="menu">' +
                '<div class="menu-header">' +
                    '<div class="address">' +
                        '<span class="geo-icon"></span>' +
                        '<span class="geo-address">{{ properties.address | raw}}</span>' +
                        '<span class="close">x</span>' +
                    '</div>' +
                '</div>' +
                '<div class="menu-rewievs">' +
                    '{{properties.rewievs | raw }}' +
                '</div>' +
                '<div class="menu-form">' +
                    '<input type="text" placeholder="Название места" class="place">' +
                    '<input type="text" placeholder="Ваше имя" class="name">' +
                    '<textarea placeholder="Пишите отзыв сюда" class="rewiev"></textarea>' +
                    '<div class="btn" onclick="">Отправить</div>' +
                '</div>' +
            '</div>',
            {
                build: function () {
                    MyBalloonLayout.superclass.build.call(this);
                    document.querySelector(".close").addEventListener('click', bind(function () { this.onCloseClick() }, this));
                    document.querySelector(".btn").addEventListener('click', bind(function () { addRewiev(this) }, this));
                },

                _isElement: function (element) {
                    return element && element[0];
                },

                getShape: function () {
                    if(!this._isElement(this['_element'])) {
                        return MyBalloonLayout.superclass.getShape.call(this);
                    }

                    var position = this['_element'].position();

                    return new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([
                        [position.left, position.top], [
                            position.left + this['_element'][0].offsetWidth,
                            position.top + this['_element'][0].offsetHeight + this['_element'].find('.arrow')[0].offsetHeight
                        ]
                    ]));
                },

                onCloseClick: function () {
                    document.querySelector(".close").removeEventListener('click', bind() );
                    this.events.fire('userclose');
                }
            });

    console.log("vars");
    function object_click(e) {
        e.preventDefault();
        var objectId = e.get('objectId'),
            object = objectManager.objects.getById(objectId);
        var objectState = objectManager.getObjectState(objectId);
        if (objectState.isClustered) {
            // Сделаем так, чтобы указанный объект был "выбран" в балуне.
            objectManager.clusters.state.set('activeObject', objectManager.objects.getById(objectId));
            // Все сгенерированные кластеры имеют уникальные идентификаторы.
            // Этот идентификатор нужно передать в менеджер балуна, чтобы указать,
            // на каком кластере нужно показать балун.
            objectManager.clusters.balloon.open(objectState.cluster.id);
        } else {
            objectManager.objects.balloon.open(objectId);
        }
    }

    objectManager.objects.events.add('click', function (e) { object_click(e) });
    objectManager.clusters.events.add('click', function (e) { object_click(e) });

    function addMark(coords, address) {
        objectManager.add({
            type: 'Feature',
            id: currentId++,
            geometry: {
                type: 'Point',
                coordinates: coords
            },
            properties: {
                address: address,
                rewievs: addr_rewievs(coords),
                coords: coords,
                time: new Date().toLocaleString()
            },
            options: {
                balloonLayout: MyBalloonLayout,
                balloonPanelMaxMapArea: 0
            }
        });
        myMap.geoObjects.add(objectManager);
    }

    function add_rewiev(menu_name, menu_place, menu_rewiev, addr) {
        var rew = '<div>' + menu_place + '</div>' +
                '<div>' + menu_name + '</div>' +
                '<div>' + menu_rewiev + '</div>';
        objects[addr].rewievs.push(rew);
        return rew
    }

    function addr_rewievs(key) {
        if (!objects[key]) {
            objects[key] = {rewievs: []}
        }
        if (objects[key].rewievs.length) {
            return objects[key].rewievs.join()
        }
        return "Пока нет отзывов"
    }

    function addRewiev() {
        var menu = arguments[0]['_element'].querySelector(".menu"),
            menu_address = menu.querySelector(".geo-address").innerText,
            menu_place = menu.querySelector(".place"),
            menu_name = menu.querySelector(".name"),
            menu_rewiev = menu.querySelector(".rewiev"),
            menu_rewievs = menu.querySelector(".menu-rewievs"),
            coords = arguments[0]['_data'].properties.coords;
        if (menu_name && menu_place && menu_rewiev) {
            add_rewiev(menu_name.value, menu_place.value, menu_rewiev.value, coords);
            if (!objects[menu_address]) {
                objects[menu_address] = {rewievs: []}
            }
            menu_rewievs.innerHTML = addr_rewievs(arguments[0]['_data'].properties.coords);
        }
        addMark(coords, arguments[0]['_data'].properties.address);
        menu_name.value = '';
        menu_place.value = '';
        menu_rewiev.value = '';
    }

    function bind(func, context) {
        return function() {
            return func.apply(context, arguments);
        };
    }

    function createMap (state) {
        myMap = new ymaps.Map('map', state);

        myMap.events.add('click', function (e) {
            var coords = e.get('coords');
            ymaps.geocode(coords).then(function (res) {
                return res.geoObjects.get(0).properties.get('text');
            }).then(function (res) {
                if (myMap.balloon.isOpen()) {
                        myMap.balloon.close();
                }
                myMap.setCenter(coords, myMap.getZoom(), {duration: 300});
                setTimeout(function () {
                myMap.balloon.open(coords, {
                    properties: {
                        address: res,
                        rewievs: addr_rewievs(coords),
                        coords: coords
                    }
                    // screen_position: e.get('domEvent').get('position')
                }, {
                    // contentLayout: MyBalloonLayout,
                    panelMaxMapArea: 0,
                    layout: MyBalloonLayout,
                    // preventAutoPan: true,
                    // autoPan: true,
                    // autoPanMargin: 20
                    // minHeight: 406,
                    offset: [-150, -200]
                });}, 500);
            });
        });

    }

    console.log('functions');

    ymaps.geolocation.get().then(
        function (res) {
        console.log('geolocation.get');
        var mapContainer = document.getElementById('map'),
            bounds = res.geoObjects.get(0).properties.get('boundedBy');
            // Рассчитываем видимую область для текущей положения пользователя.
        console.log('mapContainer+coords');
        // var mapState = ymaps.util.bounds.getCenterAndZoom(
        //         bounds,
        //         [mapContainer.width(), mapContainer.height()]
        //     );
        // console.log('mapState', mapState);
        // createMap(mapState);
        createMap({
            center: bounds[1],
            zoom: 16
        });
    },
        function () {
        createMap({
            center: [55.751574, 37.573856],
            zoom: 2
        });
    });
    window.om = objectManager;
});