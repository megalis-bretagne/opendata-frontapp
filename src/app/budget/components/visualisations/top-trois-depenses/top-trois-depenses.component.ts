import { Component, Input, Optional } from '@angular/core';
import { EChartsOption } from 'echarts';
import { DonneesBudgetaires } from 'src/app/budget/models/donnees-budgetaires';
import { Pdc } from 'src/app/budget/models/plan-de-comptes';
import { EchartsUtilsService } from 'src/app/budget/services/echarts-utils.service';
import { PrepareDonneesVisualisation, VisualisationPourTop3 } from 'src/app/budget/services/prepare-donnees-visualisation.service';
import { PrettyCurrencyFormatter } from 'src/app/budget/services/pretty-currency-formatter';
import { object_is_empty } from 'src/app/utils';
import { BudgetParametrageComponentService } from '../../budget-parametrage/budget-parametrage-component.service';
import { EchartsViewModel } from '../EchartsViewModel';
import { VisualisationComponent } from '../visualisation.component';

@Component({
  selector: 'app-top-trois-depenses',
  templateUrl: './top-trois-depenses.component.html',
  styleUrls: ['./top-trois-depenses.component.css'],
  providers: [
    {
      provide: VisualisationComponent,
      useExisting: TopTroisDepensesComponent,
    }
  ]
})
export class TopTroisDepensesComponent extends VisualisationComponent {

  echartsVm?: EchartsViewModel;

  @Input()
  public set donneesBudget(value: DonneesBudgetaires) {
    this._donneesBudget = value;
    this.refresh()
  }

  @Input()
  public set informationsPlanDeCompte(value: Pdc.InformationsPdc) {
    this._informationsPlanDeCompte = value;
    this.refresh()
  }

  constructor(
    private mapper: PrepareDonneesVisualisation,
    private prettyCurrencyFormatter: PrettyCurrencyFormatter,
    echartsUtilsService: EchartsUtilsService,
    @Optional()
    componentService: BudgetParametrageComponentService,
  ) {
    super(echartsUtilsService, componentService);
  }

  toChartsViewModel(donnees: DonneesBudgetaires, _: Pdc.InformationsPdc): EchartsViewModel {

    let typeNomenclature: Pdc.TypeNomenclature = 'fonctions'
    if (object_is_empty(this.informationsPlanDeCompte.references_fonctionnelles)) {
      this._debug(`Pas de nomenclature par fonctions disponibles, on utilise la nomenclature par nature`);
      typeNomenclature = 'nature';
    }

    let nomenclature = Pdc.extraire_nomenclature(this.informationsPlanDeCompte, typeNomenclature)
    let donneesVisualisation = this.mapper.donneesPourTop3Depenses(donnees, nomenclature)

    let options: EChartsOption = this.echartsOptions(donneesVisualisation)

    let chartInitOptions = {}

    let chartData = {
      options,
      chartInitOptions,
    }

    return chartData;
  }

  refresh() {
    if (!this.donneesBudget || !this.informationsPlanDeCompte) return
    this.echartsVm = this.toChartsViewModel(this.donneesBudget, this.informationsPlanDeCompte)
  }

  echartsOptions(donneesVis: VisualisationPourTop3): EChartsOption {

    let barColors = ['#f58453', '#658dc1', '#c7cee8']

    let xAxisData = donneesVis.data.map(d => {
      let prettyAmont = this.prettyCurrencyFormatter.format_as_title(d.value)
      return {
        // XXX: le slice est un peu hacky, s'il n'est pas présent
        // echarts peut décider de cacher un libellé d'axe (le textStyle.width n'y change rien)
        // Le but est donc de donner une string tronquée après textStyle.width
        value: `{b|${prettyAmont}}\n ${d.groupId}`.slice(0, 50),
        // value: 'toto',
        textStyle: {
          overflow: 'truncate',
          width: 150,
        }
      }
    })
    let data = donneesVis.data.map((data, i) => {
      let color = barColors[i % barColors.length]
      return {
        ...data,
        itemStyle: {
          color
        }
      }
    })

    let option: EChartsOption = {
      title: {
        text: this.titre,
        show: false,
      },
      tooltip: {
        trigger: 'item',
        formatter: (item) => { 
          return item.data.groupId 
        }
      },
      xAxis: {
        data: xAxisData,
        axisLabel: {
          rich: {
            b: { fontWeight: 'bold' }
          },
        },
        axisTick: {
          show: false,
          lineStyle: {
            width: 0
          }
        }
      },
      yAxis: {
        show: false,
      },
      dataGroupId: '',
      animationDurationUpdate: 500,
      series: {
        type: 'bar',
        id: 'depenses',
        barWidth: '20%',
        data,
        universalTransition: {
          enabled: true,
          divideShape: 'clone'
        }
      }
    }

    this.pdf_echarts_options = option
    return option as EChartsOption
  }

  // Accessors & boilerplate
  private _donneesBudget: DonneesBudgetaires;
  public get donneesBudget(): DonneesBudgetaires {
    return this._donneesBudget;
  }

  private _informationsPlanDeCompte: Pdc.InformationsPdc;
  public get informationsPlanDeCompte(): Pdc.InformationsPdc {
    return this._informationsPlanDeCompte;
  }

  _debug(msg: string) {
    console.debug(`[Top 3 Dépenses] ${msg}`)
  }

}
