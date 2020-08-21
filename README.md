# Lchart
该项目旨在实现数据可视化，使用HTML5的canvas实现，以折线图的方式，展示百万级别数据。

## 使用示例

"""
<body style="background-color:#f8f8f9">

	<br><br><br><br>

<canvas  id="myCanvas" width="300" height="200" style="border:1px solid #d3d3d3; background-color: rgba(230, 230, 230,0.1);">

        您的浏览器不支持 HTML5 canvas 标签。</canvas>

     </div>


    <script type="text/javascript" src="Lchart.js"></script>

</body>

	var display_data=new Object();
	display_data.data1=new Array();//创建一条曲线
	display_data.data2=new Array();//创建另一条条曲线

	var date=new Array();//创建横坐标的数组

	for(let i=0;i<100;i++)
	{
		display_data.data1.push(i*0.2);//给曲线赋值
		display_data.data2.push(10-i*0.2);//给曲线赋值
		date.push(i);//给横坐标赋值
	}

	var data=new Object();//创建data对象
	data.display_data=display_data;
	data.date=date;



    var test1=new Lchart("myCanvas",data);//新建曲线对象

    test1.display();//显示



    </script>
"""

本曲线功能强大，通过set对象即可进行相关设置
## set对象
* name_set(array),设置曲线的名称
* line_set(object),关于曲线的设置
* detial_set(object),详情窗口的设置
* zoom_set(object),缩放的设置
* coo_set(object),坐标轴的设置

### line_set对象
* color(array str),控制曲线颜色
* is_display(array bool),控制曲线是否显示
* thick(array int),控制曲线的粗细
	
### detial_set对象
	
* backgroundcolor(str),详情窗口的颜色
* tmd(float),窗口透明度
* size(int),显示数据大小

### zoom_set对象
* mode(int),1是滑轮缩放，2是鼠标选择，3是混合
* target(int),1是缩放x轴，2是缩放y轴，3是混合

### coo_set对象
* x_nums(int)x轴数量
* y_nums(int)y轴数量
* x_pos(array int)x轴曲线的位置
* y_pos(array int)y轴曲线的位置
* y_max(array int),y轴最大数
* x_ms(array int)，x的间隔数
* y_ms(array int)，y的间隔数
* x_color(array str)，x轴的颜色
* y_color(array str)，y轴的颜色
* x_names(array str)，x轴的名称
* y_names(array str)，y轴的名称
	
