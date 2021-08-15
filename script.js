// var img = document.getElementById("map_img");
// var canvas=document.getElementById('map_plan');
// var ctx = canvas.getContext('2d');

// var rect_width=200;
// var rect_height=100;
// var x_center=rect_width/2;
// var y_center=rect_height/2;
//
// window.onload = function(event) {
//
//   ctx.drawImage(img, 0, 0, img.clientWidth, img.clientHeight);
//   ctx.fillStyle='#ffff00';
//   ctx.fillRect(100,50,200,100);
//
//   canvas.onmousedown = function(event){
//     canvas.onmousemove = function(event){
//       var x = event.offsetX;
//       var y = event.offsetY;
//       ctx.clearRect(0,0,600,350);
//       ctx.fillRect(x-x_center,y-y_center,rect_width,rect_height);
//     }
//     canvas.onmouseup = function(event){
//       canvas.onmousemove = null;
//     }
//   }
// };
//
//
// function update_map(){
//
// }

class lcp_map_plan {
  constructor() {
    this.img_marker_red='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAIGNIUk0AAHolAACAgwAA+f8AAIDoAABSCAABFVgAADqXAAAXb9daH5AAAAI2SURBVHjapJY9aBVBFIW/XZLg4yVRMSm0s1ALUfAXgmATeETEn9iIYtDCLiBipSiksrESAgqKCBZaJESwEFEQxSRYBEkVsRBRFDEEU2gMJvqOzSwsw/xtfHB5u3vPnDM7e+fcyUTSbz2wE9gEdAFN4BvwFpgGvscIWiL5VqAB9AM9wAagBgj4BXwAxoERYCLIJH8cEUwJlBiPBXt8fK6HrYLhCgLlWBScTxFqE4ytUKQcV2NCtyME781yvhF8imAHfULHA4MeCPYJagabCToEhwTPA8u4zRaqm9na4AUzASJx2SP2yBY67QAtC/oTRIoYcnD8FewohNoETxygWxZRh+CS4JnBDwpaSvlM8NpTGHUEWwWzjiXbXCLpFIw7SEbNdihwxxyYV4K9CI4KmlZy0nqbK4FCOVnCrRHMWfkvgoHceFdmGcasdd8ImEtf6XoRmLfy7UB3nuap/KmQc/l0lhvntZNd1v1YQKicqwFrrfwCMIdgu2Ndfwg2WtY04vg+161vediBmRT0IFhlSjZGkglOCO4IbgoOOvaSqzKvCToLwFkH4LegUWHDXnBwNIvWUYBWe0xyXnAgQeScp/Sfukz1jAe8LLhhDDK3+tZ+wUPPuCXBbl+buB/YmEuCacELwUvBTKRNXAz1o7p53f9tfMMprbwuuLdCgaZx8aQzQxEDgncVRCYEvVUOJ+VoF5wy54iPpmsWxD/NRO6aysxDXFniAXILsMv8rzNjvwIzwBTwOUbwbwCFGT8V+HujSQAAAABJRU5ErkJggg==';
//     // красная точка на карте
// Uint8List imgPointRed = base64Decode(
//   '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');
// Uint8List imgPointGreen = base64Decode(
//   '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');
// Uint8List imgPointYellow = base64Decode(
//   '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');
// Uint8List imgPointOrange = base64Decode(
//   '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');
// Uint8List imgPointBlue1 = base64Decode(
//   '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');
// Uint8List imgPointBlue2 = base64Decode(
//   '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');

  }

  init(obj_id){
    this.marker={};
    this.marker.active=-1;
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
    };
    this.add_move_map();
  }

  // добавление новой метки
  add_marker(x,y){
    if (typeof this.markers==='undefined'){
      this.markers=[];
    }
    if (typeof this.markers.length==='undefined'){
      this.markers.length=0;
    }
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
    // this.add_move_map();
  }

  // обновление фона изображения с новыми координатами (для перемещения)
  update_background(x,y){
    this.ctx.drawImage(this.img, x, y);
    this.update_all_markers(x,y);
  }

  // обновление маркера с новыми координатами (для перемещения)
  update_marker(marker_obj,x,y){
    this.ctx.drawImage(marker_obj, x, y);
  }

  // обновление всех маркеров
  update_all_markers(x,y){
    for (var i=0;i<this.markers.length;i++){
      this.update_marker(this.markers[i].img,x+this.markers[i].pos_x,y+this.markers[i].pos_y);
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
    var mouse_x;
    self.canvas.onmousedown = function(event){
      new_x = 0;
      mouse_x = event.offsetX;
      smesch_x = mouse_x;
      last_pos_x = self.pos_x;
      self.canvas.onmousemove = function(event){
        mouse_x = event.offsetX;
        new_x=mouse_x-smesch_x;
        self.ctx.clearRect(0,0,600,350);
        self.update_background(last_pos_x+new_x,self.pos_y);
      }
      self.canvas.onmouseup = function(event){
        self.canvas.onmousemove = null;
        self.pos_x=last_pos_x+new_x;
        self.update_background(self.pos_x,self.pos_y);
      }
      self.canvas.onmouseout = self.canvas.onmouseup;
    }
  }

}

const map_plan=new lcp_map_plan();