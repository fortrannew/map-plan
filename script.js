class lcp_map_plan {
  constructor() {
    // красная точка на карте
    this.img_marker_red='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAIGNIUk0AAHolAACAgwAA+f8AAIDoAABSCAABFVgAADqXAAAXb9daH5AAAAI2SURBVHjapJY9aBVBFIW/XZLg4yVRMSm0s1ALUfAXgmATeETEn9iIYtDCLiBipSiksrESAgqKCBZaJESwEFEQxSRYBEkVsRBRFDEEU2gMJvqOzSwsw/xtfHB5u3vPnDM7e+fcyUTSbz2wE9gEdAFN4BvwFpgGvscIWiL5VqAB9AM9wAagBgj4BXwAxoERYCLIJH8cEUwJlBiPBXt8fK6HrYLhCgLlWBScTxFqE4ytUKQcV2NCtyME781yvhF8imAHfULHA4MeCPYJagabCToEhwTPA8u4zRaqm9na4AUzASJx2SP2yBY67QAtC/oTRIoYcnD8FewohNoETxygWxZRh+CS4JnBDwpaSvlM8NpTGHUEWwWzjiXbXCLpFIw7SEbNdihwxxyYV4K9CI4KmlZy0nqbK4FCOVnCrRHMWfkvgoHceFdmGcasdd8ImEtf6XoRmLfy7UB3nuap/KmQc/l0lhvntZNd1v1YQKicqwFrrfwCMIdgu2Ndfwg2WtY04vg+161vediBmRT0IFhlSjZGkglOCO4IbgoOOvaSqzKvCToLwFkH4LegUWHDXnBwNIvWUYBWe0xyXnAgQeScp/Sfukz1jAe8LLhhDDK3+tZ+wUPPuCXBbl+buB/YmEuCacELwUvBTKRNXAz1o7p53f9tfMMprbwuuLdCgaZx8aQzQxEDgncVRCYEvVUOJ+VoF5wy54iPpmsWxD/NRO6aysxDXFniAXILsMv8rzNjvwIzwBTwOUbwbwCFGT8V+HujSQAAAABJRU5ErkJggg==';
    this.scale_step=0.1;
  }

  init(obj_id){
    this.marker={};
    this.marker.active=-1;
    this.markers=[];
    if (typeof this.markers.length==='undefined'){
      this.markers.length=0;
    }
    this.obj_id=obj_id;
    this.obj=this.get_obj(obj_id);




    // zoom
    this.zoom=1;
    this.zoom_id=this.obj_id + '_zoom';
    let div = document.createElement('div');
    div.id = this.zoom_id;
    this.obj.appendChild(div);
    this.zoom_obj = this.get_obj(this.zoom_id);



    // canvas
    this.canvas_id=this.obj_id + '_canvas';
    let canvas = document.createElement('canvas');
    canvas.id = this.canvas_id;
    canvas.innerHTML = 'Ваш браузер не поддерживает функции для работы с картой помещения!';
    canvas.width = '600';
    canvas.height = '350';
    this.zoom_obj.appendChild(canvas); // canvas add in zoom
    this.canvas = this.get_obj(this.canvas_id);
    this.ctx = this.canvas.getContext('2d');




    // возможность масштабировать
    var self=this;
    this.addOnWheel(this.canvas, function(e) {
      var delta = e.deltaY || e.detail || e.wheelDelta;
      var zoom=self.zoom;
      if (delta > 0){
        zoom -= self.scale_step;
      } else {
        zoom += self.scale_step;
      }
      if (zoom>16){
        zoom=16;
      }
      if (zoom<0.1){
        zoom=0.1;
      }
      self.zoom=zoom;
      self.clear_all();
      self.update_background(self.pos_x,self.pos_y);
      self.update_all_markers();
      // отменим прокрутку
      e.preventDefault();
    });




    
    // style
    let style = document.createElement('style');
    style.media = 'screen';
    style.innerHTML = '';
    style.innerHTML += '#'+this.canvas_id+'{';
    style.innerHTML += 'width:600px;';
    style.innerHTML += 'height:350px;';
    style.innerHTML += '}';
    style.innerHTML += '#'+this.zoom_id+'{';
    style.innerHTML += 'border: 1px solid #cccccc;';
    style.innerHTML += 'max-width:600px;';
    style.innerHTML += 'max-height:350px;';
    style.innerHTML += 'overflow:hidden;';
    style.innerHTML += '}';
    this.obj.appendChild(style);
  }

  get_obj(obj_id){
    return document.getElementById(obj_id);
  }



  // добавление фона изображения (path - string)
  add_background(path){
    this.img_path=path;
    this.img_id=this.obj_id + '_img';
    let img = document.createElement('img');
    img.id = this.img_id;
    img.style = 'display:none;';
    img.src = this.img_path;
    this.obj.appendChild(img);
    this.img = this.get_obj(this.img_id);
    this.pos_x=0;
    this.pos_y=0;
    var self=this;
    img.onload = function() {
      self.img_width=this.width;
      self.img_height=this.height;
      self.update_background(self.pos_x,self.pos_y);
      self.update_all_markers();
      console.log('back');
  };
    this.add_move_map();
  }

  // добавление новой метки
  add_marker(x,y){
    this.marker.active=this.markers.length;
    var num_marker=this.marker.active;
    this.markers[num_marker]={};
    this.markers[num_marker].img_path=this.img_marker_red;
    this.markers[num_marker].img_id=this.obj_id + '_marker_red_img';
    let img = document.createElement('img');
    img.id = this.markers[num_marker].img_id;
    img.style = 'display:none;';
    img.src = this.markers[num_marker].img_path;
    this.obj.appendChild(img);
    this.markers[num_marker].img = this.get_obj(this.markers[num_marker].img_id);
    if (typeof x==='undefined'){
      x=this.zoom_obj.offsetWidth/2;
    }
    if (typeof y==='undefined'){
      y=this.zoom_obj.offsetHeight/2;
    }
    this.markers[num_marker].pos_x=x+this.pos_x;
    this.markers[num_marker].pos_y=y+this.pos_y;
    var self=this;
    img.onload = function() {
      self.markers[num_marker].img_width=this.width;
      self.markers[num_marker].img_height=this.height;
      // self.update_marker(self.markers[num_marker].img,self.markers[num_marker].pos_x,self.markers[num_marker].pos_y);
      self.update_all_markers();
      console.log('metka');
  };
    
  }

  // установить новые координаты для карты (переместится карта и маркеры)
  set_pos(x,y){
    this.pos_x=x;
    for (var i=0;i<this.markers.length;i++){
      this.markers[i].pos_x=this.markers[i].pos_x+x;
    }
    this.update_background(this.pos_x,this.pos_y);
    this.update_all_markers();
  }

  // обновление фона изображения с новыми координатами (для перемещения)
  update_background(x,y){
    this.clear_all();
    this.ctx.drawImage(this.img, x, y,this.img_width*this.zoom,this.img_height*this.zoom);
  }

  // обновление маркера с новыми координатами (для перемещения)
  update_marker(marker_obj,x,y){
    this.ctx.drawImage(marker_obj, x, y);
  }

  // обновление всех маркеров
  update_all_markers(smesch_x,smesch_y){
    if (typeof smesch_x==='undefined'){
    var smesch_x=0;
    }
    for (var i=0;i<this.markers.length;i++){
      // console.log(smesch_x+this.markers[i].pos_x,this.markers[i].pos_y);
      this.update_marker(this.markers[i].img,smesch_x+this.markers[i].pos_x,this.markers[i].pos_y);
    }
  }

  // очистить весь фон
  clear_all(){
    this.ctx.clearRect(0,0,this.zoom_obj.offsetWidth,this.zoom_obj.offsetHeight);
  }
  
  // добавление функций для перемещения карты с метками
  add_move_map(){
    var self=this;
    var new_x;
    var smesch_x;
    var last_pos_x;
    var last_pos_x_markers = [];
    var mouse_x;
    var move_marker_only=false;
    var mouse_down=false;

    self.canvas.onmousemove = function(event){self.canvas_mouse_move(event,self);};

      self.canvas.onmousedown = function(event){
      new_x = 0;
      mouse_x = event.offsetX;
      smesch_x = mouse_x;
      mouse_down = true;

      // определение нажатия на маркер. если нажат, то move_marker_only=true
      var hover_marker_index = self.hover_marker_index(event,self);
      move_marker_only=hover_marker_index===false?false:true;
      self.marker.active = hover_marker_index===false?'-1':hover_marker_index;
      console.log('move_marker_only',move_marker_only);

      // сохранить предыдущую позицию всех маркеров и карты
      for (var i=0;i<self.markers.length;i++){
        last_pos_x_markers[i] = self.markers[i].pos_x;
      }
      last_pos_x = self.pos_x;
      
      self.canvas.onmousemove = function(event){
        mouse_x = event.offsetX;
        new_x=mouse_x-smesch_x;
        self.clear_all();
        if (move_marker_only==true){
          self.update_background(self.pos_x,self.pos_y);
          for (var i=0;i<self.markers.length;i++){
            if (i==self.marker.active){
              self.update_marker(self.markers[self.marker.active].img,last_pos_x_markers[self.marker.active]+new_x,self.markers[self.marker.active].pos_y);
            } else {
              self.update_marker(self.markers[i].img,self.markers[i].pos_x,self.markers[self.marker.active].pos_y);
            }
          }
        } else {
          self.update_background(last_pos_x+new_x,self.pos_y);
          self.update_all_markers(new_x,self.pos_y);
        }
      }
      self.canvas.onmouseup = function(event){
        mouse_down = false;
        self.canvas.onmousemove = function(event){self.canvas_mouse_move(event,self);};
        if (move_marker_only==true){
          self.markers[self.marker.active].pos_x=last_pos_x_markers[self.marker.active]+new_x;
          self.update_background(self.pos_x,self.pos_y);
          self.update_all_markers();
        } else {
          self.pos_x=last_pos_x+new_x;
          for (var i=0;i<self.markers.length;i++){
            self.markers[i].pos_x=last_pos_x_markers[i]+new_x;
          }
          self.update_background(self.pos_x,self.pos_y);
          self.update_all_markers();
        }
        move_marker_only=false;
        self.canvas.onmouseup = null;
      }
      self.canvas.onmouseout = function(event){
        if (mouse_down==true){
          self.canvas.onmouseup(event);
        }
      }
    }
  }


  // при наведении мышкой на маркер - изменить курсор
  canvas_mouse_move(event,self){
    if (self.hover_marker_index(event,self)===false){
      self.canvas.style.cursor='default';
    } else {
      self.canvas.style.cursor='move';
    }
  }

  // возвращает:
  // - индекс маркера, если мышка на маркере
  // - false, если мышка вне диапазона,
  hover_marker_index(event,self){
    var self=this;
    var mouse_x = event.offsetX;
    var res=false;
    for (var i=0;i<this.markers.length;i++){
      if ((mouse_x+self.pos_x>=self.markers[i].pos_x*this.zoom+self.pos_x*this.zoom) && (mouse_x+self.pos_x<=(self.markers[i].pos_x*this.zoom+self.markers[i].img_width)+self.pos_x*this.zoom)){
        res=i;
        break;
      } else {
        res=false;
      }
    }
    return res;
  }






  // общее событие для всех прокруток мыши
  addOnWheel(elem, handler) {
    if (elem.addEventListener) {
      if ('onwheel' in document) {
        // IE9+, FF17+
        elem.addEventListener("wheel", handler);
      } else if ('onmousewheel' in document) {
        // устаревший вариант события
        elem.addEventListener("mousewheel", handler);
      } else {
        // 3.5 <= Firefox < 17, более старое событие DOMMouseScroll пропустим
        elem.addEventListener("MozMousePixelScroll", handler);
      }
    } else { // IE8-
      text.attachEvent("onmousewheel", handler);
    }
  }

}

const map_plan=new lcp_map_plan();