import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const Component = React.Component;

class Dot extends Component {
  constructor(props) {
    super(props);
    
    this.state = Object.assign({}, 
                               props,
                               {r: 5});
  }
  
  componentWillReceiveProps(props) {
    // copy props to state
  }
  
  flash() {
    let node = d3.select(this.refs.circle);
    
    this.setState({colorize: true});

    node.transition()
        .attr('r', 30)
        .duration(250)
        .ease(d3.easeCubicOut)
        .transition()
        .attr('r', 5)
        .duration(150)
        .ease(d3.easeCubicOut)
        .on('end', () => this.setState({colorize: false}));
  }
  
  get color() {
    const { x, y, maxPos } = this.state;
    
    const t = d3.scaleLinear()
                .domain([0, 1.2*maxPos**2])
                .range([0, 1]);
    
    return d3.interpolateWarm(t(x**2 + y**2));
  }
  
  render() {
    const { x, y, r, colorize } = this.state;

    
    return <circle cx={x} cy={y} r={r} 
             ref="circle" onMouseOver={this.flash.bind(this)}
             style={{fill: colorize ? this.color : 'black'}} />
  }
}

class App extends Component {  
  render() {
    const width = 600,
          N = 50,
          pos = d3.scalePoint()
                  .domain(d3.range(N))
                  .range([0, width])
                  .padding(5)
                  .round(true);
    
    return (
      <svg width="600" height="600">
        {d3.range(N).map(x => 
           d3.range(N).map(y =>
             <Dot x={pos(x)} y={pos(y)} key={`${x}-${y}`} 
                  maxPos={width} />
        ))}
      </svg>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));