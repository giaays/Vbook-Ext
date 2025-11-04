function execute() {
    var base = "https://app.jjwxc.org/bookstore/getFullPage?channelBody=";
    var data = [];

    var subcats = [
        ["言情·新文榜", "2900001"],
        ["言情·人气榜", "2900002"],
        ["纯爱·新文榜", "2900003"],
        ["纯爱·人气榜", "2900004"],
        ["古言·金榜", "1"],
        ["古言·种田文", "14000022"],
        ["古言·宫斗宅斗", "14000020"],
        ["古言·重生复仇", "14000024"],
        ["都市·豪门世家", "15000017"],
        ["都市·婚恋生活", "15000019"],
        ["都市·娱乐圈", "15000021"],
        ["都市·校园青春", "15000022"],
        ["幻言·异能灵异", "16000018"],
        ["幻言·系统快穿", "16000021"],
        ["幻言·玄幻修真", "16000022"],
        ["现纯·都市日常", "20000029"],
        ["现纯·青春校园", "20000027"],
        ["幻纯·奇幻甜宠", "80000072"],
        ["幻纯·未来科幻", "80000078"],
        ["幻纯·穿越系统", "80000084"]
    ];

    for (var i = 0; i < subcats.length; i++) {
        var name = subcats[i][0];
        var id = subcats[i][1];
        var body = {};
        body[id] = { offset: 0, limit: 150 };
        var json = JSON.stringify(body);
        var inputUrl = base + encodeURIComponent(json);

        data.push({
            title: name,
            input: inputUrl,
            script: "gen3.js"
        });
    }

    return Response.success(data);
}
