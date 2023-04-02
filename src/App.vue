<style>
  [odd] {color: blue; background-color: lightcyan}
</style>

<template>
  <div class="container-fluid">
    <div class="m-2 p-3">
      <h1>Michal</h1>
      <div>Ile różnych produktów? {{iloscRoznych}}</div>
      <div>Ile wszystkich produktów? {{iloscRazem}}</div>
      <div>Cena wszystkich produktów? {{wartoscKoszyka | waluta}}</div>
    </div>
    <div class="text-center m-2 p-3">
      <table class="table table-sm table-bordered text-left">
        <tr>
          <th v-on:click="zmienSortowanie('id')">Id</th>
          <th v-on:click="zmienSortowanie('nazwa')">Nazwa</th>
          <th v-on:click="zmienSortowanie('cena')">Cena</th>
          <th>Kolor</th>
          <th v-on:click="zmienSortowanie('ilosc')">ilość</th>
          <th></th>
        </tr>
        <tbody>
        <tr v-for="p in elementyStrony" v-bind:key="p.id" v-bind:style="{ 'background-color': p.kolor }" style="color: whitesmoke">
          <td>{{p.id}}</td>
          <td>{{p.nazwa}}</td>
          <td>{{p.cena | waluta}}</td>
          <td >{{p.kolor}}</td>
          <td>{{p.ilosc}}</td>
          <button class="btn btn-primary m-1" v-on:click="dodaj(p.id, p.ilosc)">+</button>
            <button class="btn btn-primary m-1" v-on:click="odejmij(p.id, p.ilosc)">-</button>
            <button class="btn btn-primary m-1" v-on:click="wyzeruj(p.id)">0</button>
            <button class="btn btn-primary m-1" v-on:click="usunProdukt(p.id)">Usun</button>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="row">
      <div class="text-center">
        <button type="button" class="btn btn-primary mt-1 mb-1" v-on:click="showForm">Dodaj nowy produkt</button>
        <button type="button" class="btn btn-primary mt-1 mb-1 m-1" v-on:click="addRand">Dodaj losowy produkt</button>
      </div>
    </div>

    <div class="row" v-bind:class="{ 'd-none': !additionVisible}">
        <div class="col">
          <label class="form-label" for="nazwa-in">
            Nazwa
          </label>
          <input class="form-control" type="text" id="nazwa-in" name="nazwa" v-model="produktAddition.nazwa">
        </div>
        <div class="col">
          <label class="form-label" for="cena-in">
            Cena
          </label>
          <input class="form-control" type="number" id="cena-in" name="cena" v-model="produktAddition.cena">
        </div>
        <div class="col">
          <label class="form-label" for="kolor-in">
            Kolor
          </label>
          <input class="form-control form-control-color" type="color" id="kolor-in" name="kolor" v-model="produktAddition.kolor">
        </div>
        <div class="col-12">
          <button class="d-block btn btn-primary mt-1" type="button" v-on:click="add">Dodaj</button>
        </div>
    </div>

    <div class="text-center">
      <button class="btn btn-primary m-1" v-on:click="zmienFiltrowanie" v-bind:class="{'bg-primary': filtrowanie}">Filtrowanie</button><br/>
      <button v-for="i in liczbaStron" :key="i" v-on:click="wybierzStrone(i)" class="btn btn-primary m-1" v-bind:class="{'bg-warning': aktualnaStrona == i}">{{ i }}</button>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
let randomNames = ["Piłka", "Czapka", "Zabawka", "Mango", "Awokado", "Ananas", "Papier"]
let randomColors = ["#FF00FF", "#40AAFA", "#40AAFF", "#000000", "#FF0000", "#00FF00", "#0000FF"]
export default {
  name: 'MojKomponent',
  data: function () {
    return {
      rozmiarStrony: 10,
      additionVisible: false,
      aktualnaStrona: 1,
      filtrowanie: false,
      sortowanie: "",
      produkty: [
      ],

      produktAddition: {
        id: null,
        nazwa: "",
        cena: 0,
        kolor: "",
        ilosc: 0
      },
    }
  },
  computed: {
    wyswietlanieElementy() {
      let dane = this.filtrowanie ?
          this.produkty.filter(p => p.ilosc > 0) : this.produkty;

      if(this.sortowanie != ''){
        switch(this.sortowanie){
          case 'id':
            return dane.concat().sort((p1, p2) => p2.id < p1.id);
          case 'idD':
            return dane.concat().sort((p1, p2) => p2.id > p1.id);
          case 'nazwa':
            return dane.concat().sort((p1, p2) => p2.nazwa < p1.nazwa);
          case 'nazwaD':
            return dane.concat().sort((p1, p2) => p2.nazwa > p1.nazwa);
          case 'cena':
            return dane.concat().sort((p1, p2) => parseFloat(p2.cena) < parseFloat(p1.cena));
          case 'cenaD':
            return dane.concat().sort((p1, p2) => parseFloat(p2.cena) > parseFloat(p1.cena));
          case 'ilosc':
            return dane.concat().sort((p1, p2) => p2.ilosc < p1.ilosc);
          case 'iloscD':
              return dane.concat().sort((p1, p2) => p2.ilosc > p1.ilosc);
        }
      }

      return this.sortowanie ?
          dane.concat().sort((p1, p2) => p2.id - p1.id): dane;
    },
    liczbaStron() {
      return Math.ceil(this.wyswietlanieElementy.length / this.rozmiarStrony);
    },
    elementyStrony() {
      let start = (this.aktualnaStrona - 1) * this.rozmiarStrony;
      return this.wyswietlanieElementy.slice(start, start + this.rozmiarStrony);
    },
    iloscRoznych() {
      return this.produkty.length;
    },
    iloscRazem() {
      return this.produkty.reduce((sum, item) => sum + item.ilosc, 0)
    },
    wartoscKoszyka() {
      return this.produkty.reduce((sum, item) => sum + (item.ilosc * item.cena), 0)
    }
  },
  methods: {
    wybierzStrone(strona) {
      this.aktualnaStrona = strona;
    },
    zmienSortowanie(col) {
      if(this.sortowanie == col){
        this.sortowanie = col + 'D';
      }
      else {
        this.sortowanie = col;
      }
    },
    zmienFiltrowanie() {
      this.filtrowanie = !this.filtrowanie;
      this.aktualnaStrona = 1;
    },
    dodaj(id, ilosc) {
      Vue.set(this.produkty.find(p => p.id == id), 'ilosc', 1 + ilosc)
    },
    odejmij(id, ilosc) {
      if(ilosc > 0){
        Vue.set(this.produkty.find(p => p.id == id), 'ilosc', ilosc - 1)
      } else {
        Vue.set(this.produkty.find(p => p.id == id), 'ilosc', 0)
      }
    },
    wyzeruj(id){
      Vue.set(this.produkty.find(p => p.id == id), 'ilosc', 0);
    },
    usunProdukt(id) {
      this.$delete(this.produkty, this.produkty.indexOf(this.produkty.find(p => p.id == id)));
    },
    getMaxId() {
      let ids = this.produkty.map(p => p.id)
      return Math.max(0,...ids)
    },
    add() {
      let maxId = this.getMaxId()
      let kolor = this.produktAddition.kolor;
      if(kolor == null || kolor == "")
      {
        kolor = "#000000"
      }
      let toAdd = {
        id: maxId + 1,
        nazwa: this.produktAddition.nazwa,
        cena: this.produktAddition.cena,
        kolor: kolor,
        ilosc: 0
      }

      this.produkty.push(toAdd)

      this.produktAddition.nazwa = ""
      this.produktAddition.cena = 0
      this.produktAddition.kolor = "#000000"
    },
    addRand() {
      let maxId = this.getMaxId()
      let kolor = randomColors[Math.floor(Math.random() * randomColors.length)]
      let nazwa = randomNames[Math.floor(Math.random() * randomNames.length)]
      let randomCena = (Math.random() * (1000 - 1) + 1).toFixed(2)
      let toAdd = {
        id: maxId + 1,
        nazwa: nazwa,
        cena: randomCena,
        kolor: kolor,
        ilosc: 0
      }
      this.produkty.push(toAdd)
    },
    showForm() {
      this.additionVisible = !this.additionVisible;
    }
  },
  filters: {
    waluta(wartosc, miejsc) {
      return new Intl.NumberFormat("pl-PL",
          {
            style: "currency", currency: "PLN",
            minimumFractionDigits: miejsc || 2,
            maximumFractionDigits: miejsc || 2
          }).format(wartosc);
    },
    wielka(wartosc){
      return wartosc[0].toUpperCase() + wartosc.slice(1);
    },
    odwroc(wartosc) {
      return wartosc.split("").reverse().join("");
    }
  }
}
</script>