export type LAYOUT_MODE = 'small' | 'medium' | 'large'
export interface LayoutConfig {
  mode: LAYOUT_MODE,

  show_legend: boolean,
  legend_left: number | string | 'auto'
  legend_max_width: number,
  chart_font_size: number,

  donut_horizontal_position: string,
}

const medium_layoutconfig: LayoutConfig = {
  mode: 'medium',

  show_legend: true,

  legend_max_width: 400,
  legend_left: 'right',

  chart_font_size: 20,
  donut_horizontal_position: '20%'
}
const partial_small_layoutconfig: Partial<LayoutConfig> = {
    mode: 'small',
    show_legend: false,
    donut_horizontal_position: '50%',
}
const partial_large_layoutconfig: Partial<LayoutConfig> = {
    mode: 'large',

    show_legend: true,
    legend_left: 'center',

    donut_horizontal_position: '20%'
}

const small_layoutconfig: LayoutConfig = Object.assign({}, medium_layoutconfig, partial_small_layoutconfig)
const large_layoutconfig: LayoutConfig = Object.assign({}, medium_layoutconfig, partial_large_layoutconfig)

export const LAYOUT_CONFIGS: Map<LAYOUT_MODE, LayoutConfig> = new Map([
  ['small', small_layoutconfig],
  ['medium', medium_layoutconfig],
  ['large', large_layoutconfig],
])