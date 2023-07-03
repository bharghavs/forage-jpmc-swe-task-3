import React, { Component } from 'react';
/* Bharghav - 07/03/2023 - mod - Changes to the schema */
/* import { Table } from '@finos/perspective'; */
import { Table, TableData } from '@finos/perspective';
/* Bharghav - 07/03/2023 - end - Changes to the schema */
import { ServerRespond } from './DataStreamer';
import { DataManipulator } from './DataManipulator';
import './Graph.css';

interface IProps {
  data: ServerRespond[],
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}
class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    // Get element from the DOM.
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    const schema = {
      /* Bharghav - 07/03/2023 - mod - Changes to the schema */
      /*
      stock: 'string',
      top_ask_price: 'float',
      top_bid_price: 'float',
      timestamp: 'date',
      */
      price_abc: 'float',
      price_def: 'float',
      ratio: 'float',
      timestamp: 'date',
      upper_bound: 'float',
      lower_bound: 'float',
      trigger_alert: 'float',
      /* Bharghav - 07/03/2023 - end - Changes to the schema */
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference.
      elem.load(this.table);
      elem.setAttribute('view', 'y_line');
      /* Bharghav - 07/03/2023 - mod - Changes to the schema */
      /*
      elem.setAttribute('column-pivots', '["stock"]');
      elem.setAttribute('row-pivots', '["timestamp"]');
      elem.setAttribute('columns', '["top_ask_price"]');
      */
      elem.setAttribute('row-pivots', '["timestamp"]');
      elem.setAttribute('columns', '["ratio", "lower_bound", "upper_bound", "trigger_alert"]');
      /* Bharghav - 07/03/2023 - end - Changes to the schema */
      elem.setAttribute('aggregates', JSON.stringify({
      /* Bharghav - 07/03/2023 - mod - Changes to the schema */
        /*
        stock: 'distinctcount',
        top_ask_price: 'avg',
        top_bid_price: 'avg',
        timestamp: 'distinct count',
        */
        price_abc: 'avg',
        price_def: 'avg',
        ratio: 'avg',
        timestamp: 'distinct count',
        upper_bound: 'avg',
        lower_bound: 'avg',
        trigger_alert: 'avg',
      /* Bharghav - 07/03/2023 - end - Changes to the schema */
      }));
    }
  }

  componentDidUpdate() {
    if (this.table) {
      this.table.update([
        DataManipulator.generateRow(this.props.data),
      ] as unknown as TableData);
    }
  }
}

export default Graph;
