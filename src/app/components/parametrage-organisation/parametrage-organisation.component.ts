import {AfterViewInit, Component, OnInit, Pipe} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {GlobalState, selectAuthState} from '../../store/states/global.state';
import {selectPublicationError, } from '../../store/selectors/publication.selectors';
import {selectAllParametrage, selectParametrageLoading} from '../../store/selectors/parametrage.selectors';
import {Parametrage} from '../../models/parametrage';

import {ParametrageLoadAction, ParametrageUpdateAction} from '../../store/actions/parametrage.actions';
import {take} from 'rxjs/operators';
import {User} from '../../models/user';

@Component({
  selector: 'app-parametrage-organisation',
  templateUrl: './parametrage-organisation.component.html',
  styleUrls: ['./parametrage-organisation.component.css']
})
export class ParametrageOrganisationComponent implements OnInit, AfterViewInit  {

  private subscription: Subscription = new Subscription();
  public noData: boolean;
  public loading: boolean;
  public error$: Observable<boolean>;

  parametrageFromStore: Parametrage;
  parametrage: Parametrage;
  user: User;

  is_opendata_active = false;
  is_publication_annexes_active = false;

  form: UntypedFormGroup;

  constructor(public store: Store<GlobalState>, public formBuilder: UntypedFormBuilder) {
    this.form = formBuilder.group({
      enableDataGouv: formBuilder.control(false),
      uid: formBuilder.control(''),
      apiKey: formBuilder.control(''),
    });
  }

  ngOnInit(): void {
    this.store.pipe(select(selectAuthState), take(1)).subscribe((state) => {
      this.user = state.user;
    });
    this.store.pipe(select(selectAllParametrage)).subscribe(parametrage => this.initializeFormData(parametrage));

    this.subscription.add(this.store.pipe(select(selectParametrageLoading)).subscribe(loading => {
      if (loading) {
        this.noData = true;
      }
      this.loading = loading;
    }));
    this.error$ = this.store.pipe(select(selectPublicationError));
  }

  ngAfterViewInit(): void {
    this.loadParametrage();
  }

  private loadParametrage(): void {
    this.store.dispatch(new ParametrageLoadAction(this.user.siren));
  }

  private initializeFormData(parametrages: Parametrage[]): void {
    if (parametrages.length > 0 && (typeof (parametrages[0].id) !== 'undefined')) {
      this.parametrageFromStore = parametrages[0];
      this.is_opendata_active = this.parametrageFromStore.open_data_active;
      this.is_publication_annexes_active = this.parametrageFromStore.publication_des_annexes;
      this.form.reset(
        {
          enableDataGouv: this.parametrageFromStore.publication_data_gouv_active,
          uid: this.parametrageFromStore.uid_data_gouv,
          apiKey: this.parametrageFromStore.api_key_data_gouv
        });
    }else{
      this.form.reset(
        {
          enableDataGouv: false,
          uid: '',
          apiKey: ''
        });
    }

  }

  onFormSubmit(): void{
    let parametrage = this._make_parametrage();
    this.store.dispatch(new ParametrageUpdateAction(parametrage));
  }

  onChangeActivationOpenData(): void {
    let parametrage = this._make_parametrage();
    this.store.dispatch(new ParametrageUpdateAction(parametrage));
  }

  onChangePublierLesAnnexes(): void {
    let parametrage = this._make_parametrage();
    this.store.dispatch(new ParametrageUpdateAction(parametrage));
  }

  _make_parametrage() {
    let id = 0;
    if (typeof (this.parametrageFromStore) !== 'undefined'){
      id = this.parametrageFromStore.id;
    }
    const parametrage = (({
      id,
      open_data_active: this.is_opendata_active,
      publication_des_annexes: this.is_publication_annexes_active,
      publication_data_gouv_active: this.form.value.enableDataGouv,
      uid_data_gouv: this.form.value.uid,
      api_key_data_gouv: this.form.value.apiKey,
      siren : this.user.siren
    }) as Parametrage);
    return parametrage;
  }
}
