<style>
[odd] {
  color: blue;
  background-color: lightcyan;
}
</style>

<template>
  <div class="container-fluid">
    <button @click="addRandomProduct">add random</button>
    <p>Ile jest różnych produktów: {{ produkty.length }}</p>
    <p>Ile jest wszystkich produktów: {{ iloscWszystkichProduktow }}</p>
    <p>Cena wszystkich produktów: {{ cenaWszystkichProduktow }}</p>
    <div class="text-center m-2 p-3">
      <table class="table table-sm table-bordered text-left">
        <tr>
          <th @click="sort('id')">Id</th>
          <th @click="sort('nazwa')">Nazwa</th>
          <th @click="sort('cena')">Cena</th>
          <th @click="sort('kolor')">Kolor</th>
          <th @click="sort('ilosc')">Ilość</th>
          <th>Akcje</th>
        </tr>
        <tbody>
        <tr v-for="p in sortedItems" :key="p.id" v-bind:style="{ 'background-color': p.kolor }">
          <td>{{ p.id }}</td>
          <td>{{ p.nazwa }}</td>
          <td>{{ p.cena }}</td>
          <td>{{ p.kolor }}</td>
          <td>{{ p.ilosc }}</td>
          <td>
            <button @click="addQuantity(p.id)">+</button>
            <button @click="minusQuantity(p.id)">-</button>
            <button @click="zero(p.id)">0</button>
            <button @click="remove(p.id)">remove</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div>
      <form @submit.prevent="addProduct" style="">
        <input placeholder="nazwa" v-bind:value="this.nazwaProduktu" v-on:change="onChangeName">
        <input placeholder="cena" v-bind:value="this.cenaProduktu" v-on:change="onChangePrice">
        <input type="color" placeholder="kolor" v-bind:value="this.kolorProduktu" v-on:change="onChangeColor">
        <br/>
        <button type="submit">Kliknij mnie</button>
      </form>
    </div>
    <button @click="filtruj">Filtruj elementy</button>
    <div class="text-center">
      <!-- <button class="btn btn-secondary m-1" @click="zmienSortowanie" :class="{'bg-primary' : sortowanie}">
        Zmień sortowanie
      </button>
      <button class="btn btn-secondary m-1" @click="zmienFiltrowanie" :class="{'bg-primary' : filtrowanie}">
        Zmień filtrowanie
      </button> -->
      <br/>
      <!-- &lt;!&ndash; esling-disable-next-line vue/require-v-for-key &ndash;&gt;  -->
      <!-- <button v-for="i in liczbaStron" :key="i" class="btn btn-primary m-1" :class="{'bg-warning': aktualnaStrona == i}" @click="wybierzStrone(i)">
        {{ i }}
      </button> -->
    </div>
  </div>
</template>

<script>
// import Vue from 'vue';

export default {
  name: 'MojKomponent',
  data: function () {
    return {
      produkty: [
        {id: 1, nazwa: 'Kajak', cena: 234, kolor: '#417263', ilosc: 5},
        {id: 2, nazwa: 'Kamizelka ratunkowa', cena: 49.99, kolor: '#417263', ilosc: 7},
        {id: 3, nazwa: 'Piłka do metalu', cena: 19.49, kolor: '#417d63', ilosc: 3},
        {id: 4, nazwa: 'Stadion', cena: 999000, kolor: '#4ac263', ilosc: 0},
        {id: 5, nazwa: 'Czapeczka', cena: 14.99, kolor: '#4a72e3', ilosc: 0},
        {id: 6, nazwa: 'Krzesełko', cena: 14.59, kolor: '#89123f', ilosc: 0},
        {id: 7, nazwa: 'Zabawka', cena: 19.99, kolor: '#fecda1', ilosc: 0}
      ],
      currentSort: 'name',
      currentSortDir: 'asc',
      nazwaProduktu: '',
      cenaProduktu: '',
      kolorProduktu: '',
      filtrowanie: false
    }
  },
  computed: {
    klasaElementu: function () {
      return this.wartosc ? 'bg-primary' : 'bg-info'
    },

    iloscWszystkichProduktow(){
      let suma = 0;

      this.produkty.forEach(produkt => {
        suma = suma + produkt.ilosc;
      })

      return suma;
    },

    cenaWszystkichProduktow() {
      let suma = 0;

      this.produkty.forEach(produkt => {
        suma = suma + (produkt.ilosc * produkt.cena);
      })

      return suma;
    },

    sortedItems() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.produkty.sort((a, b) => {
        let modifier = 1;
        if (this.currentSortDir === 'desc') modifier = -1;
        if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
        if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
        return 0;
      });
    },

    // wyswietlaneElementy() {
    //   return this.filtrowanie ? this.produkty.filter(p => p.ilosc > 0) : this.produkty
    // }
    // liczbaStron: function () {
    //   return Math.ceil(this.wyswietlaneElementy.length / this.rozmiarStrony)
    // },
    // elementyStrony: function () {
    //   let start = (this.aktualnaStrona - 1) * this.rozmiarStrony
    //   return this.wyswietlaneElementy.slice(start, start + this.rozmiarStrony)
    // },
    // wyswietlaneElementy: function () {
    //   let dane = this.filtrowanie ? this.produkty.filter(p => p.cena > 100) : this.produkty
    //   return this.sortowanie ? dane.concat().sort((p1, p2) => p2.cena - p1.cena) : dane
    // }
  },
  methods: {

    // zmienFiltrowanie() {
    //   this.filtrowanie = !this.filtrowanie;
    // },

    onChangeName(e) {
      this.nazwaProduktu = e.target.value
    },

    onChangePrice(e) {
      this.cenaProduktu = e.target.value
    },

    onChangeColor(e) {
      this.kolorProduktu = e.target.value
    },

    clearInputs() {
      this.nazwaProduktu = '';
      this.cenaProduktu = '';
      this.kolorProduktu = '';
    },

    addQuantity(id){
      let idx = this.produkty.findIndex(produkt => produkt.id == id);
      if(idx !== -1){
        this.produkty[idx].ilosc = this.produkty[idx].ilosc + 1;
      }
    },

    minusQuantity(id){
      let idx = this.produkty.findIndex(produkt => produkt.id == id);
      if(idx !== -1){
        let aktualnaIlosc = this.produkty[idx].ilosc - 1;
        if (aktualnaIlosc < 0)
          aktualnaIlosc = 0;
        this.produkty[idx].ilosc = aktualnaIlosc;
      }
    },

    remove(id){
      let idx = this.produkty.findIndex(produkt => produkt.id == id);
      if(idx != -1){
        this.produkty.splice(idx,1);
      }
    },

    zero(id){
      let idx = this.produkty.findIndex(produkt => produkt.id == id);
      if(idx != -1){
        this.produkty[idx].ilosc = 0;
      }
    },

    addProduct() {
      let produkt = {
        id: this.produkty.length + 1,
        ilosc: 0,
        cena: this.cenaProduktu,
        nazwa: this.nazwaProduktu,
        kolor: this.kolorProduktu,
      }
      console.log(produkt)
      this.produkty.push(produkt)
      this.clearInputs();
    },

    addRandomProduct() {
      let product = {
        id: this.produkty.length + 1,
        ilosc: Math.floor(Math.random() * 10),
        cena: (Math.random() * 100).toPrecision(3),
        nazwa: this.randomString(Math.random() * 15),
        kolor: this.randomKolor()
      }

      this.produkty.push(product);
    },

    randomString(length) {
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
      }
      return result;
    },

    randomKolor() {
      var result           = '#';
      var characters       = 'ABCDEF01234567890';
      var charactersLength = characters.length;
      for ( var i = 0; i < 6; i++ ) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
      }
      return result;
    },

    sort: function(s) {
      if(s === this.currentSort) {
        this.currentSortDir = this.currentSortDir==='asc'?'desc':'asc';
      }
      this.currentSort = s;
    },

    filtruj() {
      let produktyPoFiltrowaniu = []
      this.produkty.map((p) => {
        if (p.ilosc > 0)
          produktyPoFiltrowaniu.push(p)
      })
      this.produkty = produktyPoFiltrowaniu
    }



    // przechwycZmiane($event) {
    //   if($event.target.type === 'checkbox')
    //     this.wartosc = $event.target.checked
    //   else
    //     this.zmienna = $event.target.value
    //
    // },
    // wybierzStrone (strona) {
    //   this.aktualnaStrona = strona
    // },
    //
    // zmienSortowanie() {
    //   this.sortowanie = !this.sortowanie
    //   this.aktualnaStrona = 1
    // },
    //
    // zmienFiltrowanie() {
    //   this.filtrowanie = !this.filtrowanie
    //   this.aktualnaStrona = 1
    // },
    //
    // przechwycKlikniecie() {
    //   // this.produkty.push(this.produkty.shift())
    //   // this.produkty = this.produkty.filter(p => p.cena > 20);
    //   // this.produkty[1] = {nazwa: 'Buty do biegania', cena: '99'}
    //   // Vue.set(this.produkty, 1, {nazwa: 'Buty do biegania', cena: 99})
    //   Vue.set(this.produktyObiekt, 5, {nazwa: 'Buty do biegania', cena: '99'})
    // },
  },
  filters: {
    // waluta(wartosc, miejsc) {
    //   return new Intl.NumberFormat('pl-PL', {
    //     style: 'currency',
    //     currency: 'PLN',
    //     maximumFractionDigits: miejsc || 2,
    //     maximumSignificantDigits: miejsc || 2
    //   }).format(wartosc)
    // },
    // wielka(wartosc) {
    //   return wartosc[0].toUpperCase() + wartosc.slice(1)
    // },
    // odwroc(wartosc) {
    //   return wartosc.split('').reverse().join('')
    // }
  }
}

// export default {
//   name: 'MojKomponent',
//   data: function () {
//     return {
//       nazwa: 'laptop',
//       cena: 1990,
//       kategoria: 'Komputer',
//       nizszyPodatek: 12,
//       wyzszyPodatek: 23,
//       licznik: 0,
//       fragment: `<div class="form-group">
//                     Hasło: <input class="form-control"/>
//                 </div>`,
//       pokazElementy: true,
//       podswietlenie: false,
//       duzyTekst: false,
//     }
//   },
//   computed: {
//     nizszaCalkowitaCena: function () {
//       return this.pobierzCalkowitaCene(this.nizszyPodatek)
//     },
//     wyzszaCalkowitaCena: function () {
//       return this.pobierzCalkowitaCene(this.wyzszyPodatek)
//     },
//     klasyElementu: function () {
//       return this.podswietlenie ? ['bg-light', 'text-dark', 'display-4'] : ['bg-dark', 'text-light', 'p-2']
//     },
//     klasyElementu2: function () {
//       return {
//         'text-dark': this.podswietlenie,
//         'bg-light': this.podswietlenie
//       }
//     },
//     styleElementu: function () {
//       return {
//         'border': '5px solid red',
//         'background-color': this.podswietlenie ? 'coral' : '',
//       }
//     },
//     wartosciAtrybutow: function () {
//       return {
//         class: this.podswietlenie ? ['bg-light', 'text-dark'] : [],
//         style: {border: this.podswietlenie ? '5px solid red' : ''},
//         'data-size': this.podswietlenie ? 'big' : 'small'
//       }
//     },
//     zawartoscTekstowa: function () {
//       return this.podswietlenie ? 'Podświetlenie!' : `Produkt: ${this.nazwa}`
//     }
//   },
//   methods: {
//     pobierzCalkowitaCene(podatek) {
//       return this.cena + (this.cena * (podatek / 100))
//     },
//     przechwycKlikniecie() {
//       this.pokazElementy = !this.pokazElementy
//     },
//     przechwycKlikniecieShow() {
//       this.licznik++;
//     },
//     przechwycKlikniecieBind() {
//       this.podswietlenie = !this.podswietlenie
//     }
//   },
//   filters: {
//
//     filtruj() {
//
//     }
//     waluta(wartosc, miejsc) {
//       return new Intl.NumberFormat('pl-PL', {
//         style: 'currency',
//         currency: 'PLN',
//         maximumFractionDigits: miejsc || 2,
//         maximumSignificantDigits: miejsc || 2
//       }).format(wartosc)
//     },
//     wielka(wartosc) {
//       return wartosc[0].toUpperCase() + wartosc.slice(1)
//     },
//     odwroc(wartosc) {
//       return wartosc.split('').reverse().join('')
//     }
//   }
// }
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
