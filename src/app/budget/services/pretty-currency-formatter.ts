import { Injectable } from "@angular/core";

@Injectable()
export class PrettyCurrencyFormatter {

    till999 = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
    });

    over999 = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
    });

    format(amount: number) {
        return this._getFormatter(amount).format(amount);
    }

    format_as_title(amount: number) {
        if (amount < 1_000_000)
            return this.format(amount);

        let nMillions = Math.trunc(amount / 1_000_000);
        let rest = amount % 1_000_000;
        let n100Mil = Math.trunc(rest / 100_000);

        if (n100Mil == 0)
            return `${nMillions} M€`
        else
            return `${nMillions},${n100Mil} M€`;
    }

    _getFormatter(amount: number) {

        if (amount >= 1000) {
            return this.over999;
        } else {
            return this.till999;
        }
    }
}