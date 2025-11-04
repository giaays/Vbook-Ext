function execute(url) {
    var bookID = '0';
    if(url.indexOf("book2") !== -1)
    {
        bookID = url.split(/[/ ]+/).pop();
    }
    if(url.indexOf("novelid=") !== -1)
    {
        if(url.slice(-1) === "/")
	        url = url.slice(0, -1)
        bookID = url.split("novelid=")[1]
        if(url.indexOf("&chapterid=") !== -1){
            bookID = bookID.split("&chapterid=")[0];
        }
    }

    // Lấy token từ biến JJWXC_TOKEN trong mã bổ sung
    let token = "error";
    
    // Kiểm tra biến JJWXC_TOKEN từ mã bổ sung
    if (typeof JJWXC_TOKEN !== 'undefined' && JJWXC_TOKEN && JJWXC_TOKEN.length > 20) {
        token = JJWXC_TOKEN;
        console.log("Sử dụng token từ Mã bổ sung: " + token.substring(0, 10) + "...");
    } else {
        console.log("Không tìm thấy token trong Mã bổ sung. Vui lòng cấu hình biến JJWXC_TOKEN");
        token = "error";
    }
    
    console.log("Token status: " + (token === "error" ? "INVALID" : "VALID"));

    let url1 = "https://app-cdn.jjwxc.net/androidapi/chapterList?novelId="+ bookID +"&more=0&whole=1";
    let response = fetch(url1);
    if (response.ok) {
        let el = response.json().chapterlist;
        const data = [];
        for (let i = 0;i < el.length; i++) {
            let name =  el[i].chaptername;
            if(el[i].chaptertype != '1')
            {
                let buy = false
                name = el[i].chapterid +". " + name.trim();
                let chapterid=  el[i].chapterid
                let link = 'https://app.jjwxc.net/androidapi/chapterContent?novelId='+bookID+'&chapterId='+chapterid;
                let checkVIP = el[i].isvip;
                if(checkVIP>0) {
                    buy = true
                    link = "https://app.jjwxc.net/androidapi/chapterContent?novelId="+bookID+"&versionCode=349&chapterId="+chapterid+"&token="+token
                    
                }
                data.push({
                    name: name,
                    url: link ,
                    pay: buy,
                    host: "https://app.jjwxc.net"
                    
                })

            }
        }
        return Response.success(data);
    }
    return null;
}