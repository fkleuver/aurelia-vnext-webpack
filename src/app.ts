import { customElement } from '@aurelia/runtime';
import { select as d3select, mouse as d3mouse } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { Pythagoras, IPythagorasProps } from './pythagoras';

@customElement({
  name: 'app',
  templateOrNode: require('./app.html'),
  build: {
    required: true,
    compiler: 'default'
  },
  instructions: []
})
export class App {

  width = Math.min(window.innerWidth, 1280);
  height = this.width * (600 / 1280);
  currentMax = 0;
  baseW = 80;
  heightFactor = 0;
  lean = 0;
  realMax = 11;

  public readonly svg: SVGSVGElement;
  public readonly rootNode: Pythagoras;

  bind() {
    // this.rootNode.update(this.getRootProps());
    this.updateRoot();
  }

  attached() {
    this.next();
    d3select(this.svg).on('mousemove', this.onMousemove);
  }

  private next = () => {
    if (this.currentMax < this.realMax) {
      this.currentMax++;
      // this.rootNode.update(this.getRootProps());
      this.updateRoot();
      setTimeout(this.next, 500);
    }
  }

  // private onMousemove: Function = () => {
  //   let [x, y] = d3mouse(this.svg);

  //   let scaleFactor = scaleLinear()
  //     .domain([this.height, 0])
  //     .range([0, .8]);

  //   let scaleLean = scaleLinear()
  //     .domain([0, this.width / 2, this.width])
  //     .range([.5, 0, -.5]);

  //   this.heightFactor = scaleFactor(y);
  //   this.lean = scaleLean(x);
  //   // this.rootNode.update(this.getRootProps());
  //   this.updateRoot()
  // };

  onMousemove: Function = (x: number, y: number) => {
    // let [x, y] = d3mouse(this.svg);

    let scaleFactor = scaleLinear()
      .domain([this.height, 0])
      .range([0, .8]);

    let scaleLean = scaleLinear()
      .domain([0, this.width / 2, this.width])
      .range([.5, 0, -.5]);

    this.heightFactor = scaleFactor(y);
    this.lean = scaleLean(x);
    // this.rootNode.update(this.getRootProps());
    this.updateRoot()
  };

  // throttleValueChanged(value: number) {
  //   if (this.svg) {
  //     d3select(this.svg)
  //       .on('mousemove',
  //         !value
  //           ? this.onMousemove
  //           : throttle(this.onMousemove, value)
  //       );
  //   }
  // }

  private updateRoot() {
    // let parent = this.rootNode.element.parentElement;
    // parent.removeChild(this.rootNode.element);
    // this.rootNode.element.style.display = 'none';
    // this.rootNode.element.style.visibility = 'hidden';
    this.rootNode.element.style.opacity = '0';
    this.rootNode.update(this.baseW, this.width / 2 - 40, this.height - this.baseW, this.heightFactor, this.lean, 0, this.currentMax, undefined, 1);
    this.rootNode.element.style.opacity = '1';
    // this.rootNode.element.style.visibility = '';
    // this.rootNode.element.style.display = '';
    // parent.appendChild(this.rootNode.element);
  }

  private getRootProps(): IPythagorasProps {
    return {
      x: this.width / 2 - 40,
      y: this.height - this.baseW,
      w: this.baseW,
      heightFactor: this.heightFactor,
      lean: this.lean,
      lvl: 0,
      maxlvl: this.currentMax,
      branch: undefined
    };
  }
}
