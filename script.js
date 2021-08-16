class lcp_map_plan {
  constructor() {
    // красная точка на карте
    this.img_marker_red='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAIGNIUk0AAHolAACAgwAA+f8AAIDoAABSCAABFVgAADqXAAAXb9daH5AAAAI2SURBVHjapJY9aBVBFIW/XZLg4yVRMSm0s1ALUfAXgmATeETEn9iIYtDCLiBipSiksrESAgqKCBZaJESwEFEQxSRYBEkVsRBRFDEEU2gMJvqOzSwsw/xtfHB5u3vPnDM7e+fcyUTSbz2wE9gEdAFN4BvwFpgGvscIWiL5VqAB9AM9wAagBgj4BXwAxoERYCLIJH8cEUwJlBiPBXt8fK6HrYLhCgLlWBScTxFqE4ytUKQcV2NCtyME781yvhF8imAHfULHA4MeCPYJagabCToEhwTPA8u4zRaqm9na4AUzASJx2SP2yBY67QAtC/oTRIoYcnD8FewohNoETxygWxZRh+CS4JnBDwpaSvlM8NpTGHUEWwWzjiXbXCLpFIw7SEbNdihwxxyYV4K9CI4KmlZy0nqbK4FCOVnCrRHMWfkvgoHceFdmGcasdd8ImEtf6XoRmLfy7UB3nuap/KmQc/l0lhvntZNd1v1YQKicqwFrrfwCMIdgu2Ndfwg2WtY04vg+161vediBmRT0IFhlSjZGkglOCO4IbgoOOvaSqzKvCToLwFkH4LegUWHDXnBwNIvWUYBWe0xyXnAgQeScp/Sfukz1jAe8LLhhDDK3+tZ+wUPPuCXBbl+buB/YmEuCacELwUvBTKRNXAz1o7p53f9tfMMprbwuuLdCgaZx8aQzQxEDgncVRCYEvVUOJ+VoF5wy54iPpmsWxD/NRO6aysxDXFniAXILsMv8rzNjvwIzwBTwOUbwbwCFGT8V+HujSQAAAABJRU5ErkJggg==';
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
    this.canvas_id=this.obj_id + '_canvas';

    let canvas = document.createElement('canvas');
    canvas.id = this.canvas_id;
    canvas.innerHTML = 'Ваш браузер не поддерживает функции для работы с картой помещения!';
    canvas.width = '600';
    canvas.height = '350';
    this.obj.appendChild(canvas);

    this.canvas = this.get_obj(this.canvas_id);

    let style = document.createElement('style');
    style.media = 'screen';
    style.innerHTML = '';
    style.innerHTML += '#'+this.canvas_id+'{';
    style.innerHTML += 'border: 1px solid #cccccc;';
    style.innerHTML += 'width:600px;';
    style.innerHTML += 'height:350px;';
    style.innerHTML += '}';
    this.obj.appendChild(style);

    this.ctx = this.canvas.getContext('2d');
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
      self.update_all_markers(self.pos_x,self.pos_y);
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
    var self=this;
    img.onload = function() {
      self.markers[num_marker].img_width=this.width;
      self.markers[num_marker].img_height=this.height;
      if (typeof x==='undefined'){
        x=self.canvas.clientWidth/2-this.width/2;
      }
      if (typeof y==='undefined'){
        y=self.canvas.clientHeight/2-this.height/2;
      }
      self.markers[num_marker].pos_x=x;
      self.markers[num_marker].pos_y=y;
      self.update_marker(self.markers[num_marker].img,x,y);
    };
  }

  // обновление фона изображения с новыми координатами (для перемещения)
  update_background(x,y){
    this.ctx.drawImage(this.img, x, y);
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
      this.update_marker(this.markers[i].img,smesch_x+this.markers[i].pos_x,this.markers[i].pos_y);
    }
  }

  // получение координат маркеров, относительно карты
  get_coordinate_marker_with_map_x(x){
    return x+this.pos_x;
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
        self.ctx.clearRect(0,0,600,350);
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
      if ((mouse_x+self.pos_x>=self.markers[i].pos_x+self.pos_x) && (mouse_x+self.pos_x<=(self.markers[i].pos_x+self.markers[i].img_width)+self.pos_x)){
        res=i;
        break;
      } else {
        res=false;
      }
    }
    return res;
  }




}

const map_plan=new lcp_map_plan();