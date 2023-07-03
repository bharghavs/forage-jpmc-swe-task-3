import { ServerRespond } from './DataStreamer';

export interface Row {
  /* Bharghav - 07/03/2023 - mod - Changes to the schema */
  /*
  stock: string,
  top_ask_price: number,
  timestamp: Date,
  */
  price_abc: number,
  price_def: number,
  ratio: number,
  timestamp: Date,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined,
  /* Bharghav - 07/03/2023 - end - Changes to the schema */
}


export class DataManipulator {
  /* Bharghav - 07/03/2023 - del - Changes to the schema */
  /*
  static generateRow(serverResponds: ServerRespond[]) {
    return serverResponds.map((el: any) => {
      return {
        stock: el.stock,
        top_ask_price: el.top_ask && el.top_ask.price || 0,
        timestamp: el.timestamp,
      };
    })
  }
  */
  /* Bharghav - 07/03/2023 - end - Changes to the schema */
  /* Bharghav - 07/03/2023 - add - Code as per the instructions given in the PDF document */ 
  static generateRow(serverRespond: ServerRespond[]): Row {
    const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;
    const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2;
    const ratio = priceABC / priceDEF;
    const upperBound = 1 + 0.05;
    const lowerBound = 1 - 0.05;
    return {
      price_abc: priceABC,
      price_def: priceDEF,
      ratio,
      timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp ?
        serverRespond[0].timestamp : serverRespond[1].timestamp,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      trigger_alert: (ratio > upperBound || ratio < lowerBound) ? ratio : undefined,
    };
  }
  /* Bharghav - 07/03/2023 - end - Code as per the instructions given in the PDF document */
}