// IE 6 background image cache
if (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE6.0") {
    document.execCommand("BackgroundImageCache", false, true);
}

// Topbar dropdown menu
var chinazTopBarMenu = {
    create: function (target, menucontents) {
        if (!document.getElementById(menucontents)) {
            return;
        }
        var contents_wrap = document.getElementById(menucontents);
        var contents = contents_wrap.innerHTML;
        target.className += " hover";
        var dropdownmenu_wrap = document.createElement("div");
        dropdownmenu_wrap.className = "dropdownmenu-wrap";
        var dropdownmenu = document.createElement("div");
        dropdownmenu.className = "dropdownmenu";
        dropdownmenu.style.width = "auto";
        var dropdownmenu_inner = document.createElement("div");
        dropdownmenu_inner.className = "dropdownmenu-inner";
        dropdownmenu_wrap.appendChild(dropdownmenu);
        dropdownmenu.appendChild(dropdownmenu_inner);
        dropdownmenu_inner.innerHTML = contents;
        if (target.getElementsByTagName("div").length == 0) {
            target.appendChild(dropdownmenu_wrap);
        }
    },
    clear: function (target) {
        target.className = target.className.replace("hover", "");
    }
}






jq = jQuery.noConflict();

jq(function () {


    jq(".commenttab>a:first").addClass("current");
    jq(".commenttab>a").mouseover(function () {
        jq(".commenttab>a").removeClass("current");
        jq(this).addClass("current");
        jq(".comment_con>div").eq(jq('.commenttab a').index(this)).show().siblings().hide();
    });
    jq(".commenttab>a").click(function () {
        return false;
    });



	var lists=jq('#fonts > a');
	jq.each(lists, function(i,n){
		 jq(n).click(function(){
			jq('.lisofttext').css('font-size',jq(n).attr('id'));

		})
	});


	jq('.lisofttext').autoIMG();
	jq(".lisofttext img").css({cursor:'pointer'});
	jq('.lisofttext img:not(.ext)').click(function () {


		window.open(jq(this).attr("src"));	
		return false;
	});




    jq(".qieh>.title>a:first").addClass("active");
    jq(".qieh>.title>a").mouseover(function () {
        jq(".qieh>.title>a").removeClass("active");
        jq(this).addClass("active");
        jq("#qhbody>.q_body").eq(jq('.qieh .title a').index(this)).show().siblings().hide();
    });


    date = new Date();
    m = date.getMonth() + 1;
    d = date.getDate();
    dd = (m > 9 ? m : "0" + m) + "-" + (d > 9 ? d : "0" + d);

    jq(".date").each(function () {
        if (jq(this).text() == dd) {
            jq(this).css("color", "#c80000");
        }
    });
	jq(".copy").click(function(){
        window.clipboardData.setData("text",location.href);
    	alert("网址已复制成功，粘贴发送给好友！");
    });

	jq(".colle").click(function(){
        var ctrl = (navigator.userAgent.toLowerCase()).indexOf('mac') != -1 ? 'Command/Cmd' : 'CTRL'; 
        if (document.all){
            window.external.addFavorite(location.href,jq("title").html());
        }else if (window.sidebar){
            window.sidebar.addPanel(jq("title").html(), location.href, "");
        }else {
            alert('您可以尝试通过快捷键' + ctrl + ' + D 加入到收藏夹~');
        } 
    });



}); 


function winClose(){
 window.opener=window.open(window.location.href,'_self')
 window.close(window.opener)
}

