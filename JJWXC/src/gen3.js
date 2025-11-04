function execute(url) {
    var response = fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.0.0 Mobile Safari/537.36",
            "versiontype": "reading",
            "channel": "android",
            "Accept": "application/json"
        }
    });

    if (!response || !response.ok) {
        return null;
    }

    var text = response.text();
    if (!text || text.trim() === "") {
        return null;
    }

    var json;
    try {
        json = JSON.parse(text);
    } catch (e) {
        return null;
    }

    var keys = Object.keys(json);
    var list = [];
    if (keys.length > 0) {
        var first = json[keys[0]];
        if (first instanceof Array) list = first;
        else if (first && first.list instanceof Array) list = first.list;
    }

    if (!list || list.length === 0) {
        return Response.success([]);
    }

    var data = [];
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        if (!item) continue;

        var name = item.novelName || "";
        var author = item.authorName || "";
        var id = item.novelId || "";
        var cover = item.cover || "";

        if (cover.indexOf("//") === 0) cover = "https:" + cover;
        if (cover !== "") {
            cover = "https://images.weserv.nl/?url=" + encodeURIComponent(cover) + "&output=jpg&w=300";
        }

        if (name && id) {
            data.push({
                name: name,
                detail: author,
                cover: cover,
                link: "https://www.jjwxc.net/onebook.php?novelid=" + id,
                host: "https://www.jjwxc.net"
            });
        }
    }

    return Response.success(data);
}
