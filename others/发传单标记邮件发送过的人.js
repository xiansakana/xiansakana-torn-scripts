// ==UserScript==
// @name         发传单标记邮件发送过的人
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  使用方式：直接在筛选人员页面使用
// @author       You
// @match        https://www.torn.com/page.php?sid=UserList*
// @match        https://www.torn.com/messages.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var sendUserList = []
    var nnn = 1

setInterval(function(){

    sendUserList = []
    nnn = 1
    
    while(true){
        var key = "sendUserList" + (nnn === 1 ? "" : nnn)
        var list = JSON.parse(localStorage.getItem(key))
        if(list){
            sendUserList = sendUserList.concat(list)
        }else{
            break
        }
        nnn++
    }

   if(location.hash.indexOf("inbox") != -1){
        if($("#info-msg-wrapper .delimiter a").length > 0){
            var userId = $("#info-msg-wrapper .delimiter a").attr("href")
            if(userId){
                userId = userId.replaceAll("profiles.php?XID=","")
                pushUserId(userId)
                $(".msg.right-round").text("已记录成功")

                let pushEmailTime = localStorage.getItem("pushEmailTime")
                if(pushEmailTime == null || (new Date().getTime() - pushEmailTime) / 1000 > 10){
                    localStorage.setItem("pushEmailTime" , new Date().getTime())
                }
            }
        }
    }

    // 邮件
    if(location.hash.indexOf("outbox") != -1){
        $("#masssell ul li .user.name").each(function(){
            var userId = $(this).attr("href")
            if(userId){
                userId = userId.replaceAll("/profiles.php?XID=","")
                pushUserId(userId)
            }

        })
    }

    // 发送过的人但没记录
    if(location.hash.indexOf("compose") != -1 && $(".msg.right-round").text() === ''){
        var userId = location.hash.replaceAll("#/p=compose&XID=","")
        pushUserId(userId)
        $(".title-black.top-round").text("已记录成功")
    }

    if(location.hash.indexOf("compose") != -1){
        let pushEmailTime = localStorage.getItem("pushEmailTime")
        let sec = (new Date().getTime() - pushEmailTime) / 1000
        if(pushEmailTime != null && sec < 10){
            $(".actionButtonsWrapper___DwpJR button").text(parseInt(10-sec) + "秒")
        }else{
            $(".actionButtonsWrapper___DwpJR button").text("send")
        }
    }

    $("ul.user-info-list-wrap li").each(function(){
        var userId = $(this)[0].className
        userId = userId.replaceAll("user","")

        if($(this).find(".viewUserId").length == 0){
            //$(this).find(".level-icons-wrap .level").append("<span class='viewUserId'>"+userId+"</span>");
        }

        var isSend = false;
        for(var i = 0 ; i < sendUserList.length ; i++){
            if(userId == sendUserList[i]){
                isSend = true
                break
            }
        }

        if(isSend){
            if($(this).find(".isSendUserId").length > 0){
                $(this).find(".isSendUserId").text("已发送")
            }else{
                $(this).find(".level-icons-wrap .level").append("<br/><span class='isSendUserId'>已发送</span>");
            }

            if($(this).find(".sendEmail").length > 0){
                $(this).find(".sendEmail").remove()
            }
        }else{
            // 未发送 添加快捷邮件发送
            if($(this).find(".sendEmail").length == 0){
                // 判断是否为三大
                var flag = false
                $(this).find(".level-icons-wrap .user-icons #iconTray .iconShow").each(function(){
                    if($(this).attr("title").indexOf("Education") != -1 || $(this).attr("title").indexOf("Hospital") != -1 || $(this).attr("title").indexOf("Courthouse") != -1){
                        flag = true
                        return
                    }
                })

                if(flag){
                    $(this).find(".level-icons-wrap .level").append("<br/><span class='sendEmail'>在学三大</span>");
                }else{
                    
                }
                $(this).find(".level-icons-wrap .level").append("<br/><a target='_blank' href='https://www.torn.com/messages.php#/p=compose&XID="+userId+"' class='sendEmail'>发送邮件</a>");
                
            }
        }

    })


    $("#scrollableDiv .infinite-scroll-component button").each(function(){
        var userId = $(this).find("a.typography___Dc5WV").attr("href")
        if(userId){
            userId = userId.replaceAll("/profiles.php?XID=","")
            pushUserId(userId)
        }

    })

//localStorage.setItem("mailbox-undefineddraft","<p>Hello! A new Private Security Firm company is hiring,If you wanna a job,or wanna increase the work states,or looking for salary,plz message me.Or you can just apply from this link:https://www.torn.com/joblist.php#/p=corpinfo&amp;ID=104313<br />Our benefits include taking turns training every day and regularly distributing gifts.</p>")
//localStorage.setItem("mailbox-undefinedtime",new Date().getTime())
//localStorage.setItem("EditorContent-mailcompose","<p>Hello, 7* Private Security Firm company is hiring, if you are looking for a job, please send me the job status attributes as well as socials, I am looking for a team leader</p>")


} , 1000);

    function pushUserId(userId){
        if(sendUserList.length > 0){
            for(var i = 0 ; i < sendUserList.length ; i++){
                if(userId == sendUserList[i]){
                    break
                } else if(i === sendUserList.length - 1){
                    sendUserList.push(userId)
                }
            }
         }else{
             sendUserList.push(userId)
         }

        if(sendUserList.length > 100){
            var sList = []
            var num = 1
            for(var n = 0 ; n < sendUserList.length ; n++){
                sList.push(sendUserList[n])
                if(sList.length === 100){
                    localStorage.setItem("sendUserList" + (num === 1 ? "" : num) , JSON.stringify(sList))
                    sList = []
                    num++
                }
            }

            if(sList.length > 0){
                localStorage.setItem("sendUserList" + (num === 1 ? "" : num) , JSON.stringify(sList))
            }

        }else{
            localStorage.setItem("sendUserList" , JSON.stringify(sendUserList))
        }
    }

})();