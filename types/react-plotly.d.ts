declare module 'react-plotly.js' {
  import { Component } from 'react';
  import Plotly from 'plotly.js';

  interface PlotParams {
    data: Plotly.Data[];
    layout?: Partial<Plotly.Layout>;
    config?: Partial<Plotly.Config>;
    frames?: Plotly.Frame[];
    onInitialized?: (figure: Plotly.Figure) => void;
    onUpdate?: (figure: Plotly.Figure) => void;
    onPurge?: (figure: Plotly.Figure) => void;
    onError?: (err: Error) => void;
    onClick?: (event: Plotly.PlotMouseEvent) => void;
    onClickAnnotation?: (event: Plotly.PlotMouseEvent) => void;
    onHover?: (event: Plotly.PlotMouseEvent) => void;
    onUnhover?: (event: Plotly.PlotMouseEvent) => void;
    onSelected?: (event: Plotly.PlotSelectionEvent) => void;
    onRelayout?: (event: Plotly.PlotRelayoutEvent) => void;
    onRestyle?: (event: Plotly.PlotRestyleEvent) => void;
    onDoubleClick?: () => void;
    style?: React.CSSProperties;
    className?: string;
    useResizeHandler?: boolean;
    debug?: boolean;
    divId?: string;
  }

  class Plot extends Component<PlotParams> {}
  export default Plot;
} 