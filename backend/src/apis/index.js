"use strict";

let count = 500;

const costPerShareA = 1.43; //CCT
const costPerShareB = 1.65; //CMT

const entitledAmountOfShareB = 0.72;
const entitledCash = 0.259;

while (count <= 3000) {
  let totalCost = count * costPerShareA;
  let newNumberOfShareB = count * entitledAmountOfShareB;

  console.log("Total Cost : " + totalCost);
  console.log("Number Of Shares To Buy : " + count);
  console.log("Number Of Shares To Receive (New) : " + newNumberOfShareB);

  let newWorth = (costPerShareB + entitledCash) * newNumberOfShareB;
  let difference = newWorth - totalCost;

  console.log("New Worth (New) : " + newWorth);
  console.log("Difference : " + difference);
  console.log("==================");

  count = count + 100;
}
