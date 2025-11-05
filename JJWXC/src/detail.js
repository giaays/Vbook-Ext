function execute(url) {
    var bookID = "0";
    if (url.indexOf("book2") !== -1) {
        bookID = url.split(/[/ ]+/).pop();
    }
    if (url.indexOf("novelid=") !== -1) {
        if (url.slice(-1) === "/") url = url.slice(0, -1);
        bookID = url.split("novelid=")[1];
        if (url.indexOf("&chapterid=") !== -1) {
            bookID = bookID.split("&chapterid=")[0];
        }
    }

    var response = fetch("http://app.jjwxc.net/androidapi/novelbasicinfo?novelId=" + bookID);
    if (!response || !response.ok) return null;

    var doc = response.json();
    if (!doc || !doc.novelName) return null;

    var name = doc.novelName || "";
    var author = doc.authorName || "";
    var tags = doc.novelTags || "";
    var coverImg = "https://images.weserv.nl/?url=" + doc.novelCover + "&output=jpg&w=300";
    var category = doc.novelClass || "";
    var status = (doc.novelStep == "2") ? "已完结" : "连载中";
    var view = doc.mainview || "";
    var wordCount = doc.novelSizeformat || doc.novelSize || "";
    var protagonist = doc.protagonist || "";
    var costar = doc.costar || "";
    var others = doc.other || "";
    var shortIntro = doc.novelIntroShort || "";

    var last = "";
    try {
        var chapRes = fetch("https://android.jjwxc.net/androidapi/chapterList?novelId=" + bookID + "&more=0&whole=1");
        if (chapRes && chapRes.ok) {
            var chapJson = chapRes.json();
            if (chapJson && chapJson.chapterlist && chapJson.chapterlist.length > 0) {
                var lastChap = chapJson.chapterlist[chapJson.chapterlist.length - 1];
                var vip = (lastChap.isvip !== "0") ? "🔒" : "";
                last = vip + lastChap.chapterid + "." + lastChap.chaptername + " • " + lastChap.chapterdate;
            }
        }
    } catch (e) {
        last = "暂无目录";
    }

    var intro = (doc.novelIntro || "")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/<br\/><br\/>/g, "<br/>")
        .replace(/<br\/>/g, "<br>");

    var detail ="类型: " + category + "<br>" +
        "标签: " + tags + "<br>" +
        "字数: " + wordCount + "<br>" +
        "最新章节: " + last + "<br>" +
        protagonist + "<br>" +
        costar + "<br>" +
        others;

    return Response.success({
        name: name,
        cover: coverImg,
        author: author,
        description: (shortIntro ? shortIntro + "<br><br>" : "") + intro,
        detail: detail,
		ongoing: status !== "已完结",
        host: "http://www.jjwxc.net/"
    });
}