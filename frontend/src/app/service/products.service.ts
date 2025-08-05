import { Injectable } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  colors: String[];
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Pokrovček s kapalko',
      price: 0.14,
      imageUrl: 'assets/pokrovcek-s-kapalko.jpeg',
      colors: ["Default"]
    },
    {
      id: 2,
      name: 'Pokrovček s stekleno pipeto 100 ml',
      price: 0.43,
      imageUrl: 'assets/pokrovcek-stekleno-pipeto-100ml.jpeg',
      colors: ["Default"]
    },
    {
      id: 3,
      name: 'Pokrovček s stekleno pipeto 10 ml',
      price: 0.37,
      imageUrl: 'assets/pokrovcek-stekleno-pipeto-10ml.jpeg',
      colors: ["Default"]
    },
    {
      id: 4,
      name: 'Pokrovček s stekleno pipeto 15 ml',
      price: 0.37,
      imageUrl: 'assets/pokrovcek-stekleno-pipeto-15ml.jpeg',
      colors: ["Default"]
    },
    {
      id: 5,
      name: 'Pokrovček s stekleno pipeto 20 ml',
      price: 0.38,
      imageUrl: 'assets/pokrovcek-stekleno-pipeto-20ml.jpeg',
      colors: ["Default"]
    },
    {
      id: 6,
      name: 'Pokrovček s stekleno pipeto 30 ml',
      price: 0.39,
      imageUrl: 'assets/pokrovcek-stekleno-pipeto-30ml.jpeg',
      colors: ["Default"]
    },
    {
      id: 7,
      name: 'Pokrovček s stekleno pipeto 50 ml',
      price: 0.41,
      imageUrl: 'assets/pokrovcek-stekleno-pipeto-50ml.jpeg',
      colors: ["Default"]
    },
    {
      id: 8,
      name: 'Pršilka univerzalna',
      price: 0.68,
      imageUrl: 'assets/prsilka-univerzalna.jpeg',
      colors: ["Default"]
    },
    {
      id: 9,
      name: 'Steklenička za kapljevine 5 ml - rjava',
      price: 0.15,
      imageUrl: 'assets/steklenicka-kapljevine-5ml-rjava.jpeg',
      colors: ["Default"]
    },
    {
      id: 10,
      name: 'Steklenička za kapljevine 20 ml - kobalt modra',
      price: 0.22,
      imageUrl: 'assets/steklenicka-kapljevine-20ml-kobalt-modra.jpeg',
      colors: ["Default"]
    },
    {
      id: 11,
      name: 'Steklenička za kapljevine 30 ml - kobalt modra',
      price: 0.30,
      imageUrl: 'assets/steklenicka-kapljevine-30ml-kobalt-modra.jpeg',
      colors: ["Default"]
    },
    {
      id: 12,
      name: 'Steklenička za kapljevine 10 ml - kobalt modra',
      price: 0.18,
      imageUrl: 'assets/steklenicka-kapljevine-10ml-kobalt-modra.jpeg',
      colors: ["Default"]
    },
    {
      id: 13,
      name: 'Steklenička za kapljevine 50 ml - kobalt modra',
      price: 0.39,
      imageUrl: 'assets/steklenicka-kapljevine-50ml-kobalt-modra.jpeg',
      colors: ["Default"]
    },
    {
      id: 14,
      name: 'Steklenička za kapljevine 100 ml - kobalt modra',
      price: 0.49,
      imageUrl: 'assets/steklenicka-kapljevine-100ml-kobalt-modra.jpeg',
      colors: ["Default"]
    },
    {
      id: 15,
      name: 'Steklenička za kapljevine 10 ml - rjava',
      price: 0.16,
      imageUrl: 'assets/steklenicka-kapljevine-10ml-rjava.jpeg',
      colors: ["Default"]
    },
    {
      id: 16,
      name: 'Steklenička za kapljevine 15 ml - rjava',
      price: 0.18,
      imageUrl: 'assets/steklenicka-kapljevine-15ml-rjava.jpeg',
      colors: ["Default"]
    },
    {
      id: 17,
      name: 'Steklenička za kapljevine 20 ml - rjava',
      price: 0.19,
      imageUrl: 'assets/steklenicka-kapljevine-20ml-rjava.jpeg',
      colors: ["Default"]
    },
    {
      id: 18,
      name: 'Steklenička za kapljevine 30 ml - rjava',
      price: 0.27,
      imageUrl: 'assets/steklenicka-kapljevine-30ml-rjava.jpeg',
      colors: ["Default"]
    },
    {
      id: 19,
      name: 'Steklenička za kapljevine 50 ml - rjava',
      price: 0.29,
      imageUrl: 'assets/steklenicka-kapljevine-50ml-rjava.jpeg',
      colors: ["Default"]
    },
    {
      id: 20,
      name: 'Steklenička za kapljevine 100 ml - rjava',
      price: 0.39,
      imageUrl: 'assets/steklenicka-kapljevine-100ml-rjava.jpeg',
      colors: ["Default"]
    },
    {
      id: 21,
      name: 'Doza za shranjevanje živil 200 ml',
      price: 0.60,
      imageUrl: 'assets/doza-shranjevanje-zivil-200ml.jpeg',
      colors: ["Default"]
    },
    {
      id: 22,
      name: 'ČEBELICA - embalaža za med 150 ml',
      price: 0.19,
      imageUrl: 'assets/cebelica-embalaza-med-150ml.jpeg',
      colors: ["Default"]
    }
  ];

  getAllProducts(): Product[] {
    return this.products;
  }

  getProductById(id: String): Product {
    let num = Number(id);
    for (let i = 0; i < this.products.length; i++) {
      if (num == this.products[i].id) {
        return this.products[i];
      }
    }
    throw new Error("wrong id");
  }
}