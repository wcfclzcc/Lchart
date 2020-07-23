

    function Mouse_event(ctx_id) {//该对象只能实例化一次，否则会出错

        c=document.getElementById(ctx_id);
        this.isin=0;
        this.mouse_x=0;
        this.mouse_y=0;
        this.mouse_x_static0=0;
        this.mouse_x_static1=0;
        this.mouse_y_static0=0;
        this.mouse_y_static1=0;
        this.zoom_times=0;
        this.wheel_dirc=0;//鼠标滑轮方向,0代表无，1代表向上，2代表向下
        this.isdowm=-1;//鼠标是否被按下
        var that=this;
        c.onmousedown=function(){
            that.isdowm=1;
            that.mouse_x_static0=that.mouse_x;
            that.mouse_y_static0=that.mouse_y;
        }
        c.onmouseup=function(){
            that.isdowm=0;
            that.mouse_x_static1=that.mouse_x;
            that.mouse_y_static1=that.mouse_y;
        }
        c.onmouseover=function (){
            that.isin=1;

        }
        c.onmouseout=function(){
            that.isin=0;
        }
        c.onmousewheel =function(e){
            if (e.preventDefault) {
                e.preventDefault();
            }
            //var wheel = e.originalEvent.wheelDelta;
            oEvent = e || window.event;

            if(oEvent.wheelDelta){//非火狐
                if(oEvent.wheelDelta > 0){//向上滚动
                    if(that.zoom_times<10)
                    {
                        that.wheel_dirc=1;
                        that.zoom_times++;
                    }

                }else{//向下滚动
                    if(that.zoom_times>0)
                    {
                        that.wheel_dirc=2;
                        that.zoom_times--;
                    }

                }
            }else if(oEvent.detail){
                if(oEvent.detail > 0){//向下滚动

                }else{//向上滚动

                }
            }

            console.log(that.zoom_times);

        }
        //$('#myCanvas').on('mousewheel DOMMouseScroll', onMouseScroll);
        c.onmousemove = function (event) {
            var event = event || window.event;  //标准化事件对象
            if (event.offsetX || event.offsetY) {
                that.mouse_x=event.offsetX;
                that.mouse_y=event.offsetY;
                //console.log( event.offsetX + ".." + event.offsetY);
            } else if (event.layerX || event.layerY) {

                that.mouse_x=event.layerX-1;
                that.mouse_y=event.layerY-1;

                //console.log( (event.layerX-1) + ".." + (event.layerY-1));
            }
        }


        //c.addEventListener("onmouseover",m_over);
        //c.addEventListener("onmouseout",m_out);

    }


    function Draw_base()//基础图形绘画
    {

        this.clear=function (ctx,x,y) {
            ctx.clearRect(0, 0, x, y); //清空所有的内容
        }

        this.draw_text=function (ctx,x,y,content,color,thick) {
            ctx.save();
            ctx.fillStyle=color;
            ctx.font = thick+"px Arial";
            //ctx.font ="25px Arial"
            ctx.fillText(content,x,y);
            ctx.restore();
        }


        this.drawLine=function (ctx,x1,x2,x3,x4,color,thick)//画普通的线
        {

            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle=color;
            ctx.lineWidth=thick;
            ctx.moveTo(x1,x2);
            ctx.lineTo(x3,x4);
            ctx.stroke();
            ctx.restore();
        }
        this.drawuLine=function (ctx,x1,x2,x3,x4)//画粗线
        {
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle="green";
            ctx.setLineDash([20, 5]);  // [实线长度, 间隙长度]
            ctx.lineDashOffset = -0;
            ctx.moveTo(x1,x2);
            ctx.lineTo(x3,x4);
            ctx.stroke();
            ctx.restore();
        }
        this.drawpoint=function (ctx,x,y)
        {
            ctx.beginPath();
            ctx.strokeStyle="black";
            //  ctx.lineWidth=2;
            ctx.moveTo(x,y-1);
            ctx.lineTo(x,y+1);
            ctx.stroke();
        }

        this.drawc=function (ctx,x,y,color,round) {//画圆点

            ctx.save();
            ctx.beginPath();
            ctx.arc(x, y, round, 0, 2* Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.restore();

        }

        this.drawreact=function (ctx,x1,y1,x2,y2,color,thick)//画矩形
        {
            this.drawLine(ctx,x1,y1,x2,y1,color,thick);
            this.drawLine(ctx,x2,y1,x2,y2,color,thick);
            this.drawLine(ctx,x2,y2,x1,y2,color,thick);
            this.drawLine(ctx,x1,y2,x1,y1,color,thick);
        }
    }

    function Data_processing(height,width) {


        this.x_transform=function (len,pos) {//index转换为pos

            return Math.round(pos*width/(len-1));
        }
        this.x_transform_back=function (len,pos) {//pos转换为index

            return Math.round(pos*(len-1)/width);
        }
        this.data_handel=function (dat,coo_set,index)//数据初步处理,主要是pos与y轴的转换作用
        {
            //console.log(height/(coo_set.y_max[index]-coo_set.y_min[index]))
            var da=height-(dat-coo_set.y_min[0])*height/(coo_set.y_max[0]-coo_set.y_min[0]);
            return da;
        }

        this.data_off=function (data)//数据舍去
        {
            if(data.length>width)
            {
                var da = new Array();
                for(var i=0;i<width;i++)
                {
                    da[i]=data[parseInt(i*(data.length-1)/width-1)];
                }
                return da;
            }
            else{
                return data;
            }

        }

    }

    function Draw_all(height,width) {//对大量数据绘画

        var draw=new Draw_base();
        var data_processing=new Data_processing(height,width);

        this.draw_data_all=function draw_data_all(ctx,dat,set) {

            var index=0;
            for(let key  in dat){
                var color = set.line_set.color[index];
                var thick = set.line_set.thick[index];

                if(set.line_set.is_display[index]) {
                    var data = data_processing.data_off(dat[key]);//数据舍去

                    for (let i = 1; i < data.length; i++) {

                        draw.drawLine(ctx, data_processing.x_transform(data.length, i - 1), data_processing.data_handel(data[i - 1],set.coo_set,index), data_processing.x_transform(data.length, i), data_processing.data_handel(data[i],set.coo_set,index), color, thick);

                    }

                    if(data.length<width/15)//绘画点
                    {
                        for(let i=0;i<data.length;i++)
                        {
                            draw.drawc(ctx,data_processing.x_transform(data.length,i),data_processing.data_handel(data[i],set.coo_set,index),"#fff",4);
                            draw.drawc(ctx,data_processing.x_transform(data.length,i),data_processing.data_handel(data[i],set.coo_set,index),"#2db7f5",3);
                        }

                    }
                }

                index++;

            }


            //console.log("ssss");


        }

        function noupdate_y(ctx,coo_set) {

            ctx.save()
            ctx.font = "bold 15px Arial";

            for(let index=0;index<coo_set.y_nums;index++)//y轴
            {
                draw.drawLine(ctx,coo_set.y_pos[index],0,coo_set.y_pos[index],width,coo_set.y_color[index],3);

                ctx.fillStyle=coo_set.y_color[index];
                let jg=Math.round(height/coo_set.y_ms[index]);
                let k=1;
                let jg_nums=(coo_set.y_max[index]-coo_set.y_min[index])/coo_set.y_ms[index];
                //console.log(coo_set);
                for(let i=jg;i<height;i+=jg)
                {
                    draw.drawLine(ctx,0,i,10,i,coo_set.y_color[index],3);//坐标点
                    draw.drawLine(ctx,0,i,width,i,coo_set.y_color[index],0.3);//辅助线
                    ctx.fillText(k*jg_nums+coo_set.y_min[index],5,height-i-5);
                    k++;

                }

            }



            ctx.restore();


        }

        function noupdate_x(ctx,coo_set,date) {


            ctx.save()
            ctx.font = "bold 15px Arial";
            let length=date.length;

            for(let index=0;index<coo_set.x_nums;index++)//x轴
            {
                draw.drawLine(ctx,0,height- coo_set.x_pos[index],width,height-coo_set.x_pos[index],coo_set.x_color[index],3);
                ctx.fillStyle=coo_set.x_color[index];
                let jg=Math.round(width/coo_set.x_ms[index]);
                let k=1;

                for(let i=jg;i<width;i+=jg)
                {
                    draw.drawLine(ctx,i,height-10,i,height,coo_set.x_color[index],3);
                    draw.drawLine(ctx,i,0,i,height,coo_set.x_color[index],0.3);
                    ctx.fillText(date[data_processing.x_transform_back(length,i)],i+5,height-5);
                    k++;
                }


            }




            ctx.restore();

        }

        this.fixd=function (ctx,set,date) {//固定不变的部分
            ctx.save();
            ctx.font = "bold 15px Arial";
            for(let i=0;i<set.name_set.name.length;i++){
                ctx.fillStyle=set.line_set.color[i];

                draw.drawLine(ctx,width-100,30*(i+1),width-60,30*(i+1),set.line_set.color[i],5);
                ctx.fillText(set.name_set.name[i],width-50,30*(i+1)+5);
            }


            noupdate_y(ctx,set.coo_set);
            noupdate_x(ctx,set.coo_set,date);
            ctx.restore();

        }

    }

    function Draw_detial(ctx_id,height,width,data,mouse) {



        var c=document.getElementById(ctx_id);
        var ctx=c.getContext("2d");//获得canvas
        var canvas = document.createElement("canvas");
        canvas.style.display="none";
        canvas.style.position="absolute";
        var hei=50*Object.keys(data).length+50;
        var wid=300;
        canvas.setAttribute("height",hei);
        canvas.setAttribute("width",wid);
        canvas.style.backgroundColor="rgba(20, 20, 20,0.5)";
        //position: absolute;left: 0px;top: 0px;display: none;
        var parentNode = c.parentNode;
        parentNode.appendChild(canvas);
        ctx1=canvas.getContext("2d");//获得canvas

        var data_processing=new Data_processing(height,width);
        var draw=new Draw_base();
        function transferColorToRgb(color,tmd) {//将颜色转rgb
            if (typeof color !== 'string' && !(color instanceof String)) return console.error("请输入16进制字符串形式的颜色值");
            color = color.charAt(0) === '#' ? color.substring(1) : color;
            if (color.length !== 6 && color.length !== 3) return console.error("请输入正确的颜色值")
            if (color.length === 3) {
                color = color.replace(/(\w)(\w)(\w)/, '$1$1$2$2$3$3')
            }
            var reg = /\w{2}/g;
            var colors = color.match(reg);
            for (var i = 0; i < colors.length; i++) {
                colors[i] = parseInt(colors[i], 16).toString();
            }
            return 'rgb(' + colors.join() +","+tmd+')';
        }


        function detial_text(data,date,set) {//详细文本绘画

            let max_length=0;
            for(let i in set.name_set.name)
            {
                if(max_length>set.name_set.name[i].length)
                {
                    max_length=set.name_set.name[i].length;
                }
            }

            canvas.style.backgroundColor=transferColorToRgb(set.detail_set.back_color,set.detail_set.tmd);
            draw.clear(ctx1,wid,hei);
            let i=0;
            let size=set.detail_set.size;
            let text_color=set.detail_set.text_color;
            let ind=size+5;
            let length=data[Object.keys(data)[0]].length;
            let index=data_processing.x_transform_back(length,mouse.mouse_x);

            hei=2*size*set.name_set.name.length+2*size;

            wid=300;
            canvas.setAttribute("height",hei);
            canvas.setAttribute("width",wid);
            draw.draw_text(ctx1,5,ind,date[index],text_color,size+5);
            ind+=size*2;
            for(let key  in data){
                draw.draw_text(ctx1,5,ind,set.name_set.name[i]+":"+data[key][index],text_color,size);
                ind+=size*2;
                i++;
            }

            canvas.style.left = mouse.mouse_x+c.offsetLeft+30 + "px";
            canvas.style.top =mouse.mouse_y+c.offsetTop+40 + "px";
        }

        function draw_circle_line(data,set) {


            let line_set=set.line_set;
            var display_nums=0;
            for(let i=0;i<line_set.is_display.length;i++)
            {
                if(line_set.is_display[i])
                {
                    display_nums++;
                }
            }
            var length=data[Object.keys(data)[0]].length;
            var index=data_processing.x_transform_back(length,mouse.mouse_x);//获得鼠标最近的数据的index
            var pos=data_processing.x_transform(length,index);
            if(display_nums!=0) {
                draw.drawLine(ctx, pos, 0, pos, height, "#5cadff", 2);
                let ind=0;
                for (let key in data) {
                    if(line_set.is_display[ind]) {
                        draw.drawc(ctx, pos, data_processing.data_handel(data[key][index],set.coo_set,index), "#fff", 4);
                        draw.drawc(ctx, pos, data_processing.data_handel(data[key][index],set.coo_set,index), "#2db7f5", 3);
                    }
                    ind++;
                }
            }

        }

        this.draw_detial=function (data,date,set) {
            //console.log(mouse.mouse_x);
            if(set.detail_set.isopen && mouse.isin==1)
            {
                canvas.style.display="block";
                detial_text(data,date,set);
                draw_circle_line(data,set);
            }
            else{
                canvas.style.display="none";
            }

        }

    }

    function Mouse_zoom(ctx_id,height,width,data,mouse) {

        var data_processing=new Data_processing(height,width);

        var draw =new Draw_base();
        var c=document.getElementById(ctx_id);
        var ctx=c.getContext("2d");//获得canvas

        var data_length=data[Object.keys(data)[0]].length;
        var change_right=data_length;
        var change_left=0;

        var change_data=JSON.parse(JSON.stringify(data));


        var all=0;//计算缩放倍率,使用负的反比例函数控制，计算十步
        for(let i=0;i<10;i++)
        {
            all+=1/(i+1);
        }
        var step=(data_length-10)/all;//计算每次移动步数参照

        function zoom_fun(x) {
            return 1/x;
        }
        var select=0;
        var select_mode=0;

        function select_data(data,left,right) {
            let dat=new Object();
            for(let key  in data){
                //console.log(display_data[key])
                dat[key]=data[key].slice(left,right+1);
            }
            return dat
        }

        function mouse_select() {

            if(mouse.isdowm==1)
            {
                select=1;
            }
            if(select==1)
            {
                draw.drawreact(ctx,mouse.mouse_x_static0,mouse.mouse_y_static0,mouse.mouse_x,mouse.mouse_y,"#888",2);

                if(mouse.isdowm==0)
                {
                    select=0;
                    let len=change_right-change_left;
                    //draw.drawreact(ctx,mouse.mouse_x_static0,mouse.mouse_y_static0,mouse.mouse_x,mouse.mouse_y,"#888",2);
                    change_left=data_processing.x_transform_back(len,mouse.mouse_x_static0);
                    change_right=data_processing.x_transform_back(len,mouse.mouse_x_static1);


                }
            }
        }

        function mouse_wheel() {
            if(mouse.zoom_times==0)//没有缩放
            {
                //console.log("sss");
                //console.log(dat.data1.length);
                change_right=data_length;
                change_left=0;

                //return select_data(dat,change_left,change_right);
            }
            else{

                if(mouse.wheel_dirc==0)
                {
                    //change_right=data_length;
                    //change_left=0;
                }

                if(mouse.wheel_dirc==1)
                {
                    if(change_right-change_left>20) {
                        change_left += Math.round((mouse.mouse_x / width) * step * zoom_fun(mouse.zoom_times));
                        change_right -= Math.round((1 - mouse.mouse_x / width) * step * zoom_fun(mouse.zoom_times));
                        if (change_left < 0) {
                            change_left = 0;
                        }
                        if (change_right > data_length) {
                            change_right = data_length;
                        }
                    }

                }
                else if(mouse.wheel_dirc==2)
                {

                    change_left -= Math.round((mouse.mouse_x / width) * step * zoom_fun(mouse.zoom_times + 1));
                    change_right += Math.round((1 - mouse.mouse_x / width) * step * zoom_fun(mouse.zoom_times + 1));
                    if (change_left < 0) {
                        change_left = 0;
                    }
                    if (change_right > data_length) {
                        change_right = data_length;
                    }

                }
                mouse.wheel_dirc=0;



                //return(select_data(dat,change_left,change_right));
            }
        }

        this.zoom_data_process=function (dat) {//缩放的数据处理

            //console.log(mouse.isdowm);
            data_length=data[Object.keys(dat)[0]].length;

            step=(data_length-10)/all;

            if(select_mode==0)
            {
                mouse_wheel(dat);
            }
            else if(select_mode==1)
            {
                mouse_select(dat);
            }
            return  select_data(dat,change_left,change_right);

        }

        this.zoom_date_process=function (dat) {//缩放的数据处理

            //console.log(mouse.isdowm);
            data_length=dat.length;
            step=(data_length-10)/all;

            if(select_mode==0)
            {
                mouse_wheel(dat);
            }
            else if(select_mode==1)
            {
                mouse_select(dat);
            }

            return dat.slice(change_left,change_right+1);


        }

    }

    function Set() {

        this.name_set=function (data) {
            var name_set=new Object();
            var name=new Array();
            for(let key  in data){
                name.push(key);
            }
            name_set.name=name;
            return name_set;
        }

        this.line_set=function (color,is_display,thick) {
            var line_set=new Object();
            line_set.color=color;
            line_set.is_display=is_display;
            line_set.thick=thick;
            return line_set;
        }

        this.detail_set=function (text_color,back_color,tmd,size,isopen) {

            var detail_set=new Object();
            detail_set.text_color=text_color;
            detail_set.back_color=back_color;
            detail_set.tmd=tmd;
            detail_set.size=size;
            detail_set.isopen=isopen;
            return detail_set;


        }

        this.zoom_set=function (mode,target) {
            var zoom_set=new Object();
            zoom_set.mode=mode;
            zoom_set.target=target;

            return zoom_set;


        }

        this.coo_set=function (x_nums,x_pos,x_ms,x_color,x_max,y_nums,y_pos,y_max,y_ms,y_color,y_min) {

            var coo_set=new Object();
            coo_set.x_nums=x_nums;
            coo_set.x_pos=x_pos;
            coo_set.x_ms=x_ms;
            coo_set.x_color=x_color;
            coo_set.y_nums=y_nums;
            coo_set.y_pos=y_pos;
            coo_set.y_max=y_max;
            coo_set.y_ms=y_ms;
            coo_set.y_color=y_color;
            coo_set.x_max=x_max;
            coo_set.y_min=y_min;

            return coo_set;

        }
    }


    function Lchart(ctx_id,data)//折线图
    {


        this.set=new Object();
        var set0=this.set;
        var c=document.getElementById(ctx_id);
        this.ctx=c.getContext("2d");//获得canvas
        var ctx =this.ctx;
        var display_nums=0;
        for(let key  in data.display_data){
            display_nums++;
        }


        this.data=data;
        var display_data_change=JSON.parse(JSON.stringify(display_data));
        var change_date=this.data.date;
        var width=c.getAttribute("width");
        var height=c.getAttribute("height");
        var k=5;
        var mouse=new Mouse_event(ctx_id);

        var detial=new Draw_detial(ctx_id,height,width,display_data,mouse);

        var draw_all=new Draw_all(height,width);

        var zoom=new Mouse_zoom(ctx_id,height,width,display_data,mouse);

        var setobj=new Set();

        var that=this;



        function init() {//初始化设置
            that.set.name_set=setobj.name_set(data.display_data);
            var color=new Array();
            var is_display=new Array();
            var thick=new Array();

            for(let i=0;i<display_nums;i++)
            {
                color.push("#f40");
                is_display.push(true);
                thick.push(2);
            }

            that.set.line_set=setobj.line_set(color,is_display,thick);

            that.set.detail_set=setobj.detail_set("#555","#999",0.4,20,true);

            that.set.zoom_set=setobj.zoom_set(1,1);
            let y_pos=[1];
            let x_pos=[1];
            let x_color=["#222"];
            let y_color=["#222"];
            let x_ms=[Math.round(width/180)];
            let y_ms=[10];
            let x_max=[date[date.length-1]];
            let y_max=[30];
            let y_min=[-30];
            that.set.coo_set=setobj.coo_set(1,x_pos,x_ms,x_color,x_max, 1,y_pos ,y_max,y_ms,y_color,y_min);
        }
        init();

        this.display= function update()//实时更新
        {
            //console.log(mouse.mouse_x);

            //console.log(this.date);
            ctx.clearRect(0, 0, width, height); //清空所有的内容


            //console.log(this.data.display_data.data1.length);
            display_data_change=zoom.zoom_data_process(this.data.display_data);
            change_date=zoom.zoom_date_process(this.data.date);


            draw_all.draw_data_all(ctx,display_data_change,set0);//曲线部分

            draw_all.fixd(ctx,set0,change_date);//固定部分，坐标轴

            detial.draw_detial(display_data_change,change_date,set0);//详情部分

            requestAnimationFrame(update);
            // if(zoom==0){
            //
            //     //data_time_change=this.display_data;
            //
            //     for(let key  in display_data_change){
            //
            //         display_data_change[key]=this.display_data[key];
            //     }
            //
            //     change_left=0;
            //     change_right=Object.keys(display_data)[0].length-1;
            // }
            // else{//会增加消耗，但实时更新
            //     //hpv_change = zoom_data(hpv,change_left,change_right);
            //     //tpv_change = zoom_data(tpv,change_left,change_right);
            //     //data_time_change=zoom_data(data_time,change_left,change_right);
            // }


            // var sss=4;
            // for(let key  in display_data_change){
            //      //console.log(display_data[key])
            //         draw_data_all(ctx,data_off(display_data_change[key]),"#"+sss+(sss+2)+(sss+3),1.5);
            //         sss+=2;
            //   }

            //  if(isin==1)
            //     {

            //         position_detect(ctx);

            //     }



            // if(hpv_change.length>1)
            // {
            //     if(tpv_hpv_control.switch1)
            //     {
            //         draw_data_all(ctx,data_off(hpv_change),tpv_hpv_control.color_hpv,1.5);
            //     }
            //     if(tpv_hpv_control.switch2)
            //     {
            //         draw_data_all(ctx,data_off(tpv_change),tpv_hpv_control.color_tpv,1.5);
            //     }

            //      if(isin==1)
            //     {

            //         position_detect(ctx);
            //         //drawLine(ctx,mouse_x,1,mouse_x,height,"#0f4");
            //         if(tpv_hpv_control.switch1||tpv_hpv_control.switch2)
            //         {
            //             position_detect(ctx);
            //         }

            //     }
            // }



        }


    }



