import { Component, Optional } from '@angular/core';
import { EChartsOption } from 'echarts';
import { DonneesBudgetaires } from 'src/app/budget/models/donnees-budgetaires';
import { Pdc } from 'src/app/budget/models/plan-de-comptes';
import { EchartsUtilsService } from 'src/app/budget/services/echarts-utils.service';
import { PrepareDonneesVisualisation, VisualisationPourTop3 } from 'src/app/budget/services/prepare-donnees-visualisation.service';
import { PrettyCurrencyFormatter } from 'src/app/budget/services/pretty-currency-formatter';
import { VisualisationComponentService } from '../../budget-card/budget-card-component.service';
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

  get donneesBudget() {
    return this.visualisationService.donnees_budgetaires
  }

  get informationsPlanDeCompte() {
    return this.visualisationService.informations_pdc
  }

  constructor(
    private mapper: PrepareDonneesVisualisation,
    private prettyCurrencyFormatter: PrettyCurrencyFormatter,
    echartsUtilsService: EchartsUtilsService,
    visualisationService: VisualisationComponentService,
    @Optional()
    parametrageService?: BudgetParametrageComponentService,
  ) {
    super(echartsUtilsService, visualisationService, parametrageService);
  }

  toChartsViewModel(donnees: DonneesBudgetaires, pdc: Pdc.InformationsPdc): EchartsViewModel {

    let typesNomenclaturesDisponibles = this.typesNomenclatureDisponibles(donnees, pdc)
    let typeNomenclature: Pdc.TypeNomenclature = (typesNomenclaturesDisponibles.length > 0)? typesNomenclaturesDisponibles[0] : 'fonctions'

    if (typeNomenclature != 'fonctions')
      this._debug(`Nomenclature par fonctions indisponibles avec les données actuelles. On utilisera la nomenclature ${typeNomenclature}`)

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

  _debug(msg: string) {
    console.debug(`[Top 3 Dépenses] ${msg}`)
  }

}
