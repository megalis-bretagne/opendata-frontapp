import { Injectable } from '@angular/core';
import { EChartsOption } from 'echarts';

import * as echarts from 'echarts/core';

@Injectable({
  providedIn: 'root'
})
export class EchartsUtilsService {

  render_chart_as_dataurl(
    width: number,
    height: number,
    options: EChartsOption,
  ): string {
    let canvas = document.createElement('canvas')

    const chart = echarts.init(canvas, null, {
      renderer: 'canvas',
      ssr: true,
      width,
      height,
    })

    chart.setOption(options)

    let dataUrl = chart.getDataURL({
      type: 'png',
      pixelRatio: 1,
      backgroundColor: '#fff'
    });
    return dataUrl
  }

  render_chart_as_svg(
    width: number,
    height: number,
    options: EChartsOption
  ): string {
    
    const chart = echarts.init(null, null, {
      renderer: 'svg',
      ssr: true,
      width,
      height,
    })

    chart.setOption(options)

    const svgStr = chart.renderToSVGString()
    return svgStr
  }
}
