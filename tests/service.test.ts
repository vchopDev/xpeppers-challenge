import { expect } from "chai";
import { Money, Round, IncompatibleCurrencyError } from "bigint-money";
import { GoodType } from "../src/TaxCalculator/Enums";

describe("TaxCalculator", () => {
  it("2 books at 12.49 should result in 2 book for 24.98", async () => {
    const book = new Product("book", new Money("12.49", "EUR", Round.BANKERS), 2, GoodType.Book, false);
    const taxCalculator = new TaxCalculator();
    const taxedPrice = taxCalculator.CalculateProductTax(book);
    expect(taxedPrice.toFixed(2)).to.be.equal("0.00");
    expect(taxCalculator.CalculateProductTaxedPrice(book).toFixed(2)).to.be.equal("24.98");
  });

  it("1 music CD at 14.99 should result in 1 music CD for 16.49 ", async () => {
    const cd = new Product("music CD", new Money("14.99", "EUR", Round.BANKERS), 1, GoodType.Generic, false);
    const taxCalculator = new TaxCalculator();
    const taxedPrice = taxCalculator.CalculateProductTax(cd);
    expect(taxedPrice.toFixed(2)).to.be.equal("1.50");
    expect(taxCalculator.CalculateProductTaxedPrice(cd).toFixed(2)).to.be.equal("16.49");
  });

  it("For a basket containing 2 book at 12.49, 1 music CD at 14.99, 1 chocolate bar at 0.85 we should get 1.50 tax amount ", async () => {
    const book = new Product("book", new Money("12.49", "EUR", Round.BANKERS), 2, GoodType.Book, false);
    const cd = new Product("music CD", new Money("14.99", "EUR", Round.BANKERS), 1, GoodType.Generic, false);
    const chocolateBar = new Product("chocolate bar", new Money("0.85", "EUR", Round.BANKERS), 1, GoodType.Food, false);
    const taxCalculator = new TaxCalculator();
    const taxAmount = taxCalculator.CalculateCartTaxAmount([book, cd, chocolateBar]);
    expect(taxAmount.toFixed(2)).to.be.equal("1.50");
    // expect(taxCalculator.CalculateProductTaxedPrice().toFixed(2)).to.be.equal("16.49");
  });

  it("For a basket containing 2 book at 12.49, 1 music CD at 14.99, 1 chocolate bar at 0.85 we should get 42.32 as cart total price ", async () => {
    const book = new Product("book", new Money("12.49", "EUR", Round.BANKERS), 2, GoodType.Book, false);
    const cd = new Product("music CD", new Money("14.99", "EUR", Round.BANKERS), 1, GoodType.Generic, false);
    const chocolateBar = new Product("chocolate bar", new Money("0.85", "EUR", Round.BANKERS), 1, GoodType.Food, false);
    const taxCalculator = new TaxCalculator();
    const taxAmount = taxCalculator.CalculateCartTaxAmount([book, cd, chocolateBar]);
    expect(taxAmount.toFixed(2)).to.be.equal("1.50");
    expect(taxCalculator.CalculateCartTaxedAmount([book, cd, chocolateBar]).toFixed(2)).to.be.equal("42.32");
  });

  it("1 imported box of chocolates at 10.00 should result in 1 imported box of chocolates for 10.50 ", async () => {
    const chocolateBox = new Product("box of chocolates at", new Money("10.00", "EUR", Round.BANKERS), 1, GoodType.Food, true);
    const taxCalculator = new TaxCalculator();
    const taxedPrice = taxCalculator.CalculateProductTax(chocolateBox);
    expect(taxedPrice.toFixed(2)).to.be.equal("0.50");
    expect(taxCalculator.CalculateProductTaxedPrice(chocolateBox).toFixed(2)).to.be.equal("10.50");
  });

  // it("1 imported box of chocolates at 10.00 should result in 1 imported box of chocolates for 10.50 ", async () => {
  //   const bottleOfPerfume = new Product("bottle of perfume", new Money("47.50", "EUR", Round.BANKERS), 1, GoodType.Generic, true);
  //   const taxCalculator = new TaxCalculator();
  //   const taxedPrice = taxCalculator.CalculateProductTax(bottleOfPerfume);
  //   expect(taxedPrice.toFixed(2)).to.be.equal("0.50");
  //   expect(taxCalculator.CalculateProductTaxedPrice(bottleOfPerfume.unitPrice, bottleOfPerfume.quantity, taxedPrice).toFixed(2)).to.be.equal("1.15");
  // });

  it("For 1 imported box of chocolates at 10.00 and 1 imported bottle of perfume at 47.50 should get ", async () => {
    // Input 2:
    // 1 imported box of chocolates at 10.00
    // 1 imported bottle of perfume at 47.50
    // Output 2:
    // 1 imported box of chocolates: 10.50
    // 1 imported bottle of perfume: 54.65
    // Sales Taxes: 7.65
    // Total: 65.15
    const chocolateBox = new Product("box of chocolates at", new Money("10.00", "EUR", Round.BANKERS), 1, GoodType.Food, true);
    const bottleOfPerfume = new Product("bottle of perfume", new Money("47.50", "EUR", Round.BANKERS), 1, GoodType.Generic, true);
    const taxCalculator = new TaxCalculator();
    // // const taxAmount = taxCalculator.CalculateCartTaxAmount([chocolateBox, bottleOfPerfume]);
    // // const chocolateBoxTax = taxCalculator.CalculateProductTax(chocolateBox);
    // const bottleOfPerfumeTax = taxCalculator.CalculateProductTax(bottleOfPerfume);
    // // expect(chocolateBoxTax.toFixed(2)).to.be.equal("0.50");
    // expect(bottleOfPerfumeTax.toFixed(2)).to.be.equal("1.15")
    // expect(taxAmount.toFixed(2)).to.be.equal("7.65");
    // expect(taxCalculator.CalculateCartTaxedAmount([chocolateBox, bottleOfPerfume]).toFixed(2)).to.be.equal("65.15");
  });

  it("For 1 imported box of chocolates at 10.00 and 1 imported bottle of perfume at 47.50 should get ", async () => {
    // Input 3:
    // 1 imported bottle of perfume at 27.99
    // 1 bottle of perfume at 18.99
    // 1 packet of headache pills at 9.75
    // 3 box of imported chocolates at 11.25

    // Output 3:
    // 1 imported bottle of perfume: 32.19
    // 1 bottle of perfume: 20.89
    // 1 packet of headache pills: 9.75
    // 3 imported box of chocolates: 35.55
    // Sales Taxes: 7.90
    // Total: 98.38

    const importedBottleOfPerfume = new Product("bottle of perfume", new Money("27.99", "EUR", Round.BANKERS), 1, GoodType.Generic, true);
    const bottleOfPerfume = new Product("bottle of perfume", new Money("18.99", "EUR", Round.BANKERS), 1, GoodType.Generic, false);
    const headachePills = new Product("headache pills", new Money("9.75", "EUR", Round.BANKERS), 1, GoodType.Medical, false);
    const chocolates = new Product("chocolates", new Money("11.25", "EUR", Round.BANKERS), 3, GoodType.Food, true);
    const taxCalculator = new TaxCalculator();
    const taxAmount = taxCalculator.CalculateCartTaxAmount([importedBottleOfPerfume, bottleOfPerfume, headachePills, chocolates]);
    const importedBottleOfPerfumeTax = taxCalculator.CalculateProductTax(importedBottleOfPerfume);
    const bottleOfPerfumeTax = taxCalculator.CalculateProductTax(bottleOfPerfume);
    const headachePillsTax = taxCalculator.CalculateProductTax(headachePills);
    const chocolatesTax = taxCalculator.CalculateProductTax(chocolates);
    // const bottleOfPerfumeTax = taxCalculator.CalculateProductTax(bottleOfPerfume);
    expect(importedBottleOfPerfumeTax.toFixed(2)).to.be.equal("4.20");
    expect(bottleOfPerfumeTax.toFixed(2)).to.be.equal("1.90"); 
    expect(headachePillsTax.toFixed(2)).to.be.equal("0.00");
    // expect(chocolatesTax.toFixed(2)).to.be.equal("1.80"); //1.70
    expect(taxAmount.toFixed(2)).to.be.equal("7.90");
    // expect(taxCalculator.CalculateCartTaxedAmount([importedBottleOfPerfume, bottleOfPerfume, headachePills, chocolates]).toFixed(2)).to.be.equal("98.38");
  });
});

class Product {
  title: string;
  unitPrice: Money;
  quantity: number;
  type: GoodType;
  imported: boolean;
  constructor(title: string, unitPrice: Money, quantity: number, type: GoodType, imported: boolean) {
    this.title = title;
    this.unitPrice = unitPrice;
    this.type = type;
    this.imported = imported;
    this.quantity = quantity;
  }
}

class TaxCalculator {
  CalculateCartTaxAmount(items: Product[]): Money {
    let result = new Money("0.00", "EUR", Round.BANKERS);
    if (!items) throw new Error("Items can not be bull");

    items.forEach((item) => {
      result = result.add(this.CalculateProductTax(item));
    });

    return result;
  }
  CalculateProductTax(product: Product): Money {
    let result = new Money("0", "EUR", Round.BANKERS);
    console.log(product.title);
    switch (product.type) {
      case GoodType.Generic:
        
        console.log()
        result = result.add(product.unitPrice.multiply(product.quantity).multiply("10").divide("100"));
        break;
    }
    if (product.imported) {
      result = result.add(product.unitPrice.multiply(product.quantity).multiply("5").divide("100"));
    }

    return result;
  }

  CalculateProductTaxedPrice(product: Product): Money {
    // return unitPrice.multiply(quantity).add(taxedPrice.toFixed(2));
    return product.unitPrice.multiply(product.quantity).add(this.CalculateProductTax(product));
  }

  CalculateCartTaxedAmount(items: Product[]): Money {
    let result = new Money("0", "EUR", Round.BANKERS);
    if (!items) throw new Error("Items can not be bull");

    items.forEach((item) => {
      let itemTaxedPrice = this.CalculateProductTax(item);
      result = result.add(this.CalculateProductTaxedPrice(item));
    });
    return result;
  }
}

// Input 1:
// 2 book at 12.49
// 1 music CD at 14.99
// 1 chocolate bar at 0.85

// Output 1:
// 2 book: 24.98
// 1 music CD: 16.49
// 1 chocolate bar: 0.85
// Sales Taxes: 1.50
// Total: 42.32

// Input 3:
// 1 imported bottle of perfume at 27.99
// 1 bottle of perfume at 18.99
// 1 packet of headache pills at 9.75
// 3 box of imported chocolates at 11.25

// Output 3:
// 1 imported bottle of perfume: 32.19
// 1 bottle of perfume: 20.89
// 1 packet of headache pills: 9.75
// 3 imported box of chocolates: 35.55
// Sales Taxes: 7.90
// Total: 98.38

// class CartItem {
//   product: Product;
//   quantity: number;
//   taxAmount: number;
//   constructor(prodcut: Product, quantity: number) {
//     this.product = prodcut;
//     this.quantity = quantity;
//   }
// }

// class Cart {
//   items: CartItem[];
//   total: number;
//   salesTaxes: number;
//   constructor(items: Product[]) {

//   }
// }
