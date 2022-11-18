export type LAYOUT_MODE = 'small' | 'medium' | 'large' | 'pdf'
export interface LayoutConfig {
  mode: LAYOUT_MODE,

  show_legend: boolean,

  page_icon_size: number,
  page_formatter: string,

  legend_top: number | string | 'auto'
  legend_left: number | string | 'auto'
  legend_right: number | string | 'auto'
  legend_max_width: number,
  chart_font_size: number,

  donut_horizontal_position: string,
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

const partial_pdf_layoutconfig: Partial<LayoutConfig> = {
  mode: 'pdf',

  show_legend: true,

  page_icon_size: 0,
  page_formatter: '...',

  legend_left: 'auto',
  legend_right: '10%',

  // donut_horizontal_position: '20%',
}

const medium_layoutconfig: LayoutConfig = {
  mode: 'medium',

  show_legend: true,

  page_icon_size: 15,
  page_formatter: '{current}/{total}',

  legend_max_width: 400,
  legend_top: '10%',
  legend_left: 'right',
  legend_right: 'auto',

  chart_font_size: 20,
  donut_horizontal_position: '20%'
}

const small_layoutconfig: LayoutConfig = Object.assign({}, medium_layoutconfig, partial_small_layoutconfig)
const large_layoutconfig: LayoutConfig = Object.assign({}, medium_layoutconfig, partial_large_layoutconfig)
const pdf_layoutconfig: LayoutConfig = Object.assign({}, medium_layoutconfig, partial_pdf_layoutconfig)

export const LAYOUT_CONFIGS: Map<LAYOUT_MODE, LayoutConfig> = new Map([
  ['small', small_layoutconfig],
  ['medium', medium_layoutconfig],
  ['large', large_layoutconfig],
  ['pdf', pdf_layoutconfig],
])