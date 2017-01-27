var uri = window.location.href.split("#")[0];
var path_to_data = 'http://www.guidehabitation.ca/f1nd_request/f1nd_feed-03a.php?mode=json&ghid='+_ghid+'&group=all&key='+_key;

$.ajax({
	url: path_to_data,
	cache: false,
	dataType: "jsonp",
	success: function(data)
	{
		n = data.length;
		_html='';
		if(n > 0)
		{
			//hash vide, on charge sitemap si c'est le cas, sinon block
			_html='';
			_nav = '';
			if(!window.location.hash.length)
			{
				_html += getSitemap(data);
				if(_html=='')
				{
					_html += getBlock(data);
				}
			}
			else
			{
				_html = urlInterpreter(data, window.location.hash);
			}
			tabs = '<div><ul class="nav nav-tabs" role="tablist">';
			tabs+= '<li role="presentation" class="active active"><a id="tab" href="#f1nd" aria-controls="f1nd" role="tab" data-toggle="tab" aria-expanded="true">F1nd</a></li>';
			tabs+= getRoomsNumber(data);
			tabs+= '</ul></div>';
			tabsContent='';
			tabsContent+=tabs+'<div class="tab-content">';
			tabsContent+= '<div role="tabpanel" class="tab-pane active active" id="f1nd"><nav>'+getSelect(data)+'</nav>'+_html+'</div>';
			tabsContent+='<div role="tabpanel" class="tab-pane" id="list" aria-labelledby="list-tab"></div>';
			tabsContent+= '</div>';
			container.html(tabsContent);
			//container.append(getRoomsNumber(data));
			/*--------------------------------------------*/
			//search by rooms number

			$('.rooms-search a').click(function(e){
				//e.preventDefault();	
			})
			$('.dropdown-menu a').click(function(e){
				$('li[role=presentation]:first').removeClass('active')
				$('#list').html($(getAvailableUnitsbyRoomsNumber(data,$(this).attr('rooms'))));
				$('#search-results a').hover(function(){
					_link = $(this).attr('href');
					$.each($('area'),function(){
						if(_link.split("#")[1]==$(this).attr('href').replace('#',''))
						{
							var datamaphilight = {};
							datamaphilight.alwaysOn = true,
							datamaphilight.fillColor = '0000FF',
							datamaphilight.fillOpacity = '0.3',
							datamaphilight.strokeColor = 'ff0000',
							datamaphilight.strokeWidth = 2,
							datamaphilight.stroke = true,
							$(this).data('maphilight', datamaphilight).trigger('alwaysOn.maphilight');	
						}	
					});		
				},
				function(){
					$.each($('area'),function(){
						if(_link.split("#")[1]==$(this).attr('href').replace('#',''))
						{
							var datamaphilight = {};
							datamaphilight.alwaysOn = true,
							datamaphilight.fillColor = $(this).attr('available'),
							datamaphilight.fillOpacity = '0.1',
							datamaphilight.stroke = false,
							$(this).data('maphilight', datamaphilight).trigger('alwaysOn.maphilight');
						}
					})	
				})
				//$('#search-results').css({'position':'absolute','z-index':'10','background-color':'#ffffff','opacity':'0.9'});	
			})
			/*--------------------------------------------*/
			$('.chosen-select').on('change', function(e) 
			{
		    window.location = $(this).val();
  		});
			$("img[usemap]").mapTrifecta();
			
			//$('.chosen-container').chosen({'width':'500px'});
			$('img,canvas').css({
				'display': 'block',
	    	'max-width': '100%',
	    	'height': 'auto'	
			});
			$('canvas').css('margin','auto');
			$('map:first area').each(function(){
				var datamaphilight = {};
				datamaphilight.alwaysOn = true,
				datamaphilight.fillColor = $(this).attr('available'),
				datamaphilight.fillOpacity = '0.1',
				datamaphilight.stroke = false,
				$(this).data('maphilight', datamaphilight).trigger('alwaysOn.maphilight');	
			});
			$('area').hover(function(){
				var datamaphilight = {};
				datamaphilight.alwaysOn = true,
			  datamaphilight.fillColor = $(this).attr('available'),
			  datamaphilight.fillOpacity = '0.3',
			  datamaphilight.stroke = false,
				$(this).data('maphilight', datamaphilight).trigger('alwaysOn.maphilight')
			},function(){
					var datamaphilight = {};
					datamaphilight.alwaysOn = true,
			  	datamaphilight.fillColor = $(this).attr('available'),
			  	datamaphilight.fillOpacity = '0.1',
			  	datamaphilight.stroke = false,
					$(this).data('maphilight', datamaphilight).trigger('alwaysOn.maphilight')
				}
			);
			$('area').click(function(){
				window.location = uri+$(this).attr('href');
				window.location.reload(true);
			});
			$(window).on('hashchange', function(e){
  			window.location = uri+$(this).attr('href');
				window.location.reload(true);
			});
			//container.prepend("<link rel='stylesheet' type='text/css' href='css/chosen.min.css'/>");
			//hash vide, on charge sitemap si c'est le cas, sinon block
		}
	},
	error: function (request, status, error)
	{
		console.log(status + ", " + error);
	}
});
function getSitemap(data)
{
	element = '';
	if(data[0].site_map_jpg_path!='')
	{
		element+='<img src="'+data[0].site_map_jpg_path+'" usemap="#sitemap"/>';
		element+='<map name="sitemap">'+getCoordsSiteMap(data)+'</map>';
		return element;
	}
	else
	{
		return '';	
	}
}
function getBlock(data)
{
	current='';
	block = '';
	for(var i=0;i<n;i++)
	{
		if(data[i].block_id!=current)
		{
			_description =_lang=='fr'?data[i].block_description_fr:data[i].block_description_en;
			_name =_lang=='fr'?data[i].block_name_fr:data[i].block_name_en;
			block +='<img src="'+data[i].block_jpg_path+'" usemap="#block_'+data[i].block_id+'" longdesc="'+_description+'" name="'+_name+'"/>';
			block += '<map name="block_'+data[i].block_id+'">'+getCoordsBlock(data, data[i].block_id)+'</map>'; 
			current = data[i].block_id;	
		}
		return block;
	}	
}
function getBlockById(data, _id)
{
	block = '';
	for(var i=0;i<n;i++)
	{
		if(data[i].block_id==_id)
		{
			_description =_lang=='fr'?data[i].block_description_fr:data[i].block_description_en;
			_name =_lang=='fr'?data[i].block_name_fr:data[i].block_name_en;
			block +='<img src="'+data[i].block_jpg_path+'" usemap="#block_'+data[i].block_id+'" longdesc="'+_description+'" name="'+_name+'" parent="sitemap"/>';
			block += '<map name="block_'+data[i].block_id+'">'+getCoordsBlock(data, data[i].block_id)+'</map>';
			return block;
		}
	}
}
function getFloorById(data, _id)
{
	_floor = '';
	for(var i=0;i<n;i++)
	{
		if(data[i].floor_id==_id)
		{
			_description =_lang=='fr'?data[i].floor_description_fr:data[i].floor_description_en;
			_name =_lang=='fr'?data[i].floor_name_fr:data[i].floor_name_en;
			_floor +='<img src="'+data[i].floor_jpg_path+'" usemap="#floor_'+_id+'" longdesc="'+_description+'" name="'+_name+'" parent="block_'+data[i].block_id+'"/>';
			_floor +='<map name="floor_'+_id+'">'+getCoordsUnitsByFloor(data,_id)+'</map>'; 
			return _floor;	
		}
	}
}
function getUnitById(data, _id)
{
	_unit = '';
	for(var i=0;i<n;i++)
	{
		if(data[i].id==_id)
		{
			_description =_lang=='fr'?data[i].unit_description_fr:data[i].unit_description_en;
			_name =_lang=='fr'?data[i].unit_name_fr:data[i].unit_name_en;
			_unit +='<img src="'+data[i].jpg_path+'" usemap="#unit_'+_id+'" longdesc="'+_description+'" name="'+_name+'" parent="floor_'+data[i].floor_id+'"/>'; 
			return _unit;	
		}
	}
}
function getCoordsSiteMap(data)
{
	currentElement = false;
	for(var i=0;i < data.length;i++)
	{
		if(data[i].block_id != currentElement)
		{
			available = data[i].block_percent_sold=='100'?'FF0000':'00FF00';
			_html += '<area data-mapid="'+i*10000+'" shape="poly" title="'+data[i].block_name_fr+'" href="#block_'+data[i].block_id+'" coords="'+data[i].block_coords+'" rel="blocks" link="block_'+data[i].block_id+'" available="'+available+'"/>';
		}
		currentElement = data[i].block_id;
	}
	return _html;
}
function getCoordsBlock(data, block_id)
{
	_html ='';
	currentFloor = false;
	for(var i=0;i < n;i++)
	{
		if(block_id == data[i].block_id && currentFloor!=data[i].floor_id)
		{
			available = data[i].floor_percent_sold=='100'?'FF0000':'00FF00';
			_link =  data[i].floor_jpg_path!=''?'#floor_'+data[i].floor_id:'#unit_'+data[i].id; 
			_html += '<area data-mapid="'+data[i].floor_id*10000+'" shape="poly" title="'+data[i].floor_name_fr+'" href="'+_link+'" coords="'+data[i].floor_coords+'" rel="floors" link="floor_'+data[i].floor_id+'" available="'+available+'" data-toggle="tooltip" data-placement="left"/>';
		}
		currentFloor = data[i].floor_id;
	}
	return _html;	
}
function getCoordsUnitsByFloor(data,floor_id)
{
	_html ='';
	for(var i=0; i < n; i++)
	{
		if(parseInt(data[i].floor_id) == floor_id)
		{
			available = data[i].available=='1'?'00ff00':data[i].available_type=='2'?'ff0000':'c58100';
			_html += '<area data-mapid="'+i+'" shape="poly" title="'+data[i].unit_name_fr+' '+data[i].unit_available_fr+'" alt="'+data[i].unit_name_fr+'" href="#unit_'+data[i].id+'" coords="'+data[i].unit_coords+'" available="'+available+'" rel="units"/>';
		}
	}
	return _html;	
}

function getSelect(data)
{
	sel='';
	elementType = window.location.hash.split('_')[0].replace('#','');
	elementId = window.location.hash.split('_')[1];
	current=false;
	sel+='<div class="navbar navbar-default" role="navigation">';
	sel+='<ul class="nav navbar-nav">';
	for(i=0;i<n;i++)
	{
		if((elementType=='sitemap' || elementType==''))
		{
			if(data[i].project_id!=current)
			{
				sel+='<li><a href="'+uri+'">'+data[i].project_name+'</a></li>';
				current=data[i].project_id;
			}
		}
		if((elementType=='block' || elementType=='') && data[i].block_id!=current)
		{
			if(data[i].block_id==elementId)
			{
				if(data[i].site_map_jpg_path!='')
				{
					sel+='<li><a href="'+uri+'">'+data[i].project_name+'</a></li>';
				}
				sel+='<li class="dropdown">';
				sel+='<a data-target="#" href="http://example.com" id="dLabel" class="dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+data[i].block_name_fr+'<span class="caret"></span></a>';
				sel+='<ul class="dropdown-menu" aria-labelledby="dLabel">';
				sel+=getOptionBlocks(data,data[i].block_id);
				sel+='</ul>';
				sel+='</li>';
				current=data[i].block_id;
			}
		}
		if(elementType=='floor' && data[i].floor_id==elementId)
		{
			if(data[i].floor_id!=current)
			{
				if(data[i].site_map_jpg_path!='')
					sel+='<li><a href="'+uri+'">'+data[i].project_name+'</a></li>';
				sel+='<li class="dropdown">';
				sel+='<a data-target="#" href="http://example.com" id="dLabel" class="dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+data[i].block_name_fr+'<span class="caret"></span></a>';
				sel+='<ul class="dropdown-menu" aria-labelledby="dLabel">';
				sel+=getOptionBlocks(data,data[i].block_id);
				sel+='</ul>';
				sel+='</li>';
				
				sel+='<li class="dropdown">';
				sel+='<a data-target="#" href="http://example.com" id="dLabel" class="dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+data[i].floor_name_fr+'<span class="caret"></span></a>';
				sel+='<ul class="dropdown-menu" aria-labelledby="dLabel">';
				sel+=getOptionFloorsByBlockId(data,data[i].block_id,data[i].floor_id);
				sel+='</ul>';
				sel+='</li>';
				current=data[i].floor_id;
			}
		}
		if(elementType=='unit' && data[i].id==elementId)
		{
			if(data[i].id!=current)
			{
				if(data[i].site_map_jpg_path!='')
					sel+='<li><a href="'+uri+'">'+data[i].project_name+'</a></li>';
				sel+='<li class="dropdown">';
				sel+='<a data-target="#" href="http://example.com" id="dLabel" class="dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+data[i].block_name_fr+'<span class="caret"></span></a>';
				sel+='<ul class="dropdown-menu" aria-labelledby="dLabel">';
				sel+=getOptionBlocks(data,data[i].block_id);
				sel+='</ul>';
				sel+='</li>';
				

				sel+='<li class="dropdown">';
				sel+='<a data-target="#" href="http://example.com" id="dLabel" class="dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+data[i].floor_name_fr+'<span class="caret"></span></a>';
				sel+='<ul class="dropdown-menu" aria-labelledby="dLabel">';
				sel+=getOptionFloorsByBlockId(data,data[i].block_id,data[i].floor_id);
				sel+='</ul>';
				sel+='</li>';
				
				
				sel+='<li class="dropdown">';
				sel+='<a data-target="#" href="http://example.com" id="dLabel" class="dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+data[i].unit_name_fr+'<span class="caret"></span></a>';
				sel+='<ul class="dropdown-menu" aria-labelledby="dLabel">';
				sel+=getOptionUnitsByFloorId(data,data[i].floor_id,data[i].id);
				sel+='</ul>';
				sel+='</li>';
				current=data[i].id;
			}
		}
	}
	
	sel+='</ul>';
	sel+='</div>';
	return sel;
}
function getAvailableUnitsbyRoomsNumber(data,nbr_rooms)
{
	$('#search-results').remove();
	unitsByRoomsNumber='';
	unitsByRoomsNumber+='<table id="search-results" class="table table-striped">';
	unitsByRoomsNumber+='<th>Unité</th><th>Phase</th><th>Étage</th><th>Nombre de chambres</th><th>Prix</th>';
	for(i=0;i<n;i++)
	{
		if(data[i].available==1 && data[i].nbr_room_fr==nbr_rooms)
		{
			unitsByRoomsNumber+='<tr class=""><td class=""><a href="'+uri+'#unit_'+data[i].id+'">'+data[i].unit_name_fr+'</a></td> <td class=""><a href="'+uri+'#block_'+data[i].block_id+'">'+data[i].block_name_fr+'</a></td> <td><a href="'+uri+'#floor_'+data[i].floor_id+'">'+data[i].floor_name_fr+'</a></td> <td class="">'+data[i].nbr_room_fr+'</td> <td class="">'+data[i].price+'</td></tr>';	
		}
	}
	unitsByRoomsNumber+='</table>';
	return unitsByRoomsNumber;
}
function getRoomsNumber(data)
{
	rooms='';
	//rooms+='<ul class="list-inline">';
	c=false;
	arr = new Array();
	spl = data[0].rooms_array;
	arr = spl.split("|");
	rooms+='<li class="dropdown rooms-search" role="presentation">';
	rooms+='<a data-target="#" href="http://example.com" id="dLabel" class="dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Nombre de chambres<span class="caret"></span></a>';
	rooms+='<ul class="dropdown-menu" aria-labelledby="dLabel">';
	for(var j=0;j<arr.length;j++)
	{
		nbr='';
		cr=false;
		carr=false;
		for(var k=0;k<n;k++)
		{
			if(data[k].id!=cr)
			{
				if(data[k].nbr_room_fr==arr[j] && data[k].available==1 && carr!=arr[j])
				{
					nbr+=arr[j];
					carr=arr[j];	
				}
				cr=data[k].id;
			}
			
		}	
		rooms +='<li><a href="#list" rooms="'+nbr+'" aria-controls="list" data-toggle="tab" id="list-tab" role="tab" aria-expanded="false">'+nbr+'</a></li>';	
	}
	rooms+='</ul>';
	rooms+='</li>';
	//rooms+='</ul>';
	return rooms;
}
function getOptionBlocks(data,block_id)
{
	optb='';
	c=false;
	for(l=0;l<n;l++)
	{
		if(data[l].block_id!=block_id && c!=data[l].block_id)
		{
			optb+='<li><a href="'+uri+'#block_'+data[l].block_id+'">'+data[l].block_name_fr+'</a></li>';
			c=data[l].block_id;
		}	
	}
	if(optb=='')
		optb +='<li><a href="'+uri+'#block_'+block_id+'">'+data[0].block_name_fr+'</a></li>';
	return optb;
}
function getOptionFloorsByBlockId(data,block_id,floor_id)
{
	optf='';
	c=false;
	for(k=0;k<n;k++)
	{
		if(data[k].block_id==block_id && data[k].floor_id!=floor_id && c!=data[k].floor_id)
		{
			optf+='<li><a href="'+uri+'#floor_'+data[k].floor_id+'">'+data[k].floor_name_fr+'</a></li>';
			c=data[k].floor_id;	
		}	
	}
	return optf;	
}
function getOptionUnitsByFloorId(data,floor_id, unit_id)
{
	opt='';
	for(j=0;j<n;j++)
	{
		if(data[j].floor_id==floor_id && data[j].id!=unit_id)
		{
			opt+='<li><a href="'+uri+'#unit_'+data[j].id+'">'+data[j].unit_name_fr+'</a></li>';	
		}	
	}
	return opt;
}
function getBackNavigation()
{
	container.append('<div class="back"><=Back</div>');
	$('.back').css({
		'position' 	: 'absolute',
		'z-index'		: '10',
		'font-size'	:	'3.0vh',
		'margin-top': '-1em',
		'color'			: 'red'
	});
	$('.back').click(function()
	{
		history.back();
	});		
}
function urlInterpreter(data, hash)
{
	hash = hash.replace('#','');
	array = hash.split('_');
	el = array[0];
	switch(el) {
    case 'sitemap':
			id = array[1];
    	element = getSitemap(data);
    	break;
    case 'block':
    	element = getBlockById(data,array[1]);
    	break;
    case 'floor':
    	element = getFloorById(data,array[1]);
    	break;
    case 'unit':
    	element = getUnitById(data, array[1]);
    	break;
    default:
    	element = getBlockById(data,array[1]);
    	break;
	}
	return element;
}

//variables maphilight
var _fill						= true;
var _fillColor			= '00FF00';
var _fillOpacity		= 0.1;
var _stroke					= true;
var _strokeColor		=	'00FF00';
var _strokeOpacity	= 1;
var _strokeWidth		= 1;
var _fade						= true;
var _alwaysOn				= false;
var _neverOn				= false;
var _groupBy				= false;
var _wrapClass			= false;                  	
var _shadow					= false;
var _shadowX				= 0;
var _shadowY				= 0;
var _shadowRadius		= 10;
var _shadowColor		= '000000';
var _shadowOpacity	= 0.8;
var _shadowPosition	= 'outside';
var _shadowFrom			= false;

// Allows Image Maps to be used in a Responsive Design, with Hilighting, and Zooming capabilities
// Global Var
var $imageMap;

/*
* rwdImageMaps jQuery plugin v1.4
*
* Allows image maps to be used in a responsive design by recalculating the area coordinates to match the actual image size on load and window.resize
*
* Copyright (c) 2012 Matt Stow
* https://github.com/stowball/jQuery-rwdImageMaps
* http://mattstow.com
* Licensed under the MIT license
* 
* Edited By: Nicholas S Wilhelm
* Added setTimeout(rwdImageMap, 500);
* 
*/
(function ($) {
    $.fn.rwdImageMaps = function () {
        var $img = this,
		version = parseFloat($.fn.jquery);

        var rwdImageMap = function () {

            $img.each(function () {
                if (typeof ($(this).attr('usemap')) == 'undefined')
                    return;

                var that = this,
				$that = $(that);

                // Since WebKit doesn't know the height until after the image has loaded, perform everything in an onload copy
                $('<img />').load(function () {
                    var w,
					h,
					attrW = 'width',
					attrH = 'height';

                    // jQuery < 1.6 incorrectly uses the actual image width/height instead of the attribute's width/height
                    if (version < 1.6)
                        w = that.getAttribute(attrW),
						h = that.getAttribute(attrH);
                    else
                        w = $that.attr(attrW),
						h = $that.attr(attrH);

                    if (!w || !h) {
                        var temp = new Image();
                        temp.src = $that.attr('src');
                        if (!w)
                            w = temp.width;
                        if (!h)
                            h = temp.height;
                    }

                    var wPercent = $that.width() / 100,
					hPercent = $that.height() / 100,
					map = $that.attr('usemap').replace('#', ''),
					c = 'coords';

                    $('map[name="' + map + '"]').find('area').each(function () {
                        var $this = $(this);
                        if (!$this.data(c))
                            $this.data(c, $this.attr(c));

                        var coords = $this.data(c).split(','),
						coordsPercent = new Array(coords.length);

                        for (var i = 0; i < coordsPercent.length; ++i) {
                            if (i % 2 === 0)
                                coordsPercent[i] = parseInt(((coords[i] / w) * 100) * wPercent);
                            else
                                coordsPercent[i] = parseInt(((coords[i] / h) * 100) * hPercent);
                        }
                        $this.attr(c, coordsPercent.toString());
                    });

                }).attr('src', $that.attr('src'));
            });
        };

        $(window).resize(rwdImageMap).trigger('resize');
        setTimeout(rwdImageMap, 500);

        return this;
    };
})(jQuery);

// Edited By: Nicholas S Wilhelm
// Edited wrap, img and margin_left
// maphilight
(function ($) {
    var has_VML, has_canvas, create_canvas_for, add_shape_to, clear_canvas, shape_from_area,
	canvas_style, hex_to_decimal, css3color, is_image_loaded, options_from_area;

    var margin_left;

    has_canvas = !!document.createElement('canvas').getContext;


    // VML: more complex
    has_VML = (function () {
        var a = document.createElement('div');
        a.innerHTML = '<v:shape id="vml_flag1" adj="1" />';
        var b = a.firstChild;
        b.style.behavior = "url(#default#VML)";
        return b ? typeof b.adj == "object" : true;
    })();

    if (!(has_canvas || has_VML)) {
        $.fn.maphilight = function () { return this; };
        return;
    }

    if (has_canvas) {
        hex_to_decimal = function (hex) {
            return Math.max(0, Math.min(parseInt(hex, 16), 255));
        };

        css3color = function (color, opacity) {
            return 'rgba(' + hex_to_decimal(color.substr(0, 2)) + ',' + hex_to_decimal(color.substr(2, 2)) + ',' + hex_to_decimal(color.substr(4, 2)) + ',' + opacity + ')';
        };


        //create the canvas where we'll draw the area shapes
        create_canvas_for = function (img) {

            // Get margin-left Edited from original
            margin_left = $imageMap[0].offsetLeft + "px";
            //var c = $('<canvas style="display: block; margin-left:' + margin_left + '; position: absolute; width:' + img.width + 'px;height:' + img.height + 'px;"></canvas>').get(0);
						var c = $('<canvas style="display: block; position: absolute; width:' + img.width + 'px;height:' + img.height + 'px;"></canvas>').get(0);
            c.width = img.width;
            c.height = img.height;
            c.getContext("2d").clearRect(0, 0, img.width, img.height);
            return c;
        };

        var draw_shape = function (context, shape, coords, x_shift, y_shift) {
            x_shift = x_shift || 0;
            y_shift = y_shift || 0;
            context.beginPath();
            if (shape == 'rect') {
                // x, y, width, height
                context.rect(coords[0] + x_shift, coords[1] + y_shift, coords[2] - coords[0], coords[3] - coords[1]);
            } else if (shape == 'poly') {

                context.moveTo(coords[0] + x_shift, coords[1] + y_shift);
                //context.moveTo(coords[0] , coords[1]);
                for (i = 2; i < coords.length; i += 2) {
                    //context.lineTo(coords[i] + x_shift, coords[i+1] + y_shift);
                    context.lineTo(coords[i], coords[i + 1]);
                }
            } else if (shape == 'circ') {
                // x, y, radius, startAngle, endAngle, anticlockwise
                context.arc(coords[0] + x_shift, coords[1] + y_shift, coords[2], 0, Math.PI * 2, false);
            }
            context.closePath();
        }

        add_shape_to = function (canvas, shape, coords, options, name) {
            var i, context = canvas.getContext('2d');

            // Because I don't want to worry about setting things back to a base state

            // Shadow has to happen first, since it's on the bottom, and it does some clip /
            // fill operations which would interfere with what comes next.

            if (options.shadow) {
                context.save();
                if (options.shadowPosition == "inside") {
                    // Cause the following stroke to only apply to the inside of the path
                    draw_shape(context, shape, coords);
                    context.clip();
                }

                // Redraw the shape shifted off the canvas massively so we can cast a shadow
                // onto the canvas without having to worry about the stroke or fill (which
                // cannot have 0 opacity or width, since they're what cast the shadow).
                var x_shift = canvas.width * 100;
                var y_shift = canvas.height * 100;
                draw_shape(context, shape, coords, x_shift, y_shift);

                context.shadowOffsetX = options.shadowX - x_shift;
                context.shadowOffsetY = options.shadowY - y_shift;
                context.shadowBlur = options.shadowRadius;
                context.shadowColor = css3color(options.shadowColor, options.shadowOpacity);

                // Now, work out where to cast the shadow from! It looks better if it's cast
                // from a fill when it's an outside shadow or a stroke when it's an interior
                // shadow. Allow the user to override this if they need to.
                var shadowFrom = options.shadowFrom;
                if (!shadowFrom) {
                    if (options.shadowPosition == 'outside') {
                        shadowFrom = 'fill';
                    } else {
                        shadowFrom = 'stroke';
                    }
                }
                if (shadowFrom == 'stroke') {
                    context.strokeStyle = "rgba(0,0,0,1)";
                    context.stroke();
                } else if (shadowFrom == 'fill') {
                    context.fillStyle = "rgba(0,0,0,1)";
                    context.fill();
                }
                context.restore();

                // and now we clean up
                if (options.shadowPosition == "outside") {
                    context.save();
                    // Clear out the center
                    draw_shape(context, shape, coords);
                    context.globalCompositeOperation = "destination-out";
                    context.fillStyle = "rgba(0,0,0,1);";
                    context.fill();
                    context.restore();
                }
            }


            context.save();

            draw_shape(context, shape, coords);

            // fill has to come after shadow, otherwise the shadow will be drawn over the fill,
            // which mostly looks weird when the shadow has a high opacity
            if (options.fill) {
                context.fillStyle = css3color(options.fillColor, options.fillOpacity);
                context.fill();
            }

            // Likewise, stroke has to come at the very end, or it'll wind up under bits of the
            // shadow or the shadow-background if it's present.
            if (options.stroke) {
                context.strokeStyle = css3color(options.strokeColor, options.strokeOpacity);
                context.lineWidth = options.strokeWidth;
                context.stroke();
            }

            context.restore();

            if (options.fade) {

                $(canvas).css('opacity', 0).animate({ opacity: 1 }, 100);
            }
        };


        clear_canvas = function (canvas) {
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        };


    }
    else { // ie executes this code
        create_canvas_for = function (img) {
            //return $('<var style="display:block;width:' + img.width + 'px;height:' + img.height + 'px;position:absolute; margin-left:' + margin_left + 'px;"></var>').get(0);
            return $('<var style="display:block;width:' + img.width + 'px;height:' + img.height + 'px;position:absolute;"></var>').get(0);
            console.log('create ie8 canvas');
        };
        add_shape_to = function (canvas, shape, coords, options, name) {
            var fill, stroke, opacity, e;
            fill = '<v:fill color="#' + options.fillColor + '" opacity="' + (options.fill ? options.fillOpacity : 0) + '" />';
            stroke = (options.stroke ? 'strokeweight="' + options.strokeWidth + '" stroked="t" strokecolor="#' + options.strokeColor + '"' : 'stroked="f"');
            opacity = '<v:stroke opacity="' + options.strokeOpacity + '"/>';
            if (shape == 'rect') {
                e = $('<v:rect name="' + name + '" filled="t" ' + stroke + ' style="zoom:1;margin:0;padding:0;display:block;position:absolute;left:' + coords[0] + 'px;top:' + coords[1] + 'px;width:' + (coords[2] - coords[0]) + 'px;height:' + (coords[3] - coords[1]) + 'px;"></v:rect>');
            } else if (shape == 'poly') {
                e = $('<v:shape name="' + name + '" filled="t" ' + stroke + ' coordorigin="0,0" coordsize="' + canvas.width + ',' + canvas.height + '" path="m ' + coords[0] + ',' + coords[1] + ' l ' + coords.join(',') + ' x e" style="zoom:1;margin:0;padding:0;display:block;position:absolute;top:0px;left:0px;width:' + canvas.width + 'px;height:' + canvas.height + 'px;"></v:shape>');
            } else if (shape == 'circ') {
                e = $('<v:oval name="' + name + '" filled="t" ' + stroke + ' style="zoom:1;margin:0;padding:0;display:block;position:absolute;left:' + (coords[0] - coords[2]) + 'px;top:' + (coords[1] - coords[2]) + 'px;width:' + (coords[2] * 2) + 'px;height:' + (coords[2] * 2) + 'px;"></v:oval>');
            }
            e.get(0).innerHTML = fill + opacity;
            $(canvas).append(e);
        };
        clear_canvas = function (canvas) {
            $(canvas).find('[name=highlighted]').remove();
        };
    }

    shape_from_area = function (area) {
        var i, coords = area.getAttribute('coords').split(',');
        for (i = 0; i < coords.length; i++) {
            coords[i] = parseFloat(coords[i]);
        }
        return [area.getAttribute('shape').toLowerCase().substr(0, 4), coords];
    };

    options_from_area = function (area, options) {
        var $area = $(area);
        return $.extend({}, options, $.metadata ? $area.metadata() : false, $area.data('maphilight'));
    };

    is_image_loaded = function (img) {
        if (!img.complete) { return false; } // IE
        if (typeof img.naturalWidth != "undefined" && img.naturalWidth === 0) { return false; } // Others

        return true;
    };

    /*
	canvas_style = {
		position: 'absolute',
		left: 0,
		top: 0,
		padding: 0,
		border: 0
	};
	*/
    canvas_style = {};

    var ie_hax_done = false;
    $.fn.maphilight = function (opts) {
        opts = $.extend({}, $.fn.maphilight.defaults, opts);

        if (!has_canvas && !ie_hax_done) {
            document.namespaces.add("v", "urn:schemas-microsoft-com:vml");
            var style = document.createStyleSheet();
            var shapes = ['shape', 'rect', 'oval', 'circ', 'fill', 'stroke', 'imagedata', 'group', 'textbox'];
            $.each(shapes,
				function () {
				    style.addRule('v\\:' + this, "behavior: url(#default#VML); antialias:true");
				}
			);
            ie_hax_done = true;
        }

        return this.each(function () {
            var img, wrap, options, map, canvas, canvas_always, mouseover, highlighted_shape, usemap;
            img = $(this);

            if (!is_image_loaded(this)) {
                // If the image isn't fully loaded, this won't work right. Try again later.
                return window.setTimeout(function () {
                    img.maphilight(opts);
                }, 200);
            }

            options = $.extend({}, opts, $.metadata ? img.metadata() : false, img.data('maphilight'));

            // jQuery bug with Opera, results in full-url#usemap being returned from jQuery's attr.
            // So use raw getAttribute instead.
            usemap = img.get(0).getAttribute('usemap');

            if (!usemap) {
                return
            }

            map = $('map[name="' + usemap.substr(1) + '"]');

            if (!(img.is('img,input[type="image"]') && usemap && map.size() > 0)) {
                return;
            }

            if (img.hasClass('maphilighted')) {
                // We're redrawing an old map, probably to pick up changes to the options.
                // Just clear out all the old stuff.
                //console.log('has class maphilighted');
                var wrapper = img.parent();
                img.insertBefore(wrapper);
                wrapper.remove();
                $(map).unbind('.maphilight').find('area[coords]').unbind('.maphilight');
            }

            // Edited from original
            wrap = $('<div></div>').css({
                display: 'block',
                position: 'relative',
                //marginLeft: 'auto',
                //marginRight: 'auto',
                'background-image': 'url("' + this.src + '")',
                'background-repeat': 'no-repeat',
                'background-size': 'contain',
                //'background-position': '50%, 50%',
                width: '100%'
            });

            wrap.addClass('map').addClass('maphilighted');

            if (options.wrapClass) {
                if (options.wrapClass === true) {
                    wrap.addClass($(this).attr('class'));
                } else {
                    wrap.addClass(options.wrapClass);
                }
            }

            // Get margin-left, Edited from original
            margin_left = $imageMap[0].offsetLeft + "px";

            img.before(wrap).css('opacity', 1).css(canvas_style).remove();
            if (has_VML) {
                //img.css('filter', 'Alpha(opacity=1)'); 
            }
            wrap.append(img);

            canvas = create_canvas_for(this);
            $(canvas).css(canvas_style);
            //canvas.height = this.height;
            //canvas.width = this.width;

            mouseover = function (e) {

                var shape, area_options;
                area_options = options_from_area(this, options);
                if (
				!area_options.neverOn
				&&
				!area_options.alwaysOn
				) {
                    shape = shape_from_area(this);

                    add_shape_to(canvas, shape[0], shape[1], area_options, "highlighted");

                    if (area_options.groupBy) {
                        var areas;
                        // two ways groupBy might work; attribute and selector
                        if (/^[a-zA-Z][\-a-zA-Z]+$/.test(area_options.groupBy)) {
                            areas = map.find('area[' + area_options.groupBy + '="' + $(this).attr(area_options.groupBy) + '"]');
                        } else {
                            areas = map.find(area_options.groupBy);
                        }
                        var first = this;
                        areas.each(function () {
                            if (this != first) {
                                var subarea_options = options_from_area(this, options);
                                if (!subarea_options.neverOn && !subarea_options.alwaysOn) {
                                    var shape = shape_from_area(this);
                                    add_shape_to(canvas, shape[0], shape[1], subarea_options, "highlighted");
                                }
                            }
                        });
                    }


                    // workaround for IE7, IE8 not rendering the final rectangle in a group
                    if (!has_canvas) {
                        $(canvas).append('<v:rect></v:rect>');
                    }
                }
            }



            $(map).bind('alwaysOn.maphilight', function () {
                // Check for areas with alwaysOn set. These are added to a *second* canvas,
                // which will get around flickering during fading.
                if (canvas_always) {
                    clear_canvas(canvas_always);
                }
                if (!has_canvas) {
                    $(canvas).empty();
                }
                $(map).find('area[coords]').each(function () {
                    var shape, area_options;
                    area_options = options_from_area(this, options);
                    if (area_options.alwaysOn) {
                        if (!canvas_always && has_canvas) {
                            canvas_always = create_canvas_for(img[0]);
                            $(canvas_always).css(canvas_style);
                            canvas_always.width = img[0].width;
                            canvas_always.height = img[0].height;
                            img.before(canvas_always);
                        }
                        area_options.fade = area_options.alwaysOnFade; // alwaysOn shouldn't fade in initially
                        shape = shape_from_area(this);
                        if (has_canvas) {
                            add_shape_to(canvas_always, shape[0], shape[1], area_options, "");
                        } else {
                            add_shape_to(canvas, shape[0], shape[1], area_options, "");
                        }
                    }
                });
            });



            $(map).trigger('alwaysOn.maphilight').find('area[coords]')
			.bind('mouseover.maphilight', mouseover)
			.bind('mouseout.maphilight', function (e) { clear_canvas(canvas); });

            //img.before(canvas); // if we put this after, the mouseover events wouldn't fire.

            // Edited from original
            img.css("opacity", "0")
                .css("display", "block")
                //.css("margin-left", "auto")
                //.css("margin-right", "auto")
                .css("position", "relative")
                .css("", "")
                .addClass('map')
                .addClass('maphilighted');
        });
    };

		
    $.fn.maphilight.defaults = {
        fill: 					_fill,					
        fillColor: 			_fillColor,			
        fillOpacity:		_fillOpacity,		
        stroke: 				_stroke,					
        strokeColor:		_strokeColor,		
        strokeOpacity:	_strokeOpacity,	
        strokeWidth:		_strokeWidth,		
        fade: 					_fade,						
        alwaysOn: 			_alwaysOn,				
        neverOn: 				_neverOn,				
        groupBy: 				_groupBy,				
        wrapClass: 			_wrapClass,           	
        shadow: 				_shadow,					
        shadowX: 				_shadowX,				
        shadowY: 				_shadowY,				
        shadowRadius: 	_shadowRadius,		
        shadowColor: 		_shadowColor,		
        shadowOpacity:	_shadowOpacity,	
        shadowPosition:	_shadowPosition, 
        shadowFrom: 		_shadowFrom		

    };
})(jQuery);

/*
* Zoom 1.7.13
* license: MIT
* http://www.jacklmoore.com/zoom
*
* Edited By: Nicholas S Wilhelm
* Added dblclick
*/
(function ($) {
    var defaults = {
        url: false,
        callback: false,
        target: false,
        duration: 120,
        on: 'dblclick', // other options: grab, click, toggle
        touch: true,
        onZoomIn: false,
        onZoomOut: false,
        magnify: 1.3
    };

    // Core Zoom Logic, independent of event listeners.
    $.zoom = function (target, source, img, magnify) {
        var targetHeight,
			targetWidth,
			sourceHeight,
			sourceWidth,
			xRatio,
			yRatio,
			offset,
			position = $(target).css('position'),
			$source = $(source);

        // The parent element needs positioning so that the zoomed element can be correctly positioned within.
        target.style.position = /(absolute|fixed)/.test(position) ? position : 'relative';
        target.style.overflow = 'hidden';

        img.style.width = img.style.height = '';

        $(img)
			.addClass('zoomImg')
			.css({
			    position: 'absolute',
			    top: 0,
			    left: 0,
			    opacity: 0,
			    width: img.width * magnify,
			    height: img.height * magnify,
			    border: 'none',
			    maxWidth: 'none',
			    maxHeight: 'none',
			    display: 'none'
			})
			.appendTo(target);

        return {
            init: function () {
                targetWidth = $(target).outerWidth();
                targetHeight = $(target).outerHeight();

                if (source === target) {
                    sourceWidth = targetWidth;
                    sourceHeight = targetHeight;
                } else {
                    sourceWidth = $source.outerWidth();
                    sourceHeight = $source.outerHeight();
                }

                xRatio = (img.width - targetWidth) / sourceWidth;
                yRatio = (img.height - targetHeight) / sourceHeight;

                offset = $source.offset();
            },
            move: function (e) {
                var left = (e.pageX - offset.left),
					top = (e.pageY - offset.top);

                top = Math.max(Math.min(top, sourceHeight), 0);
                left = Math.max(Math.min(left, sourceWidth), 0);

                img.style.left = (left * -xRatio) + 'px';
                img.style.top = (top * -yRatio) + 'px';
            }
        };
    };

    $.fn.zoom = function (options) {
        return this.each(function () {
            var
			settings = $.extend({}, defaults, options || {}),
			//target will display the zoomed image
			target = settings.target || this,
			//source will provide zoom location info (thumbnail)
			source = this,
			$source = $(source),
			img = document.createElement('img'),
			$img = $(img),
			mousemove = 'mousemove.zoom',
			clicked = false,
			touched = false,
			$urlElement;

            // If a url wasn't specified, look for an image element.
            if (!settings.url) {
                $urlElement = $source.find('img');
                if ($urlElement[0]) {
                    settings.url = $urlElement.data('src') || $urlElement.attr('src');
                }
                if (!settings.url) {
                    return;
                }
            }

            (function () {
                var position = target.style.position;
                var overflow = target.style.overflow;

                $source.one('zoom.destroy', function () {
                    $source.off(".zoom");
                    target.style.position = position;
                    target.style.overflow = overflow;
                    $img.remove();
                });

            }());

            img.onload = function () {
                var zoom = $.zoom(target, source, img, settings.magnify);

                function start(e) {
                    $("#toZoom").addClass("zoom");
                    $('.zoomImg').css("display", "block");
                    zoom.init();
                    zoom.move(e);

                    // Skip the fade-in for IE8 and lower since it chokes on fading-in
                    // and changing position based on mousemovement at the same time.
                    $img.stop()
					.fadeTo($.support.opacity ? settings.duration : 0, 1, $.isFunction(settings.onZoomIn) ? settings.onZoomIn.call(img) : false);
                }

                function stop() {

                    $img.stop()
					.fadeTo(settings.duration, 0, $.isFunction(settings.onZoomOut) ? settings.onZoomOut.call(img) : false);

                    setTimeout(function () { $('.zoomImg').css("display", "none"); $("#toZoom").removeClass("zoom"); }, 250);

                }

                // Mouse events
                if (settings.on === 'dblclick') {
                    $source.on('dblclick.zoom',
						function (e) {
						    if (clicked) {
						        // bubble the event up to the document to trigger the unbind.
						        return;
						    } else {
						        clicked = true;
						        start(e);
						        $(document).on(mousemove, zoom.move);
						        $(document).one('dblclick.zoom',
									function () {
									    stop();
									    clicked = false;
									    $(document).off(mousemove, zoom.move);
									}
								);
						        return false;
						    }
						}
					);
                }

                if ($.isFunction(settings.callback)) {
                    settings.callback.call(img);
                }
            };

            img.src = settings.url;
        });
    };

    $.fn.zoom.defaults = defaults;
}(jQuery));


var partsArr = [];

// Created By: Nicholas S Wilhelm
// Sets up Responsive, Hilight for Map & Table
(function ($) {
    $.fn.setMapTable = function () {

        // Hilight table row on area part hover
        $('area').hover(function () {

            var id = $(this).attr('data-mapid');
            selectRowAndPart(id, true);

        },
              function () {

                  var id = $(this).attr('data-mapid');
                  var isSelected = $.inArray(id, partsArr);
                  if (isSelected == -1) {
                      selectRowAndPart(id, false);
                  }
              }
            );

        // Hilight area part on table row hover
        $('tr').hover(function () {

            var id = $(this).attr('data-mapid');
            var data = $("area[data-mapid=" + id + "]").data('maphilight');

            if (data === undefined || !data.alwaysOn) {
                selectRowAndPart(id, true);
            }
        },
              function () {

                  var id = $(this).attr('data-mapid');
                  var isSelected = $.inArray(id, partsArr);
                  if (isSelected == -1) {
                      selectRowAndPart(id, false);
                  }
              }
            );

        // Remove All Selected Rows And Parts
        $('html').on('click', function (e) {
            var target = $(e.target);

            if (!e.ctrlKey) {
                if (!target.is('a') && !target.is('td') && !target.is('h1') && !target.is('h4')) {
                    // empty
                    removeAllSelectedRowsAndParts();
                    partsArr = [];
                }
            }
        });

        // Hilight and keep selected
        $('area, tr').on('click', function (e) {
            var id = $(this).attr('data-mapid');

            if (e.ctrlKey) {
                // Add to Array, multiple selection
                partsArr.push(id);
                selectRowAndPart(id, true);
            }
            else {
                // Remove all rom Array, singular selection
                removeAllSelectedRowsAndParts();
                selectRowAndPart(id, true);

                partsArr = [];
                partsArr.push(id);
            }

            return false;
        });

    };
})(jQuery);

function removeAllSelectedRowsAndParts() {
    for (var i = 0; i < partsArr.length; i++) {
        selectRowAndPart(partsArr[i], false);
    }

}
function selectRowAndPart(id, select) {
    // select Row
    //console.log(select)
    if (select) {
        $("table tr[data-mapid=" + id + "]").css("background-color", "yellow");
    }
    else {
        $("table tr[data-mapid=" + id + "]").css("background-color", "transparent");
    }

    // Select Part
    //$("area[data-mapid=" + id + "]").data('maphilight', { alwaysOn: select }).trigger('alwaysOn.maphilight'); // add/remove one

}


// Created By: Nicholas S Wilhelm
// Sets up Responsive, Hilight, Zoom
(function ($) {
  $.fn.mapTrifecta = function () {
    $imageMap = this;
    
		$imageMap.maphilight();
		$imageMap.rwdImageMaps();
    // Set up Zoom
    //$imageMap.parent().wrap("<span id='toZoom' class='zoom'></span>");
    //$('#toZoom').zoom({ on: 'dblclick' }).removeClass("zoom");

    // Fix Zoom width
    //var width = $imageMap.width();
    //$('#toZoom').width(width);

    // Set up Table
    $().setMapTable();
    return this;
  };
  //$(".chosen-select").chosen({'width':'100%'});
})(jQuery);


// This keeps the Hilight moving with the Image Map during browser resizing
jQuery(window).bind('resize', function (e) {
  window.resizeEvt;
  jQuery(window).resize(function () {
  	clearTimeout(window.resizeEvt);
  	window.resizeEvt = setTimeout(function () {
      //var width = $imageMap.width();
      //$('#toZoom').width(width);
			$imageMap.maphilight();
  	}, 10);
  });
});