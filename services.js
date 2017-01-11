var request = require('request'),
cacheManager = require('cache-manager'),
memoryCache = cacheManager.caching({store: 'memory', max: 100});

var stations = [
        {
            "id": 0,
            "slug": "miraath1",
            "name": "إذاعة ميراث الأنبياء الرئيسية",
            "streaming_url": "http://151.80.100.177:7000/stream",
            "json_url": "http://miraath.ddns.net:2199/rpc/miraath1/streaminfo.get",
            "description": "تسهر على بث الدروس العلمية لكبار العلماء وطلبة العلم، والتلاوات القرآنية على مدار الساعة.",
            "logo": "http://mone.irth.fr/service/uploads/00a7457d1a9e8fec2dab3cd03f1f0904.png"
        },
        {
            "id": 1,
            "slug": "miraath2",
            "name": "إذاعة ميراث الأنبياء الثانية",
            "streaming_url": "http://151.80.100.177:7010/stream",
            "json_url": "http://miraath.ddns.net:2199/rpc/miraath2/streaminfo.get",
            "description": " للاستماع إلى الدروس المباشرة المتعارضة مع الإذاعة الرئيسية ( تعمل وقت البث المباشر فقط )",
            "logo": "http://mone.irth.fr/service/uploads/65fc9dbd976fa02a9f4359666c347384.png"
        },
        {
            "id": 2,
            "slug": "miraath3",
            "name": "إذاعة ميراث الأنبياء الثالثة",
            "streaming_url": "http://151.80.100.177:7080/stream",
            "json_url": "http://miraath.ddns.net:2199/rpc/miraath3/streaminfo.get",
            "description": "الإذاعة الثالثة: للسماح للإخوة المستمعين بمتابعة الدروس المتعارضة من الدورات الشرعية",
            "logo": "http://mone.irth.fr/service/uploads/1f62fa97e5d67ef5781ca10af832ea68.png"
        },
        {
            "id": 3,
            "slug": "quran",
            "name": "إذاعة القرآن الكريم",
            "streaming_url": "http://151.80.100.177:7020/stream",
            "json_url": "http://miraath.ddns.net:2199/rpc/quran/streaminfo.get",
            "description": "إذاعة القران الكريم بموقع ميراث الأنبياء ( تلاوات على مدار الساعة )",
            "logo": "http://mone.irth.fr/service/uploads/85ba643e53a23894923c315e692fbbd8.png"
        },
        {
            "id": 4,
            "slug": "majaliss",
            "name": "مجالس ميراث الأنبياء التأصيلية",
            "streaming_url": "http://151.80.100.177:7030/stream",
            "json_url": "http://miraath.ddns.net:2199/rpc/majaliss/streaminfo.get",
            "description": "مجالس ميراث الأنبياء التأصيلية",
            "logo": "http://mone.irth.fr/service/uploads/8e9d97964973626370acf1ccb5e77faf.png"
        }
];

function setCache(){
    setInterval(function(){
        for(let i = 0; i < 5; i++){
            request(stations[i].json_url, function (error, response, body) {
                var obj, data;
                if(error)
                    console.log(error);
                obj = JSON.parse(body);
                data = {
                    scholar: obj.data[0].track.artist,
                    title: obj.data[0].track.title,
                    listeners: obj.data[0].listeners,
                    offline: obj.data[0].offline
                }
                memoryCache.set(i, data);
            });
        }
    }, 10000);
}

function getStationInfos(id, done){

    memoryCache.get(id, function (err, result) {

        if (err) { console.log(err)}

        if (result) {
            return done(null, result);
        }

        request(stations[id].json_url, function (error, response, body) {
            if(error)
                return done(error);
            console.log(response.statusCode);
            memoryCache.set(id, JSON.parse(body));
            return done(JSON.parse(body));
        });
    });
}

function getRadioStationsList(){
    return stations;
}

module.exports = {
    setCache : setCache,
    getStationInfos : getStationInfos,
    getRadioStationsList : getRadioStationsList
};
