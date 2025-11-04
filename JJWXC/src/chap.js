load('crypto.js');
load('decode.js');

function execute(url) {
    let isVipChapter = url.includes("token") || url.includes("versionCode=349");
    let token = "error";
    
    if(isVipChapter) {
        if(url.includes("token=")) {
            token = url.split("token=")[1];
        } else if (typeof JJWXC_TOKEN !== 'undefined' && JJWXC_TOKEN && JJWXC_TOKEN.length > 20) {
            // Thêm token vào URL VIP
            token = JJWXC_TOKEN;
            if (url.includes("?")) {
                url += "&token=" + token;
            } else {
                url += "?token=" + token;
            }
        }
        
        let html1 = `Token không hợp lệ.<br/>
                     Vui lòng nhập token vào phần "Mã bổ sung" với cú pháp:<br/>
                     <code>var JJWXC_TOKEN = "token_của_bạn";</code><br/>
                     Để lấy token, hãy đăng nhập app Tấn Giang lấy token.`;
                     
        if(token === "error" || token.length < 30) {
            return Response.success(html1);
        }

        let response1 = fetch(url);
        if (response1.ok) {
            let content = response1.text();
            let res_json1;
            
            try {
                if (content.includes('"content"')) {
                    res_json1 = JSON.parse(content);
                } else {
                    let accesskey = response1.headers.accesskey;
                    let keyString = response1.headers.keystring;
                    if (accesskey && keyString) {
                        let res = decode(accesskey, keyString, content);
                        res_json1 = JSON.parse(res);
                    } else {
                        res_json1 = JSON.parse(content);
                    }
                }

                if(res_json1.message){
                    html1 = "Đây là chương VIP. Nếu muốn đọc bạn cần mua chương VIP ở Tấn Giang.<br>Nếu bạn vừa mới mua thì reload - tải lại chương này, để cập nhật nội dung.<br>Nếu vẫn không đọc được thì lập chủ đề bên Góp ý báo lỗi!";
                    return Response.success(html1);
                }
                else {
                    let chapterIntro = ""
                    let sayBody = res_json1.sayBody || ""
                    if (typeof intro !== "undefined") {
                        chapterIntro = (intro == 1) ? res_json1.chapterIntro || "" : ""
                    }
                    let chap_content = res_json1.content || ""
                    
                    // Chỉ decrypt khi cần 
                    if (chap_content && chap_content.length > 30) {
                        chap_content = decryptContent(chap_content);
                    }
                    
                    chap_content = getConent(chap_content, sayBody, chapterIntro);
                    return Response.success(chap_content);             
                }
            } catch (e) {
                console.log("Lỗi xử lý VIP chapter: " + e.message);
                return Response.success("Lỗi khi xử lý chương VIP: " + e.message);
            }
        } else {
            return Response.success("Không thể kết nối đến server. Vui lòng thử lại.");
        }
    }
    else {
        // Xử chapter free
        console.log("Xử lý free chapter: " + url);
        let response = fetch(url);
        if (response.ok) {
            try {
                let res_json = response.json();
                let chapterIntro = ""
                let sayBody = res_json.sayBody || ""
                if (typeof intro !== "undefined") {
                    chapterIntro = (intro == 1) ? res_json.chapterIntro || "" : ""
                }
                let chap_content = res_json.content || ""
                // Chapter free không cần decrypt
                return Response.success(getConent(chap_content, sayBody, chapterIntro));
            } catch (e) {
                console.log("Lỗi xử lý free chapter: " + e.message);
                return Response.success("Lỗi khi xử lý chương free: " + e.message);
            }
        } else {
            return Response.success("Không thể tải nội dung chương. Vui lòng thử lại.");
        }
    }
}

function getConent(chap_content, sayBody, chapterIntro) {
    // Đảm bảo tất cả input đều là string
    chap_content = chap_content || "";
    sayBody = sayBody || "";
    chapterIntro = chapterIntro || "";
    
    chap_content = chap_content.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\n　　/g,"<br>").replace(/<br><br>/g, "<br>");
    
    if(sayBody.trim().length > 0){
        chap_content = chap_content + "<br>••••••••<br>作者留言：<br>" + sayBody.replace(/\r\n/g,"<br>")
    }
    if(chapterIntro.trim().length > 0){
        chap_content = "内容提要：<br>" + chapterIntro.replace(/\r\n/g,"<br>") + "<br>••••••••<br>" + chap_content
    }
    return chap_content;
}