import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { FormControl, FormGroup } from '@angular/forms';

const { Storage } = Plugins;
const { Geolocation } = Plugins;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ImplementacionCapacitor';
  defaultCenter = { lat: 55.5815245, lng: 36.8251383 };
  currentCenter = Object.assign({}, this.defaultCenter);
  zoom = 3;
  limpiar(){
    this.zoom = 2;
    this.currentCenter = { lat: 0, lng: 0};
  }
  async locCapacitor() {
    const position = await Geolocation.getCurrentPosition();    
    this.zoom = 16;
    if (position !=null) {
      this.currentCenter = { lat: position.coords.latitude, lng: position.coords.longitude};      
    }
  }

  datos= new FormGroup({
    Usuario: new FormControl(''),
    Nombre: new FormControl(''),
    Ciudad: new FormControl(''),
    Numero: new FormControl('')
  }) 
  mostrar=[];
  async setObject() {
    const { keys } = await Storage.keys();  
    const {Usuario,Nombre,Ciudad,Numero}=this.datos.value
    if(!keys.includes(Usuario)){
      await Storage.set({
        key: Usuario,
        value: JSON.stringify({
          nombre: Nombre,
          ciudad: Ciudad,
          numero: Numero,
        })
      });
    }    
    this.getObject();
  }
  async getObject() {
    this.mostrar=[];    
    const { keys } = await Storage.keys();    
    keys.forEach(async (element)=>{
      const ret = await Storage.get({ key:element});
      this.mostrar.push([element,JSON.parse(ret.value)]);          
    });     
  }
  async clear() {
    await Storage.clear();
    this.getObject();
  }
}
